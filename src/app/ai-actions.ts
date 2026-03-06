"use server";

import { ai } from '@/ai/genkit';
import { ActionResponse } from './actions';

/**
 * @fileOverview AI-specific Server Actions.
 * Strictly isolated from UI actions to prevent Genkit/Google-Auth dependencies
 * from leaking into the Client Component module graph.
 */

export async function getAIResponse(prompt: string): Promise<ActionResponse<string>> {
  try {
    const { text } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `Actúa como el Neural Core de Crushome. Analiza y responde a: ${prompt}`,
    });

    return { success: true, data: text };
  } catch (error: any) {
    console.error('[ACTION:AI_RESPONSE] Error:', error);
    return { 
      success: false,
      error: "Error en el túnel cognitivo.",
      code: 'AI_INFERENCE_ERROR'
    };
  }
}
