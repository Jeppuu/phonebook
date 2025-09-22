import { useEffect, useState } from "react";
import "./App.css";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import PeopleList from "./components/PeopleList";
import peopleService from "./services/people";
import Snackbar from "./components/Snackbar";

const App = () => {
  const [people, setPeople] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [filter, setFilter] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState(null);

  // Fetch initial data from the server
  useEffect(() => {
    console.log("Effect");
    peopleService.getAll().then((data) => {
      setPeople(data);
    });
  }, []);

  const handleAddPerson = (event) => {
    event.preventDefault();
    if (people.some((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook. Replace old number with a new one?`
        )
      ) {
        const person = people.find((p) => p.name === newName);

        peopleService
          .updatePhone(person, newPhone)
          .then((updatedPerson) => {
            setPeople(
              people.map((p) => (p.id === person.id ? updatedPerson : p))
            );
            changeSnackbarMessage(
              `Updated ${newName}'s phone number.`,
              "success"
            );
          })
          .catch((error) => {
            console.error("Error updating phone:", error);
            changeSnackbarMessage(
              `Information of ${newName} has already been removed from server`,
              "error"
            );
            setPeople(people.filter((p) => p.id !== person.id));
          });
      }
      return;
    }

    const personObject = {
      name: newName,
      phone: newPhone,
    };

    peopleService
      .addPerson(personObject)
      .then((returnedPerson) => {
        console.log("Added:", returnedPerson);
        setPeople(people.concat(returnedPerson));
        setNewName("");
        setNewPhone("");
        changeSnackbarMessage(`Added ${newName} to phonebook.`, "success");
      })
      .catch((error) => {
        console.error("Error adding person:", error);
        changeSnackbarMessage(error.response.data.error, "error");
      });
  };

  const handleDeletePerson = (person) => {
    console.log("Deleting:", person);
    if (!window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      return;
    }
    peopleService.deletePerson(person.id).then(() => {
      setPeople(people.filter((p) => p.id !== person.id));
    });
    changeSnackbarMessage(`Deleted ${person.name} from phonebook.`, "success");
  };

  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const changeSnackbarMessage = (message, type) => {
    setSnackbarMessage({ text: message, type: type });
    setTimeout(() => {
      setSnackbarMessage(null);
    }, 4000);
  };

  console.log("Snackbar message: ", snackbarMessage);
  return (
    <>
      <h1>Phonebook</h1>
      <Snackbar
        message={snackbarMessage}
        onClose={() => setSnackbarMessage(null)}
      />
      <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />
      <PersonForm
        newName={newName}
        newPhone={newPhone}
        onNameChange={(e) => setNewName(e.target.value)}
        onPhoneChange={(e) => setNewPhone(e.target.value)}
        onSubmit={handleAddPerson}
      />
      <h2>Numbers:</h2>
      <PeopleList
        people={filteredPeople}
        filter={filter}
        onDelete={handleDeletePerson}
      />
    </>
  );
};

export default App;
