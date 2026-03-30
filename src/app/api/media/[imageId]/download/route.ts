import { NextRequest, NextResponse } from 'next/server';
import { MediaGateway, DownloadRequest } from '@/core/media/media-gateway';
import { getAdminDb } from '@/firebase/admin';
import type { UserRole, SubscriptionPlan } from '@/lib/types';

/**
 * @fileOverview Endpoint de descarga segura de imágenes.
 * Usa exclusivamente el Admin SDK para evitar conflictos de bundling con el Client SDK.
 */

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    const { imageId } = params;
    
    if (!imageId) {
      return NextResponse.json({ error: 'ID de imagen requerido' }, { status: 400 });
    }
    
    // 1. Obtener datos de la imagen usando Admin DB (con inicialización perezosa)
    const adminDb = getAdminDb();
    const imageSnap = await adminDb.collection('media').doc(imageId).get();

    if (!imageSnap.exists) {
      return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 });
    }

    const imageData = imageSnap.data()!;
    const userId = req.nextUrl.searchParams.get('uid') || 'system';

    // 2. Construir solicitud de descarga
    const downloadRequest: DownloadRequest = {
      imageId,
      originalUrl: imageData.url,
      userId: userId,
      userEmail: req.nextUrl.searchParams.get('email') || 'anonymous@crushome.ai',
      userRole: (req.nextUrl.searchParams.get('role') as UserRole) || 'USER',
      userPlan: (req.nextUrl.searchParams.get('plan') as SubscriptionPlan) || 'FREE',
      tenantId: imageData.tenantId || 'default',
      tenantName: imageData.tenantName || 'CRUSHOME'
    };

    // 3. Procesar imagen con Watermark
    const buffer = await MediaGateway.handleSecureDownload(downloadRequest);

    // 4. Retornar respuesta binaria. 
    // Convertimos Buffer a Uint8Array para satisfacer los tipos de BodyInit en Next.js
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/webp',
        'Content-Disposition': `attachment; filename="CRUSHOME_${imageId}.webp"`,
        'X-Content-Type-Options': 'nosniff'
      },
    });

  } catch (error: any) {
    console.error('[MEDIA_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Error procesando la descarga', message: error.message },
      { status: 500 }
    );
  }
}
