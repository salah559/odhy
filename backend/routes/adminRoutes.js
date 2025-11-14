import express from "express";
import { pool } from "../db/drizzle.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.post("/add-admin", requireAdmin, async (req, res) => {
  const { firebase_uid, email, name } = req.body;

  if (!firebase_uid || !email) {
    return res.status(400).json({ error: "firebase_uid وemail مطلوبان" });
  }

  try {
    const existing = await pool.query(
      'SELECT * FROM admins WHERE firebase_uid = $1',
      [firebase_uid]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ 
        error: "المستخدم مسجل كمسؤول بالفعل",
        admin: existing.rows[0]
      });
    }

    const result = await pool.query(
      'INSERT INTO admins (firebase_uid, email, name) VALUES ($1, $2, $3) RETURNING *',
      [firebase_uid, email, name || 'Admin']
    );

    console.log(`Admin added by ${req.user.email}: ${result.rows[0].email}`);
    
    res.json({ 
      message: "تم إضافة المسؤول بنجاح",
      admin: result.rows[0]
    });
  } catch (err) {
    console.error("Add admin error:", { message: err.message });
    res.status(500).json({ error: "حدث خطأ في إضافة المسؤول" });
  }
});

router.get("/admins", requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query('SELECT id, firebase_uid, email, name, created_at FROM admins ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("Get admins error:", { message: err.message });
    res.status(500).json({ error: "حدث خطأ في جلب قائمة المسؤولين" });
  }
});

router.delete("/admins/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const count = await pool.query('SELECT COUNT(*) as count FROM admins');
    if (parseInt(count.rows[0].count) === 1) {
      return res.status(400).json({ error: "لا يمكن حذف آخر مسؤول" });
    }

    const result = await pool.query('DELETE FROM admins WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "المسؤول غير موجود" });
    }

    console.log(`Admin deleted by ${req.user.email}: ${result.rows[0].email}`);
    
    res.json({ message: "تم حذف المسؤول بنجاح" });
  } catch (err) {
    console.error("Delete admin error:", { message: err.message });
    res.status(500).json({ error: "حدث خطأ في حذف المسؤول" });
  }
});

export default router;
