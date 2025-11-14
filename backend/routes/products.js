import express from "express";

const router = express.Router();

const mockProducts = [
  {
    id: 1,
    name: "خروف بربري ممتاز",
    price: 1200,
    weight: "40-45 كجم",
    image: "sheep1.jpg",
    description: "خروف بربري عالي الجودة"
  },
  {
    id: 2,
    name: "خروف سردي",
    price: 1500,
    weight: "45-50 كجم",
    image: "sheep2.jpg",
    description: "خروف سردي ممتاز للأضحية"
  },
  {
    id: 3,
    name: "خروف نجدي",
    price: 1800,
    weight: "50-55 كجم",
    image: "sheep3.jpg",
    description: "خروف نجدي فاخر"
  }
];

router.get("/", async (req, res) => {
  try {
    res.json(mockProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
