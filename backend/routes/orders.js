import express from "express";

const router = express.Router();

const mockOrders = [];

router.post("/", async (req, res) => {
  const { user_name, phone, state, city, products, total, notes } = req.body;

  try {
    const order = {
      id: mockOrders.length + 1,
      user_name,
      phone,
      state,
      city,
      products,
      total,
      notes,
      status: "pending",
      created_at: new Date().toISOString()
    };
    
    mockOrders.push(order);
    res.json({ message: "تم إنشاء الطلب بنجاح", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    res.json(mockOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = mockOrders.find(o => o.id === parseInt(id));
    if (!order) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }
    
    order.status = status;
    res.json({ message: "تم تحديث حالة الطلب", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
