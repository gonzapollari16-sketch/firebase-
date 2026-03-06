
"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

/**
 * @fileOverview Inicializador síncrono de Firebase Client.
 * Garantiza que las instancias estén disponibles sin promesas.
 */

let _app: FirebaseApp;
let _auth: Auth;
let _db: Firestore;

if (typeof window !== "undefined") {
  _app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  _auth = getAuth(_app);
  _db = getFirestore(_app);
}

export function getClientApp(): FirebaseApp {
  return _app;
}

export function getClientAuth(): Auth {
  return _auth;
}

export function getClientDb(): Firestore {
  return _db;
}
