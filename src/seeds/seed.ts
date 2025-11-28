import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

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

async function createTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        live BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Posts table created or already exists");
  } finally {
    client.release();
    console.log("clearning up;");
  }
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        live BOOLEAN DEFAULT false
      );
    `);

    const result = await client.query("SELECT COUNT(*) FROM posts");
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      const posts = [];
      for (let i = 1; i <= 1000; i++) {
        posts.push([
          `Title ${i}`,
          `Content for post ${i}`,
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 50),
          Math.random() > 0.5,
        ]);
      }

      for (const post of posts) {
        await client.query(
          "INSERT INTO posts (title, content, likes, dislikes, live) VALUES ($1, $2, $3, $4, $5)",
          post
        );
      }

      console.log("1000 posts seeded successfully");
    } else {
      console.log(`Database already has ${count} posts, skipping seed.`);
    }
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    client.release();
    console.log("clearning up;");
  }
}

async function main() {
  try {
    await createTable();
    await seed();
  } catch (error) {
    console.error("Failed to seed database:", error);
  } finally {
    await pool.end();
  }
}

main();
