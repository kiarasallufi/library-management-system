import { pool } from "./db.js";

try {
  const [rows] = await pool.query("SELECT * FROM users");
  console.log("DB CONNECTED ✅");
  console.log(rows);
  process.exit();
} catch (err) {
  console.error("DB FAILED ❌");
  console.error(err);
}
