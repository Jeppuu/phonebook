const PeopleList = ({ people, filter, onDelete }) => (
  <div className="card">
    {filter && people.length === 0 && <p>No results found for "{filter}"</p>}
    {people.map((person) => (
      <div key={person.id} className="person">
        <p>
          {person.name}: {person.phone}
        </p>
        <button onClick={() => onDelete(person)}>Delete</button>
      </div>
    ))}
  </div>
);

export default PeopleList;
