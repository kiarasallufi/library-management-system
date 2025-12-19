import { useEffect, useState } from "react";
import axios from "axios";

function ApiTest() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // GET
    axios.get("http://localhost:5000/api/test")
      .then(res => setMessage(res.data.message))
      .catch(err => setMessage("Error: " + err.message));
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h3>API Test Result:</h3>
      <p>{message}</p>
    </div>
  );
}

export default ApiTest;
