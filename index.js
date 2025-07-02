
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";



dotenv.config();                              // Load .env first
const { MONGO_URI, PORT = 5000 } = process.env;

if (!MONGO_URI) {
  console.error("❌  MONGO_URI missing in .env");
  process.exit(1);
}

const app = express();

// ─── Global middleware ─────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────
app.get("/", (_req, res) => res.send("API running 🚀"));


// ─── DB + server bootstrap ────────────────────────────────────
try {
  await mongoose.connect(MONGO_URI);
  console.log("✅  MongoDB connected");

  app.listen(PORT, () =>
    console.log(`✅  Server listening at http://localhost:${PORT}`)
  );
} catch (err) {
  console.error("❌  Failed to start server:", err);
  process.exit(1);
}
