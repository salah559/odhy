import admin from "firebase-admin";

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'رمز التوثيق مطلوب'
      });
    }

    const token = authHeader.split('Bearer ')[1];

    if (!admin.apps.length) {
      console.error('Firebase Admin SDK not initialized');
      return res.status(503).json({ 
        error: 'خدمة المصادقة غير متاحة'
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token, true);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', {
      message: error.message,
      code: error.code
    });
    return res.status(401).json({ 
      error: 'رمز توثيق غير صالح'
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split('Bearer ')[1];

    if (!admin.apps.length) {
      req.user = null;
      return next();
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
    
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

export default verifyToken;
