import { useState } from "react";
import axios from "axios";
import "../css/Login.css";

function Login({ onLogin, setShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (email, password) => {
    const res = await axios.post("http://localhost:5000/auth/login", {
      email,
      password,
    });

    onLogin({
      user: res.data.user,
      token: res.data.token,
    });
  };

  const handleAdminLogin = () => {
    login("admin@lib.com", "admin").catch(() =>
      alert("Admin login failed")
    );
  };

  const handleUserLogin = () => {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    login(email, password).catch((err) =>
      alert(err.response?.data?.message || "Login failed")
    );
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <button onClick={handleAdminLogin}>Login as Admin</button>

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

      <button onClick={handleUserLogin}>Login as User</button>

      <button onClick={() => setShowRegister(true)}>Register</button>
    </div>
  );
}

export default Login;
