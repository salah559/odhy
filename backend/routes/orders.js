import express from "express";
import { pool } from "../db/drizzle.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { user_name, phone, state, city, products, total, notes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO orders (user_name, phone, state, city, products, total, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [user_name, phone, state, city, JSON.stringify(products), total, notes || '']
    );

    res.json({ message: "تم إنشاء الطلب بنجاح", order: result.rows[0] });
  } catch (err) {
    console.error('خطأ في إنشاء الطلب:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('خطأ في جلب الطلبات:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('خطأ في جلب الطلب:', err);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/status", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }

    res.json({ message: "تم تحديث حالة الطلب", order: result.rows[0] });
  } catch (err) {
    console.error('خطأ في تحديث حالة الطلب:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
