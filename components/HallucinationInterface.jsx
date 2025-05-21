export default function TestForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted via Enter!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type something..."
        style={{ padding: "1rem", fontSize: "1rem" }}
      />
    </form>
  );
}
