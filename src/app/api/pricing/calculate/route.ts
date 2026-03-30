import { NextResponse } from 'next/server';
import { PricingEngineService } from '@/services/pricing-engine.service';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * @fileOverview API Route consolidada para cálculo de pricing.
 * Usa exclusivamente el Admin SDK modular para evitar fallos de inicialización.
 */

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { getAdminDb } = await import('@/firebase/admin');
    const adminDb = getAdminDb();
    const body = await req.json();
    const { propertyId, tenantId, metros, barrio, tipo, ambientes, userId } = body;

    if (!tenantId || !propertyId) {
      return NextResponse.json({ error: 'Contexto de identidad inválido' }, { status: 400 });
    }

    // 1. Ejecutar Inferencia Ridge (Backend Service)
    const result = await PricingEngineService.calculateRecommendedPrice({
      metros,
      barrio,
      tipo,
      ambientes
    });

    // 2. Persistir en el rastro de auditoría del Tenant
    const historyPath = `tenants/${tenantId}/properties/${propertyId}/pricing-history`;
    await adminDb.collection(historyPath).add({
      ...result,
      calculatedBy: userId,
      timestamp: FieldValue.serverTimestamp(),
      inputSnapshot: { metros, barrio, tipo, ambientes }
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[PRICING_CRITICAL_FAIL]', error);
    return NextResponse.json(
      { error: 'Falla en el motor de inferencia', version: 'ridge-v1' },
      { status: 500 }
    );
  }
}
