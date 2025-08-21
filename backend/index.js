require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

// Custom token to log request body
morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(express.static("dist"));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

// Return the length of the phonebook and current time
app.get("/info", (req, res) => {
  Person.find({}).then((people) => {
    res.send(`<h1>Phonebook Information</h1>
              <p>There are ${people.length} people in the phonebook.</p>
              <p>${new Date()}</p>`);
  });
});

app.get("/api/people", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/api/people/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send("Person not found");
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/people/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).send();
    })
    .catch((error) => next(error));
});

app.post("/api/people", (req, res) => {
  const body = req.body;

  if (!body.name || !body.phone) {
    return res.status(400).json({
      error: "name or phone missing",
    });
  }

  const newPerson = new Person({
    name: body.name,
    phone: body.phone,
  });
  newPerson.save().then((savedPerson) => {
    res.status(201).json(savedPerson);
  });
});

// Update a person's phone number, if that person exists
app.put("/api/people/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  if (!body.phone) {
    return res.status(400).json({
      error: "phone missing",
    });
  }

  Person.findByIdAndUpdate(id, { phone: body.phone }, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).send("Person not found");
      }
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "😵‍💫 unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error("❗️ Error:", error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🤖 Server is running on port ${PORT} ⚡️`);
});
