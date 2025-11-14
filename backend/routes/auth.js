import express from "express";
import admin from "firebase-admin";

const router = express.Router();

let firebaseInitialized = false;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      firebaseInitialized = true;
    }
  } catch (err) {
    console.error("Firebase initialization failed:", err.message);
  }
}

router.post("/login", async (req, res) => {
  if (!firebaseInitialized) {
    return res.status(503).json({ 
      error: "Firebase authentication is not configured. Please set FIREBASE_SERVICE_ACCOUNT environment variable." 
    });
  }

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
