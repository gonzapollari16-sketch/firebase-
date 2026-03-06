'use client';
import type { Auth } from 'firebase/auth';

/** 
 * Utility for anonymous sign-in using dynamic imports to prevent SSR errors.
 */
export async function initiateAnonymousSignIn(authInstance: Auth): Promise<void> {
  const { signInAnonymously } = await import('firebase/auth');
  signInAnonymously(authInstance);
}

/** 
 * Utility for email sign-up using dynamic imports to prevent SSR errors.
 */
export async function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  const { createUserWithEmailAndPassword } = await import('firebase/auth');
  createUserWithEmailAndPassword(authInstance, email, password);
}

/** 
 * Utility for email sign-in using dynamic imports to prevent SSR errors.
 */
export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  signInWithEmailAndPassword(authInstance, email, password);
}
