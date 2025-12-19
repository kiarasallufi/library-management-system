import { useState } from "react";
import axios from "axios";
import "../css/Register.css";

function Register({ onRegister, setShowRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        name,
        email,
        password,
      });

      // 🔴 KTHEJMË USER + TOKEN
      onRegister({
        user: res.data.user,
        token: res.data.token,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>
      <button onClick={() => setShowRegister(false)}>Back to Login</button>
    </div>
  );
}

export default Register;
