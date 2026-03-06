'use client';
    
import type {
  CollectionReference,
  DocumentReference,
  SetOptions,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Initiates a setDoc operation using dynamic imports to prevent SSR errors.
 */
export async function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
  const { setDoc } = await import('firebase/firestore');
  setDoc(docRef, data, options).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'write',
        requestResourceData: data,
      })
    )
  })
}

/**
 * Initiates an addDoc operation using dynamic imports to prevent SSR errors.
 */
export async function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  const { addDoc } = await import('firebase/firestore');
  const promise = addDoc(colRef, data)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: colRef.path,
          operation: 'create',
          requestResourceData: data,
        })
      )
    });
  return promise;
}

/**
 * Initiates an updateDoc operation using dynamic imports to prevent SSR errors.
 */
export async function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  const { updateDoc } = await import('firebase/firestore');
  updateDoc(docRef, data)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: data,
        })
      )
    });
}

/**
 * Initiates a deleteDoc operation using dynamic imports to prevent SSR errors.
 */
export async function deleteDocumentNonBlocking(docRef: DocumentReference) {
  const { deleteDoc } = await import('firebase/firestore');
  deleteDoc(docRef)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        })
      )
    });
}
