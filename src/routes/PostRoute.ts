import { Request, Response } from "express";
import { Client } from "pg";
import { UpdateReactionRequest } from "../modesl/post";

async function PostRouteGet(pool: Client, req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM posts ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM posts");
    const total = parseInt(countResult.rows[0].count);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function PostRouteUpdateRoute(pool: Client, req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const { action }: UpdateReactionRequest = req.body;
    const column = action === "like" ? "likes" : "dislikes";

    const result = await pool.query(
      `UPDATE posts SET ${column} = ${column} + 1 WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating reaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { PostRouteGet, PostRouteUpdateRoute };
