
import { cert, initializeApp, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { firebaseConfig } from './config';

let app: App;

/**
 * Initializes the Firebase Admin app if it hasn't been initialized yet.
 * This is a lazy initializer to prevent issues during Next.js build.
 */
function initializeAdmin() {
  if (!getApps().length) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      // This will throw an error at RUNTIME if the env var is missing,
      // but it will not break the build process.
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    }

    try {
      app = initializeApp({
        credential: cert(JSON.parse(serviceAccountKey)),
        databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
      });
    } catch (e: any) {
      throw new Error(`Failed to initialize Firebase Admin SDK: ${e.message}`);
    }
  } else {
    app = getApps()[0];
  }
}

/**
 * Lazily gets the Firestore Admin instance.
 * @returns {Firestore} The Firestore admin instance.
 */
export function getAdminDb(): Firestore {
  initializeAdmin();
  return getFirestore(app);
}

/**
 * Lazily gets the Auth Admin instance.
 * @returns {Auth} The Auth admin instance.
 */
export function getAdminAuth(): Auth {
  initializeAdmin();
  return getAuth(app);
}

export const adminDb = getAdminDb();
export const adminAuth = getAdminAuth();
