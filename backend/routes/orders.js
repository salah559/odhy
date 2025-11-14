import express from "express";
import { db } from "../db/drizzle.js";

const router = express.Router();

// إنشاء طلب جديد
router.post("/", async (req, res) => {
  const { user_name, phone, state, city, products, total, notes } = req.body;

  try {
    const result = await db.insert("orders").values({
      user_name,
      phone,
      state,
      city,
      products: JSON.stringify(products),
      total,
      notes
    }).returning("*");

    res.json({ message: "تم إنشاء الطلب بنجاح", order: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// جلب كل الطلبات
router.get("/", async (_req, res) => {
  try {
    const orders = await db.select().from("orders");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// تحديث حالة الطلب
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await db.update("orders")
      .set({ status })
      .where("id", "=", id)
      .returning("*");

    res.json({ message: "تم تحديث حالة الطلب", order: updated[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
