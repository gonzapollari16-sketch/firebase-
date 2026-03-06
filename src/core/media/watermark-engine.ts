import sharp from 'sharp';
import { PlanEngine } from '../plans/plan-engine';
import { SubscriptionPlan } from '@/lib/types';

/**
 * @fileOverview Motor de Protección de Imágenes de CRUSHOME.
 * Implementa watermarking forense y visible con Sharp.
 */

export interface WatermarkOptions {
  text: string;
  opacity?: number;
  gravity?: 'southeast' | 'center' | 'northwest' | 'southwest' | 'northeast';
  plan: SubscriptionPlan;
  tenantName?: string;
}

export class WatermarkEngine {
  /**
   * Procesa una imagen aplicando capas de protección dinámicas.
   */
  static async process(input: Buffer, options: WatermarkOptions): Promise<Buffer> {
    const { text, plan, tenantName, opacity = 0.3, gravity = 'southeast' } = options;

    if (!input || input.length === 0) {
      throw new Error('Image buffer is empty or invalid');
    }

    // 1. Verificar si el plan permite remover o personalizar marcas
    const canHideBrand = PlanEngine.canAccess(plan, 'white-label');
    
    // 2. Generar el SVG del watermark dinámico
    const svgOverlay = this.generateOverlaySvg(text, tenantName || 'CRUSHOME', canHideBrand);

    // 3. Composición con Sharp
    let pipeline = sharp(input)
      .composite([{
        input: Buffer.from(svgOverlay),
        gravity,
        blend: 'over'
      }]);

    // 4. Agregar marca forense invisible en metadatos (EXIF)
    pipeline = pipeline.withMetadata({
      exif: {
        IFD0: {
          Copyright: `CRUSHOME PROTECTION - ${text} - ${new Date().toISOString()}`,
          Software: 'CRUSHOME Forensic Engine v3'
        }
      }
    });

    // 5. Salida optimizada (WebP por defecto para web, JPEG para descargas)
    return await pipeline
      .webp({ quality: 85 })
      .toBuffer();
  }

  /**
   * Genera una marca de agua visual basada en SVG.
   */
  private static generateOverlaySvg(forensicText: string, brand: string, isWhiteLabel: boolean): string {
    const brandText = isWhiteLabel ? brand : `CRUSHOME • ${brand}`;
    
    return `
      <svg width="500" height="100">
        <style>
          .brand { fill: rgba(255, 255, 255, 0.5); font-family: sans-serif; font-size: 24px; font-weight: bold; }
          .forensic { fill: rgba(255, 255, 255, 0.3); font-family: monospace; font-size: 10px; }
        </style>
        <text x="480" y="40" text-anchor="end" class="brand">${brandText}</text>
        <text x="480" y="60" text-anchor="end" class="forensic">${forensicText}</text>
      </svg>
    `;
  }
}
