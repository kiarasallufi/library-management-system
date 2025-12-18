import express from "express";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/* ================= AUTH ================= */
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "secret");
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= GET BOOKS ================= */
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const [rows] = await pool.query(`
        SELECT books.*, users.name AS user_name, users.email AS user_email
        FROM books
        JOIN users ON books.user_id = users.id
        ORDER BY users.name
      `);
      return res.json(rows);
    }

    const [rows] = await pool.query(
      "SELECT * FROM books WHERE user_id = ?",
      [req.user.id]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ================= ADD BOOK ================= */
router.post("/", auth, async (req, res) => {
  const { title, author, genre, status } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO books (title, author, genre, status, user_id) VALUES (?, ?, ?, ?, ?)",
      [title, author, genre, status, req.user.id]
    );

    const [rows] = await pool.query(
      "SELECT * FROM books WHERE id = ?",
      [result.insertId]
    );

    res.json(rows[0]);
  } catch {
    res.status(500).json({ message: "Add failed" });
  }
});

/* ================= EDIT BOOK ================= */
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, status } = req.body;

  try {
    if (req.user.role === "admin") {
      await pool.query(
        "UPDATE books SET title=?, author=?, genre=?, status=? WHERE id=?",
        [title, author, genre, status, id]
      );
    } else {
      await pool.query(
        "UPDATE books SET title=?, author=?, genre=?, status=? WHERE id=? AND user_id=?",
        [title, author, genre, status, id, req.user.id]
      );
    }

    const [rows] = await pool.query(
      "SELECT * FROM books WHERE id = ?",
      [id]
    );

    res.json(rows[0]);
  } catch {
    res.status(500).json({ message: "Edit failed" });
  }
});

/* ================= DELETE BOOK ================= */
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role === "admin") {
      await pool.query("DELETE FROM books WHERE id = ?", [id]);
    } else {
      await pool.query(
        "DELETE FROM books WHERE id = ? AND user_id = ?",
        [id, req.user.id]
      );
    }
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
