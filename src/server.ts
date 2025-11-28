import cors from "cors";
import express from "express";
import { Client } from "pg";
import * as dotenv from 'dotenv';
import { PostRouteGet, PostRouteUpdateRoute } from "./routes/PostRoute";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;



// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const client = new Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "postdb",
  password: process.env.DB_PASSWORD || "password",
  port: parseInt(process.env.DB_PORT || "5432"),
});

// Interface for Post
try {
  client.connect();
  console.log("INFO: potgress connected successfully");
} catch (err) {
  console.error("unable to connect to pg");
  process.exit();
}
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/post", (req, res) => PostRouteGet(client, req, res));
app.post("/post/:id/likes", (req, res) => PostRouteUpdateRoute(client, req, res));



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

