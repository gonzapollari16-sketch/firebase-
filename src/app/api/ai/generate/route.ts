import { NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';

/**
 * @fileOverview API Gateway de IA básica (Versión Original).
 */
export async function POST(req: Request) {
  try {
    const { prompt, system, model = 'googleai/gemini-1.5-flash' } = await req.json();

    const { text } = await ai.generate({
      model,
      system,
      prompt,
    });

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('[AI_GATEWAY_ERROR]', error);
    return NextResponse.json(
      { error: 'Falla interna en el motor de IA', message: error.message },
      { status: 500 }
    );
  }
}
