import admin from "firebase-admin";
import { pool } from "../db/drizzle.js";

const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'رمز التوثيق مطلوب'
      });
    }

    const token = authHeader.split('Bearer ')[1];

    if (!admin.apps.length) {
      console.error('Firebase Admin SDK not initialized - FIREBASE_SERVICE_ACCOUNT not configured');
      return res.status(503).json({ 
        error: 'خدمة المصادقة غير متاحة'
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token, true);
    
    const app = admin.app();
    const expectedProjectId = app.options.projectId;
    const expectedIssuer = `https://securetoken.google.com/${expectedProjectId}`;
    
    if (expectedProjectId && decodedToken.aud !== expectedProjectId) {
      console.error(`Token audience mismatch. Expected: ${expectedProjectId}, Got: ${decodedToken.aud}`);
      return res.status(401).json({ 
        error: 'رمز توثيق غير صالح'
      });
    }

    if (expectedProjectId && decodedToken.iss !== expectedIssuer) {
      console.error(`Token issuer mismatch. Expected: ${expectedIssuer}, Got: ${decodedToken.iss}`);
      return res.status(401).json({ 
        error: 'رمز توثيق غير صالح'
      });
    }

    const uid = decodedToken.uid;
    const email = decodedToken.email;

    const result = await pool.query(
      'SELECT * FROM admins WHERE firebase_uid = $1',
      [uid]
    );

    if (result.rows.length === 0) {
      console.warn(`Access denied for user ${uid} (${email}) - not registered as admin`);
      return res.status(403).json({ 
        error: 'غير مصرح'
      });
    }

    req.user = {
      uid,
      email,
      adminId: result.rows[0].id,
      adminName: result.rows[0].name
    };
    
    next();
  } catch (error) {
    console.error('Admin verification error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return res.status(401).json({ 
      error: 'رمز توثيق غير صالح'
    });
  }
};

export default requireAdmin;
