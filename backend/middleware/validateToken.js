import admin from "firebase-admin";

export const validateFirebaseToken = async (token) => {
  if (!admin.apps.length) {
    throw new Error('Firebase not initialized');
  }

  const decodedToken = await admin.auth().verifyIdToken(token, true);
  
  const app = admin.app();
  const expectedProjectId = app.options.projectId;
  const expectedIssuer = `https://securetoken.google.com/${expectedProjectId}`;
  
  if (expectedProjectId && decodedToken.aud !== expectedProjectId) {
    console.error(`Token audience mismatch. Expected: ${expectedProjectId}, Got: ${decodedToken.aud}`);
    throw new Error('Invalid token - audience mismatch');
  }

  if (expectedProjectId && decodedToken.iss !== expectedIssuer) {
    console.error(`Token issuer mismatch. Expected: ${expectedIssuer}, Got: ${decodedToken.iss}`);
    throw new Error('Invalid token - issuer mismatch');
  }

  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
    aud: decodedToken.aud,
    iss: decodedToken.iss
  };
};
