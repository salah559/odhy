import express from "express";
import admin from "firebase-admin";
import { pool } from "../db/drizzle.js";

const router = express.Router();

let firebaseInitialized = false;
let firebaseProjectId = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
      firebaseProjectId = serviceAccount.project_id;
      firebaseInitialized = true;
      console.log(`Firebase initialized for project: ${firebaseProjectId}`);
    }
  } catch (err) {
    console.error("Firebase initialization failed:", err.message);
  }
}

export { firebaseProjectId };

router.post("/verify", async (req, res) => {
  if (!firebaseInitialized) {
    return res.status(503).json({ 
      error: "Firebase authentication is not configured." 
    });
  }

  const { token } = req.body;

  if (!token) return res.status(400).json({ error: "Token مطلوب" });

  try {
    const { validateFirebaseToken } = await import("../middleware/validateToken.js");
    const { uid, email } = await validateFirebaseToken(token);

    const result = await pool.query(
      'SELECT * FROM admins WHERE firebase_uid = $1',
      [uid]
    );

    const isAdmin = result.rows.length > 0;

    res.json({ 
      uid, 
      email, 
      isAdmin,
      message: "تم التحقق من التوكن بنجاح" 
    });
  } catch (err) {
    console.error("Token verification error:", { message: err.message, code: err.code });
    res.status(401).json({ error: "توكن غير صالح" });
  }
});

router.post("/create-admin", async (req, res) => {
  if (!firebaseInitialized) {
    return res.status(503).json({ 
      error: "Firebase authentication is not configured." 
    });
  }

  const { token, email, name, adminSecret } = req.body;

  if (!token) return res.status(400).json({ error: "Token مطلوب" });

  try {
    const ADMIN_CREATION_SECRET = process.env.ADMIN_CREATION_SECRET;
    
    if (!ADMIN_CREATION_SECRET || adminSecret !== ADMIN_CREATION_SECRET) {
      console.warn(`Bootstrap attempt failed - invalid/missing secret`);
      return res.status(403).json({ 
        error: "غير مصرح",
        message: "لإنشاء أول مسؤول، يجب تقديم ADMIN_CREATION_SECRET الصحيح"
      });
    }

    const { validateFirebaseToken } = await import("../middleware/validateToken.js");
    const { uid, email: tokenEmail } = await validateFirebaseToken(token);

    const existingAdmin = await pool.query(
      'SELECT * FROM admins WHERE firebase_uid = $1',
      [uid]
    );

    if (existingAdmin.rows.length > 0) {
      return res.json({ 
        message: "المستخدم مسجل كمسؤول بالفعل",
        admin: existingAdmin.rows[0]
      });
    }

    const { atomicBootstrapAndCreateAdmin } = await import("../db/bootstrap.js");
    const result = await atomicBootstrapAndCreateAdmin(
      uid,
      email || tokenEmail,
      name || 'Admin'
    );

    if (!result.success) {
      if (result.reason === 'bootstrap_completed') {
        console.warn('Bootstrap already completed - cannot create first admin');
        return res.status(403).json({ 
          error: "غير مصرح",
          message: "تم إنشاء أول مسؤول بالفعل. لإضافة مسؤولين جدد، استخدم /api/admin/add-admin"
        });
      }
      
      if (result.reason === 'duplicate_admin') {
        console.warn('Admin already exists with this Firebase UID');
        return res.status(409).json({ 
          error: "المستخدم موجود",
          message: "هذا المستخدم مسجل كمسؤول بالفعل"
        });
      }
      
      if (result.reason === 'db_error') {
        console.error('Database error during bootstrap - can be retried', result.error);
        return res.status(500).json({ 
          error: "خطأ في قاعدة البيانات",
          message: "حدث خطأ مؤقت. يمكنك المحاولة مرة أخرى.",
          retryable: true
        });
      }
      
      throw new Error('Bootstrap failed for unknown reason');
    }
    
    res.json({ 
      message: "تم إنشاء أول حساب مسؤول بنجاح. لن يكون بالإمكان استخدام هذا المسار مرة أخرى.",
      admin: result.admin,
      notice: "لإضافة مسؤولين جدد، استخدم /api/admin/add-admin مع توكن المسؤول"
    });
  } catch (err) {
    console.error("Admin creation error:", { message: err.message, code: err.code, stack: err.stack });
    res.status(500).json({ error: "حدث خطأ في إنشاء حساب المسؤول" });
  }
});

export default router;
