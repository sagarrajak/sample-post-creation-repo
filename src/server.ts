import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { PostRouteGet } from './routes/PostRoute';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());


// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postdb',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Interface for Post
interface Post {
  id: number;
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  live: boolean;
}

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/post',(req, res) => PostRouteGet(pool, req, res))
app.post('/post',(req, res) => PostRouteGet(pool, req, res))
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
