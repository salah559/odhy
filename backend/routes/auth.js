import express from "express";
import admin from "firebase-admin";

const router = express.Router();

// إعداد Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// تسجيل الدخول والتحقق من التوكن
router.post("/login", async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ error: "Token مطلوب" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    res.json({ uid, email, message: "تم تسجيل الدخول بنجاح" });
  } catch (err) {
    res.status(401).json({ error: "توكن غير صالح" });
  }
});

export default router;
