import { useState } from "react";
import "../css/BookForm.css";

function BookForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("reading");

  const handleSubmit = (e) => {
    e.preventDefault();

    onAdd({ title, author, genre, status });

    setTitle("");
    setAuthor("");
    setGenre("");
    setStatus("reading");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Book</h3>

      <input placeholder="Title" value={title}
        onChange={(e) => setTitle(e.target.value)} />

      <input placeholder="Author" value={author}
        onChange={(e) => setAuthor(e.target.value)} />

      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        <option value="">Select genre</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Romance">Romance</option>
        <option value="Technology">Technology</option>
      </select>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="reading">Reading</option>
        <option value="completed">Completed</option>
        <option value="planned">Planned</option>
      </select>

      <button type="submit">Add</button>
    </form>
  );
}

export default BookForm;
