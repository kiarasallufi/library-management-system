import { useState, useEffect } from "react";
import axios from "axios";

import Login from "./components/Login";
import Register from "./components/Register";
import NavBar from "./components/NavBar";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import AdminDashboard from "./components/AdminDashboard";
import AIQuery from "./components/AIQuery";
import AdminInsights from "./components/AdminInsights"; 
import AIRecommendations from "./components/AIRecommendations";

const API = "http://localhost:5000";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const booksRes = await axios.get(`${API}/books`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(booksRes.data);

        if (user.role === "admin") {
          const usersRes = await axios.get(`${API}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(usersRes.data);
        }
      } catch (err) {
        console.log("Fetch Error:", err);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setBooks([]);
    setUsers([]);
    setShowRegister(false);
  };

  const addBook = async (book) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API}/books`, book, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setBooks(prev => [...prev, res.data]);
  };

  const editBook = async (updatedBook) => {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `${API}/books/${updatedBook.id}`,
      updatedBook,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setBooks(prev =>
      prev.map(b => (b.id === res.data.id ? res.data : b))
    );
  };

  const deleteBook = async (id) => {
    const token = localStorage.getItem("token");

    await axios.delete(`${API}/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setBooks(prev => prev.filter(b => b.id !== id));
  };

  if (!user) {
    return showRegister ? (
      <Register
        onRegister={(data) => {
          localStorage.setItem("token", data.token);
          setUser(data.user);
        }}
        setShowRegister={setShowRegister}
      />
    ) : (
      <Login
        onLogin={(data) => {
          localStorage.setItem("token", data.token);
          setUser(data.user);
        }}
        setShowRegister={setShowRegister}
      />
    );
  }

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} />

      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        
        <div style={{ flex: 2 }}>
          <BookForm onAdd={addBook} />
          <BookList
            books={books}
            user={user}
            onDelete={deleteBook}
            onEdit={editBook}
          />
        </div>

        {user.role === "admin" && (
          <div style={{ flex: 1 }}>
            <AdminDashboard books={books} onDelete={deleteBook} />
            <AIQuery books={books} users={users} />
            <AIRecommendations books={books} user={user} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
