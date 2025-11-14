import admin from 'firebase-admin';

const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'investor-match-ai',
    });
  }
  return admin.firestore();
};

export const db = initializeFirebase();
export { admin };
