const Filter = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Search by name..."
    value={value}
    onChange={onChange}
  />
);

export default Filter;
