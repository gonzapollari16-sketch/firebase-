"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { User, Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';
import { getClientApp } from './client';

/**
 * @fileOverview Firebase Context Provider.
 * Permite la inyección de instancias síncronas.
 */

interface FirebaseContextState {
  user: User | null;
  auth: Auth | null;
  firestore: Firestore | null;
  isUserLoading: boolean;
}

const FirebaseContext = createContext<FirebaseContextState>({
  user: null,
  auth: null,
  firestore: null,
  isUserLoading: true,
});

interface FirebaseProviderProps {
  children: React.ReactNode;
  firebaseApp?: FirebaseApp;
  auth?: Auth | null;
  firestore?: Firestore | null;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ 
  children, 
  auth: initialAuth, 
  firestore: initialFirestore 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authInstance, setAuthInstance] = useState<Auth | null>(initialAuth || null);
  const [firestoreInstance, setFirestoreInstance] = useState<Firestore | null>(initialFirestore || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initFirebase = async () => {
      if (typeof window === 'undefined') return;

      try {
        const app = getClientApp();
        const { getAuth, onAuthStateChanged } = await import('firebase/auth');
        const { getFirestore } = await import('firebase/firestore');

        const auth = authInstance || getAuth(app);
        const db = firestoreInstance || getFirestore(app);

        if (!authInstance) setAuthInstance(auth);
        if (!firestoreInstance) setFirestoreInstance(db);

        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setIsLoading(false);
        });
      } catch (err) {
        console.error("[FIREBASE:PROVIDER] Failed to initialize services:", err);
        setIsLoading(false);
      }
    };

    initFirebase();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [authInstance, firestoreInstance]);

  const value = useMemo(() => ({
    user,
    auth: authInstance,
    firestore: firestoreInstance,
    isUserLoading: isLoading
  }), [user, authInstance, firestoreInstance, isLoading]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error("useAuth must be used within FirebaseProvider");
  return context.auth;
};

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error("useFirestore must be used within FirebaseProvider");
  return context.firestore;
};

export const useUser = () => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error("useUser must be used within FirebaseProvider");
  return { user: context.user, isUserLoading: context.isUserLoading };
};

export { useMemoFirebase } from './hooks/use-memo-firebase';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
