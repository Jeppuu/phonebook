const Snackbar = ({ message, onClose }) => {
  if (!message) {
    return null;
  }
  return (
    <div className={`snackbar ${message.type}`}>
      <p className="snackbar-content">{message.text}</p>
      <button onClick={onClose} className="close-button">
        X
      </button>
    </div>
  );
};

export default Snackbar;
