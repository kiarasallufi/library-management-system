import express from "express";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();


const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "secret");
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* Helpers */
const normalize = (s = "") =>
  s.toLowerCase().trim().replace(/\s+/g, " ");

const hasAny = (text, arr) => arr.some((k) => text.includes(k));

/*
  Supported questions (examples):
  - who owns the most books
  - top user by books
  - most popular book
  - most popular genre
  - show books by status reading/completed/planned
  - show books by genre fantasy/romance/technology
  - count books
*/
router.post("/query", auth, async (req, res) => {
 
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "AI Query is admin-only" });
  }

  const q = normalize(req.body?.question || "");
  if (!q) return res.status(400).json({ message: "Question is required" });

  try {
   
    if (
      hasAny(q, ["who owns the most books", "most books", "top user", "owner most"])
    ) {
      const [rows] = await pool.query(`
        SELECT users.id, users.name, users.email, COUNT(books.id) AS book_count
        FROM users
        LEFT JOIN books ON books.user_id = users.id
        GROUP BY users.id
        ORDER BY book_count DESC
        LIMIT 1
      `);

      const winner = rows[0];
      return res.json({
        type: "summary",
        title: "User with the most books",
        data: winner,
        text: winner
          ? `${winner.name} (${winner.email}) owns ${winner.book_count} book(s).`
          : "No data.",
      });
    }

    /* 2) Most popular book (most repeated title) */
    if (hasAny(q, ["most popular book", "popular book", "most common book"])) {
      const [rows] = await pool.query(`
        SELECT title, COUNT(*) AS count
        FROM books
        GROUP BY title
        ORDER BY count DESC
        LIMIT 1
      `);

      const top = rows[0];
      return res.json({
        type: "summary",
        title: "Most popular book",
        data: top,
        text: top ? `"${top.title}" appears ${top.count} time(s).` : "No books found.",
      });
    }

    /* 3) Most popular genre */
    if (hasAny(q, ["most popular genre", "popular genre", "most read genre"])) {
      const [rows] = await pool.query(`
        SELECT genre, COUNT(*) AS count
        FROM books
        GROUP BY genre
        ORDER BY count DESC
        LIMIT 1
      `);

      const top = rows[0];
      return res.json({
        type: "summary",
        title: "Most popular genre",
        data: top,
        text: top ? `${top.genre} is the top genre with ${top.count} book(s).` : "No books found.",
      });
    }

    /* 4) Show books by status */
    if (hasAny(q, ["status", "reading", "completed", "planned"])) {
      let status = null;
      if (q.includes("reading")) status = "reading";
      if (q.includes("completed")) status = "completed";
      if (q.includes("planned")) status = "planned";

      if (status) {
        const [rows] = await pool.query(
          `
          SELECT books.id, books.title, books.author, books.genre, books.status, users.name AS user_name
          FROM books
          JOIN users ON users.id = books.user_id
          WHERE books.status = ?
          ORDER BY users.name
        `,
          [status]
        );

        return res.json({
          type: "table",
          title: `Books with status: ${status}`,
          columns: ["title", "author", "genre", "status", "user_name"],
          rows,
        });
      }
    }

    /* 5) Show books by genre (match keyword) */
    if (hasAny(q, ["genre", "fantasy", "romance", "technology"])) {
      let genre = null;
      if (q.includes("fantasy")) genre = "Fantasy";
      if (q.includes("romance")) genre = "Romance";
      if (q.includes("technology")) genre = "Technology";

      if (genre) {
        const [rows] = await pool.query(
          `
          SELECT books.id, books.title, books.author, books.genre, books.status, users.name AS user_name
          FROM books
          JOIN users ON users.id = books.user_id
          WHERE books.genre = ?
          ORDER BY users.name
        `,
          [genre]
        );

        return res.json({
          type: "table",
          title: `Books in genre: ${genre}`,
          columns: ["title", "author", "genre", "status", "user_name"],
          rows,
        });
      }
    }

    /* 6) Count books total */
    if (hasAny(q, ["how many books", "count books", "total books"])) {
      const [rows] = await pool.query(`SELECT COUNT(*) AS total FROM books`);
      const total = rows[0]?.total ?? 0;
      return res.json({
        type: "summary",
        title: "Total books",
        data: { total },
        text: `Total books in the library: ${total}`,
      });
    }

    /* Default */
    return res.json({
      type: "summary",
      title: "Unsupported question",
      text:
        "Try: 'Who owns the most books?', 'Most popular book', 'Most popular genre', 'Show books with status reading', 'Show books in genre fantasy'.",
    });
  } catch (err) {
    console.error("AI QUERY ERROR:", err);
    return res.status(500).json({ message: "AI query failed" });
  }
});

export default router;
