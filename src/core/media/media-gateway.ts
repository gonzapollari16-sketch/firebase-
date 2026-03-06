import { WatermarkEngine, WatermarkOptions } from './watermark-engine';
import { eventBus } from '../event-bus/event-bus';
import { UserRole, SubscriptionPlan } from '@/lib/types';

/**
 * @fileOverview Gateway de acceso a Media.
 * Controla la seguridad, permisos y procesamiento de activos visuales.
 */

export interface DownloadRequest {
  imageId: string;
  originalUrl: string;
  userId: string;
  userEmail: string;
  userRole: UserRole;
  userPlan: SubscriptionPlan;
  tenantId: string;
  tenantName: string;
}

export class MediaGateway {
  /**
   * Procesa una solicitud de descarga con protección.
   */
  static async handleSecureDownload(request: DownloadRequest): Promise<Buffer> {
    const { originalUrl, userEmail, userPlan, tenantName, imageId } = request;

    console.log(`[MediaGateway] Secure request for image ${imageId}`);

    // 1. Fetch de la imagen original
    const originalBuffer = await this.fetchOriginal(originalUrl);

    // 2. Configurar opciones de protección
    const watermarkOptions: WatermarkOptions = {
      text: `${userEmail} • ${new Date().toISOString()}`,
      plan: userPlan,
      tenantName: tenantName
    };

    // 3. Procesar con el motor de watermarking
    const protectedBuffer = await WatermarkEngine.process(originalBuffer, watermarkOptions);

    // 4. Emitir evento para auditoría y Growth Engine
    eventBus.emit('media.downloaded', {
      imageId,
      userId: request.userId,
      tenantId: request.tenantId,
      timestamp: new Date().toISOString()
    });

    return protectedBuffer;
  }

  /**
   * Método de utilidad para fetching (Placeholder para integración real con Storage)
   */
  private static async fetchOriginal(url: string): Promise<Buffer> {
    if (!url) return Buffer.alloc(0);
    try {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch {
      // Fallback simple para desarrollo
      return Buffer.alloc(0);
    }
  }
}
