'use client';

/**
 * @fileOverview Utilidades de autenticación robustas para CRUSHOME.
 * Implementa un flujo de autenticación claro basado en la intención del usuario.
 */

import type { User, Auth } from 'firebase/auth';

export type AuthResult = {
  user?: User | null;
  isNewUser: boolean;
  error?: string;
};

/**
 * Mapea los códigos de error de Firebase Auth a mensajes legibles.
 */
function mapAuthErrorToHumanReadable(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este correo ya tiene una cuenta activa. Por favor, iniciá sesión.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Contraseña o email incorrecto. Verificá tus datos.';
    case 'auth/user-not-found':
      return 'No encontramos una cuenta con este correo. ¿Querés registrarte?';
    case 'auth/weak-password':
      return 'La contraseña es muy débil. Usá al menos 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos fallidos. Tu cuenta ha sido bloqueada temporalmente.';
    default:
      return 'Ocurrió un error inesperado. Por favor, reintentá en unos minutos.';
  }
}

/**
 * authenticateOrRegister
 * Orquesta el flujo de registro o inicio de sesión basado en la intención explícita del usuario.
 * Usa importaciones dinámicas para optimizar la carga de dependencias.
 */
export async function authenticateOrRegister(
  auth: Auth, 
  email: string, 
  password: string,
  isLoginAttempt: boolean
): Promise<AuthResult> {
  
  const { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
  } = await import('firebase/auth');

  if (isLoginAttempt) {
    // --- FLUJO DE INICIO DE SESIÓN ---
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await userCredential.user.getIdToken(true); // Forzar refresh de claims
      return { user: userCredential.user, isNewUser: false };
    } catch (error: any) {
      return { isNewUser: false, error: mapAuthErrorToHumanReadable(error.code) };
    }
  } else {
    // --- FLUJO DE REGISTRO ---
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, isNewUser: true };
    } catch (error: any) {
      // Si el usuario ya existe, intentamos iniciar sesión como fallback.
      if (error.code === 'auth/email-already-in-use') {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          return { user: userCredential.user, isNewUser: false };
        } catch (loginError: any) {
          return { isNewUser: false, error: mapAuthErrorToHumanReadable(loginError.code) };
        }
      }
      return { isNewUser: false, error: mapAuthErrorToHumanReadable(error.code) };
    }
  }
}
