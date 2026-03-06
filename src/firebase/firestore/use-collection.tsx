'use client';

import { useState, useEffect } from 'react';
import type {
  Query,
  DocumentData,
  FirestoreError,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
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
          memoizedTargetRefOrQuery,
          (snapshot) => {
            const results: WithId<T>[] = [];
            snapshot.forEach((doc) => {
              results.push({ ...(doc.data() as T), id: doc.id });
            });
            setData(results);
            setError(null);
            setIsLoading(false);
          },
          (err) => {
            console.error("[useCollection] Subscription error:", err);
            const path = (memoizedTargetRefOrQuery as any).path || "query";
            const contextualError = new FirestorePermissionError({
              operation: 'list',
              path,
            });
            setError(contextualError);
            setData(null);
            setIsLoading(false);
            errorEmitter.emit('permission-error', contextualError);
          }
        );
      } catch (err: any) {
        console.error("[useCollection] Init failed:", err);
        setIsLoading(false);
      }
    };

    initListener();
    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery]);

  if(memoizedTargetRefOrQuery && !memoizedTargetRefOrQuery.__memo) {
    console.warn('[useCollection] Target was not properly memoized using useMemoFirebase. This may cause memory leaks or infinite re-renders.');
  }

  return { data, isLoading, error };
}
