'use client';
    
import { useState, useEffect } from 'react';
import type {
  DocumentReference,
  DocumentData,
  FirestoreError,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type WithId<T> = T & { id: string };

export interface UseDocResult<T> {
  data: WithId<T> | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

/**
 * React hook to subscribe to a single Firestore document in real-time.
 * Uses dynamic imports for implementation to ensure SSR safety.
 */
export function useDoc<T = any>(
  memoizedDocRef: DocumentReference<DocumentData> | null | undefined,
): UseDocResult<T> {
  const [data, setData] = useState<WithId<T> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedDocRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let unsubscribe: () => void = () => {};

    const initListener = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { onSnapshot } = await import('firebase/firestore');

        unsubscribe = onSnapshot(
          memoizedDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              setData({ ...(snapshot.data() as T), id: snapshot.id });
            } else {
              setData(null);
            }
            setError(null);
            setIsLoading(false);
          },
          (err) => {
            console.error("[useDoc] Subscription error:", err);
            const contextualError = new FirestorePermissionError({
              operation: 'get',
              path: memoizedDocRef.path,
            });
            setError(contextualError);
            setData(null);
            setIsLoading(false);
            errorEmitter.emit('permission-error', contextualError);
          }
        );
      } catch (err: any) {
        console.error("[useDoc] Init failed:", err);
        setIsLoading(false);
      }
    };

    initListener();
    return () => unsubscribe();
  }, [memoizedDocRef]);

  return { data, isLoading, error };
}
