import { NextResponse } from 'next/server';
import { db, logEvent } from '@/lib/growth-db';

// The body of this function will be the raw JSON from Stripe.
// We are not verifying the signature here for simplicity, but in production, you must.

// Forzar el renderizado dinámico para evitar errores de compilación estática.
export async function generateStaticParams() {
  return [];
}

export async function POST(request: Request) {
  try {
    const event = await request.json();

    // Log the raw event for debugging
    db.stripeEvents.push({
      id: event.id,
      type: event.type,
      object: event.data?.object?.object || "unknown",
      user: event.data?.object?.metadata?.userId || null,
      ts: Date.now()
    });

    if (event.type === "checkout.session.completed") {
      const userId = event.data.object.metadata.userId;
      const plan = event.data.object.metadata.plan;
      const user = db.users.find((u:any) => u.id === userId);
      
      if (user) {
        const oldPlan = user.plan;
        user.plan = plan;
        logEvent("upgrade", { from: oldPlan, to: plan }, user);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }
}