import "../css/AdminDashboard.css";
import AdminInsights from "./AdminInsights";  

function AdminDashboard({ books, onDelete }) {
  
  const booksByUser = books.reduce((acc, book) => {
    if (!acc[book.user_id]) {
      acc[book.user_id] = {
        user_name: book.user_name,
        user_email: book.user_email,
        books: [],
      };
    }
    acc[book.user_id].books.push(book);
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <h3>Admin Dashboard</h3>

      {Object.values(booksByUser).map((user, idx) => (
        <div key={idx} className="admin-user-block">
          <h4>
            👤 {user.user_name}{" "}
            <span className="email">({user.user_email})</span>
          </h4>

          {user.books.map((book) => (
            <div key={book.id} className="admin-book-card">
              <div>
                <b>{book.title}</b> – {book.author}
              </div>
              <div>
                Genre: {book.genre} | Status: <b>{book.status}</b>
              </div>

              <button onClick={() => onDelete(book.id)}>Delete</button>
            </div>
          ))}
        </div>
      ))}

    
      <AdminInsights books={books} />
    </div>
  );
}

export default AdminDashboard;
