const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// Custom token to log request body
morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let people = [
  { id: "1", name: "Jane Doe", phone: "123-456-7890" },
  { id: "2", name: "John Smith", phone: "987-654-3210" },
];

const generateId = () => {
  return String(Math.floor(Math.random() * 10000) + 1);
};

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  res.send(`<h1>Phonebook Information</h1>
            <p>There are ${people.length} people in the phonebook.</p>
            <p>${new Date()}</p>`);
});

app.get("/api/people", (req, res) => {
  res.json(people);
});

app.get("/api/people/:id", (req, res) => {
  const id = req.params.id;
  const person = people.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).send("Person not found");
  }
});

app.delete("/api/people/:id", (req, res) => {
  const id = req.params.id;
  if (!people.some((p) => p.id === id)) {
    return res.status(404).send(`Person not found with id ${id}`);
  }
  people = people.filter((p) => p.id !== id);
  console.log("Deleted person with id ", id);
  console.log("Remaining people: ", people);
  res.status(204).send();
});

app.post("/api/people", (req, res) => {
  const body = req.body;

  if (!body.name || !body.phone) {
    return res.status(400).json({
      error: "name or phone missing",
    });
  }
  if (people.some((p) => p.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }
  const newPerson = {
    id: generateId(),
    name: body.name,
    phone: body.phone,
  };
  people = [...people, newPerson];

  res.status(201).json(newPerson);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "😵‍💫 unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🤖 Server is running on port ${PORT} ⚡️`);
});
