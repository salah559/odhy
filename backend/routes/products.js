import express from "express";
import { db } from "../db/drizzle.js";

const router = express.Router();

// احصل على كل الأغنام
router.get("/", async (req, res) => {
  try {
    const sheeps = await db.select().from("sheep");
    res.json(sheeps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
