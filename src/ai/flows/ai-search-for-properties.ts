'use server';
/**
 * @fileOverview Flujo de búsqueda conversacional de propiedades optimizado con Genkit.
 * - findProperty: Función principal de búsqueda.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export type PropertySearchInput = {
  query: string;
  properties: any[];
};

export type PropertySearchOutput = {
  response: string;
  propertyId?: string;
  error?: boolean;
};

/**
 * findProperty - Procesa la consulta del usuario contra el inventario disponible.
 * Ejecución 100% Server-Side con manejo de errores robusto.
 */
export async function findProperty(
  input: PropertySearchInput
): Promise<PropertySearchOutput> {
  try {
    if (!input.query || !input.properties) {
      throw new Error('Entrada inválida para la búsqueda IA');
    }

    const propertiesJson = JSON.stringify(input.properties.slice(0, 15)); // Limitamos contexto para evitar exceder tokens
    
    const systemPrompt = `Eres Crushome AI, un sofisticado y empático concierge inmobiliario. 
Tu objetivo no es solo emparejar palabras clave, sino comprender los deseos y emociones subyacentes.

Analiza la consulta en busca de señales:
- Tranquilidad/Paz -> Zonas residenciales o aisladas.
- Inspiración/Trabajo -> Lofts o mucha luz.
- Familia -> Espacios amplios, cercanía a escuelas.

Si encuentras UNA coincidencia perfecta, devuelve su id.`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      system: systemPrompt,
      prompt: `Consulta del usuario: "${input.query}"\n\nLista de propiedades disponibles:\n${propertiesJson}`,
      output: {
        format: 'json',
        schema: z.object({
          response: z.string().describe('Tu respuesta conversacional cálida y profesional'),
          propertyId: z.string().optional().describe('El id de la propiedad si hay una coincidencia excelente')
        })
      }
    });

    if (!output) {
      throw new Error('No se recibió respuesta estructurada del modelo');
    }

    return {
      response: output.response,
      propertyId: output.propertyId,
    };
  } catch (error: any) {
    console.error('[FIND_PROPERTY_ERROR]', error);
    return {
      response: "Lo siento, tuve un problema procesando tu búsqueda con IA. ¿Podrías intentar con filtros manuales?",
      error: true
    };
  }
}
