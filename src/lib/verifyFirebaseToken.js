// src/lib/verifyFirebaseToken.js
import admin from '../../pages/api/firebaseAdminConfig';

export const verifyFirebaseToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verificando token:', error);
    return null;
  }
};
