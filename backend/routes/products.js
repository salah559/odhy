import express from "express";
import { pool } from "../db/drizzle.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sheep ORDER BY is_featured DESC, created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('خطأ في جلب المنتجات:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM sheep WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'المنتج غير موجود' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('خطأ في جلب المنتج:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const result = await pool.query('SELECT * FROM sheep WHERE category = $1 ORDER BY created_at DESC', [category]);
    res.json(result.rows);
  } catch (err) {
    console.error('خطأ في جلب المنتجات حسب الفئة:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
