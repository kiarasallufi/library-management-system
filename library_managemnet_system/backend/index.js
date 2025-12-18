import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import booksRoutes from "./routes/books.js";
import aiRoutes from "./routes/ai.js";
import usersRoutes from "./routes/users.js"; 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", authRoutes);
app.use("/books", booksRoutes);
app.use("/ai", aiRoutes);
app.use("/users", usersRoutes); 

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
