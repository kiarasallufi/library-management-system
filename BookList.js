import { useState } from "react";
import "../css/BookList.css";

function BookList({ books, user, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");

  const startEdit = (book) => {
    setEditingId(book.id);
    setForm(book);
  };

  const saveEdit = () => {
    onEdit(form);
    setEditingId(null);
  };

  const genres = [...new Set(books.map(b => b.genre))];

  const filteredBooks = books.filter(book => {
    const statusMatch =
      statusFilter === "all" || book.status === statusFilter;

    const genreMatch =
      genreFilter === "all" || book.genre === genreFilter;

    return statusMatch && genreMatch;
  });

  return (
    <div>
      <h3>Books</h3>

      {/* FILTERS */}
      <div style={{ marginBottom: "10px" }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
          <option value="planned">Planned</option>
        </select>

        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="all">All Genres</option>
          {genres.map((g, i) => (
            <option key={i} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* BOOK LIST */}
      {filteredBooks.map((book) => (
        <div key={book.id} className="book-card">

          {editingId === book.id ? (
            <>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <input
                value={form.author}
                onChange={(e) =>
                  setForm({ ...form, author: e.target.value })
                }
              />

              <select
                value={form.genre}
                onChange={(e) =>
                  setForm({ ...form, genre: e.target.value })
                }
              >
                <option>Fantasy</option>
                <option>Romance</option>
                <option>Technology</option>
              </select>

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option value="reading">Reading</option>
                <option value="completed">Completed</option>
                <option value="planned">Planned</option>
              </select>

              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <b>{book.title}</b> – {book.author}
              <div>
                Genre: {book.genre} | Status: <b>{book.status}</b>
              </div>

              {(user.role === "admin" || book.user_id === user.id) && (
                <>
                  <button onClick={() => startEdit(book)}>Edit</button>
                  <button onClick={() => onDelete(book.id)}>Delete</button>
                </>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default BookList;
