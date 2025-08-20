const PersonForm = ({
  newName,
  newPhone,
  onNameChange,
  onPhoneChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="card">
    <input
      type="text"
      value={newName}
      onChange={onNameChange}
      placeholder="Add a new name"
      required
    />
    <input
      type="text"
      value={newPhone}
      onChange={onPhoneChange}
      placeholder="Add a new phone number"
      required
    />
    <div>
      <button type="submit">Add to Phonebook</button>
    </div>
  </form>
);

export default PersonForm;
