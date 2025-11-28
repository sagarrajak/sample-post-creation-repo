import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { Pool, PoolClient } from "pg";
import { PostRouteGet, PostRouteUpdateRoute } from "./routes/PostRoute";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "postdb",
  password: process.env.DB_PASSWORD || "password",
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: {
    rejectUnauthorized: false, 
  }
});

(async () => {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    console.log("INFO: potgress connected successfully");
  } catch (err) {
    console.error("unable to connect to pg");
    console.log(err)
    process.exit();
  } finally {
    if (client) await client.release();
  }
})();

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/posts", async (req, res) => {
  const client = await pool.connect();
  await PostRouteGet(client, req, res);
});

app.post("/posts/:id/likes", async (req, res) => {
  const client = await pool.connect();
  await PostRouteUpdateRoute(client, req, res);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
