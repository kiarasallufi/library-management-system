import { useState } from "react";
import axios from "axios";
import "../css/AIQuery.css";

const API = "http://localhost:5000";

function AIQuery() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    const token = localStorage.getItem("token");
    if (!question.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(
        `${API}/ai/query`,
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "AI query failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-box">
      <h3>AI Query</h3>

      <div className="ai-row">
        <input
          className="ai-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask: Who owns the most books?"
        />
        <button className="ai-btn" onClick={ask} disabled={loading}>
          {loading ? "Asking..." : "Ask"}
        </button>
      </div>

      {result && (
        <div className="ai-result">
          <h4>{result.title}</h4>

          {result.type === "summary" && (
            <p className="ai-summary">{result.text}</p>
          )}

          {result.type === "table" && (
            <div className="ai-table-wrap">
              <table className="ai-table">
                <thead>
                  <tr>
                    {result.columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.length === 0 ? (
                    <tr>
                      <td colSpan={result.columns.length} style={{ textAlign: "center" }}>
                        No rows
                      </td>
                    </tr>
                  ) : (
                    result.rows.map((row) => (
                      <tr key={row.id}>
                        {result.columns.map((c) => (
                          <td key={c}>{row[c]}</td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIQuery;
