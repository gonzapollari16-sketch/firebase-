'use client';

/**
 * @fileOverview Utilidades de autenticación robustas para CRUSHOME.
 * Implementa el patrón de autenticación idempotente con carga dinámica para evitar errores de SSR.
 */

import type { User, Auth, UserCredential } from 'firebase/auth';

export type AuthResult = {
  user: User;
  isNewUser: boolean;
  error?: string;
};

/**
 * authenticateOrRegister
 * Intenta iniciar sesión o registrar al usuario de forma inteligente.
 * Usa importaciones dinámicas para evitar que undici/llhttp se arrastren al servidor.
 */
export async function authenticateOrRegister(
  auth: Auth, 
  email: string, 
  password: string,
  isExplicitLogin: boolean = true
): Promise<AuthResult> {
  try {
    // Importación dinámica de métodos de implementación
    const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import('firebase/auth');

    // 1. INTENTAR LOGIN PRIMERO
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Forzar refresh de token para asegurar que los claims (tenants) estén actualizados
      await userCredential.user.getIdToken(true);
      
      return {
        user: userCredential.user,
        isNewUser: false
      };
    } catch (loginError: any) {
      // 2. MANEJO DE CASOS DE REGISTRO
      if (loginError.code === 'auth/user-not-found' || (loginError.code === 'auth/invalid-credential' && !isExplicitLogin)) {
        try {
          const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
          return {
            user: newUserCredential.user,
            isNewUser: true
          };
        } catch (regError: any) {
          return {
            user: null as any,
            isNewUser: false,
            error: mapAuthErrorToHumanReadable(regError.code)
          };
        }
      }
      throw loginError;
    }

  } catch (error: any) {
    return {
      user: null as any,
      isNewUser: false,
      error: mapAuthErrorToHumanReadable(error.code)
    };
  }
}

function mapAuthErrorToHumanReadable(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este correo ya tiene una cuenta activa. Por favor, iniciá sesión.';
    case 'auth/wrong-password':
      return 'Contraseña incorrecta. Verificá tus datos.';
    case 'auth/user-not-found':
      return 'No encontramos una cuenta con este correo. ¿Querés registrarte?';
    case 'auth/invalid-credential':
      return 'Credenciales inválidas. Verificá tu email y contraseña.';
    case 'auth/weak-password':
      return 'La contraseña es muy débil. Usá al menos 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos fallidos. Intentá más tarde.';
    default:
      return 'Error en la autenticación. Reintentá en unos minutos.';
  }
}
