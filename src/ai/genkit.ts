import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview Configuración central de Genkit para CRUSHOME.
 * Se inicializa de forma segura para evitar bloqueos en el servidor si faltan credenciales.
 */
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey && process.env.NODE_ENV === 'production') {
  console.warn('[GENKIT] Advertencia: No se detectó API Key para Google AI. Las funciones de IA podrían fallar.');
}

export const ai = genkit({
  plugins: [
    googleAI({ apiKey }),
  ],
});
