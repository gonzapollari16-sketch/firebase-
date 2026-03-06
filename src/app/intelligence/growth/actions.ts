'use server';

import { db, logEvent } from '@/lib/growth-db';
import { v4 as uuid } from 'uuid';

// This file replaces the Express server logic with Next.js Server Actions.

// Mock user for demo purposes
const getUser = () => db.users[0];

export async function getAdminDashboard() {
  const users = db.users.length;
  const paidUsers = db.users.filter(u => u.plan !== "free").length;
  const conversions = paidUsers / users;

  return {
    users: { active: users, trend: 12 },
    mrr: { value: paidUsers * 59, trend: 18 },
    conversions: { rate: Math.round(conversions * 100), trend: 9 },
    churn: { rate: 3.2, trend: -0.5 },
    recentUpgrades: db.telemetry
      .filter(e => e.event === "upgrade")
      .slice(-5)
      .map(e => ({
        user: e.user,
        from: (e.payload as any).from,
        to: (e.payload as any).to,
        feature: (e.payload as any).feature,
        ts: e.ts,
        date: new Date(e.ts).toISOString(),
        value: db.plans.find(p => p.key === (e.payload as any).to)?.price || 0,
        plan: (e.payload as any).to,
      }))
  };
}

export async function getAdminFeatures() {
  return db.features;
}

export async function updateAdminFeature(key: string, body: { active: boolean }) {
  const f = db.features.find(f => f.key === key);
  if (!f) throw new Error("Not found");
  f.active = body.active;
  f.updatedAt = Date.now();
  logEvent("feature_toggle", { feature: f.key, active: f.active });
  return f;
}

function pricingOptimizer() {
    const basePro = 59;
    const baseEnterprise = 199;
    const proElasticity = 1.12;
    const enterpriseElasticity = 1.05;
    const proPrice = Math.round(basePro * proElasticity);
    const enterprisePrice = Math.round(baseEnterprise * enterpriseElasticity);

    return {
        pro: { price: proPrice, delta: Math.round((proElasticity - 1) * 100) },
        enterprise: { price: enterprisePrice, delta: Math.round((enterpriseElasticity - 1) * 100) },
        elasticity: [
        { plan: "starter", elasticity: 0.92, conversion: 8.1 },
        { plan: "pro", elasticity: 1.12, conversion: 5.3 },
        { plan: "enterprise", elasticity: 1.05, conversion: 2.4 }
        ]
    };
}

export async function getPricingRecommendations() {
  return pricingOptimizer();
}

export async function applyPricing(plan: string) {
  const rec = (pricingOptimizer() as any)[plan];
  const p = db.plans.find(p => p.key === plan);
  if (!p) throw new Error("Plan not found");
  p.price = rec.price;
  db.pricingHistory.push({ plan, price: rec.price, ts: Date.now() });
  logEvent("pricing_applied", { plan, price: rec.price });
  return { ok: true };
}

export async function getRollouts() {
  return db.rollouts;
}

export async function createRollout(body: { feature: string, cohort: string, percent: number }) {
  const { feature, cohort, percent } = body;
  const rollout = {
    id: uuid(),
    feature,
    cohort,
    percent,
    active: true,
    updatedAt: Date.now()
  };
  db.rollouts.push(rollout);
  logEvent("rollout_created", rollout);
  return rollout;
}

export async function updateRollout(id: string, body: { percent: number }) {
  const r = db.rollouts.find(r => r.id === id);
  if (!r) throw new Error("Not found");
  r.percent = body.percent;
  r.updatedAt = Date.now();
  logEvent("rollout_updated", { id: r.id, percent: r.percent });
  return r;
}

export async function getAnalytics() {
  const byFeature: { [key: string]: { blocked: number, upgrades: number } } = {};
  
  db.telemetry.forEach(e => {
    if (e.event === "blocked") {
      const f = (e.payload as any).feature;
      byFeature[f] = byFeature[f] || { blocked: 0, upgrades: 0 };
      byFeature[f].blocked++;
    }
    if (e.event === "upgrade_click") {
      const f = (e.payload as any).feature;
      byFeature[f] = byFeature[f] || { blocked: 0, upgrades: 0 };
      byFeature[f].upgrades++;
    }
  });

  const blocks = Object.entries(byFeature).map(([feature, v]) => ({
    feature,
    blocked: v.blocked,
    upgrades: v.upgrades,
    conversion: v.blocked ? Math.round((v.upgrades / v.blocked) * 100) : 0
  }));

  const funnels = Object.values(db.plans).map(p => ({
    plan: p.key,
    blocked: Math.floor(Math.random() * 100),
    clicked: Math.floor(Math.random() * 60),
    paid: Math.floor(Math.random() * 40)
  }));

  return { blocks, funnels };
}

export async function getSubscriptions() { return db.subscriptions; }
export async function getStripeEvents() { return db.stripeEvents.slice(-50).reverse(); }
export async function cancelSubscription(subId: string) {
    const s = db.subscriptions.find((s:any) => s.id === subId);
    if (!s) throw new Error("Not found");
    (s as any).status = "canceled";
    logEvent("subscription_canceled", { subId: s.id });
    return { ok: true };
}

export async function getUsers() { return db.users; }
export async function getPlans() { return db.plans; }
export async function getTelemetry() { return db.telemetry.slice(-200).reverse(); }

export async function getAiPrompt() { return { prompt: db.aiPrompt }; }
export async function saveAiPrompt(prompt: string) {
  db.aiPrompt = prompt;
  logEvent("ai_prompt_updated", {});
  return { ok: true };
}

function generateCopy({ feature, plan }: { feature: string; plan: string }) {
    const benefitMap: Record<string, string> = {
        "upload-auto": "cargar propiedades 10× más rápido sin errores",
        "mls-sync": "publicar automáticamente en múltiples portales",
        "heatmap": "detectar zonas calientes antes que la competencia",
        "embeddings": "lograr matches territoriales de precisión extrema",
        "search-ai": "convertir búsquedas en cierres reales"
    };
    const benefit = benefitMap[feature] || "acceder a herramientas premium";
    return `Con el plan ${plan.toUpperCase()} vas a poder ${benefit}. Desbloquealo ahora y acelerá tus cierres desde hoy mismo.`;
}

export async function generateAiCopy(body: { feature: string; plan: string }) {
  const { feature, plan } = body;
  const text = generateCopy({ feature, plan });
  logEvent("ai_copy_generated", { feature, plan });
  return { text };
}

export async function getFlags() { return db.flags; }
export async function toggleFlag(flag: string, value: boolean) {
  (db.flags as any)[flag] = value;
  logEvent("flag_toggle", { flag, value });
  return { ok: true };
}

export async function createCheckoutSession(userId: string, plan: string) {
  const user = db.users.find(u => u.id === userId) || db.users[0];
  const p = db.plans.find(p => p.key === plan);
  if (!p) throw new Error("Plan not found");

  const session = {
    id: "cs_" + uuid(),
    url: `https://checkout.stripe.com/pay/cs_test_${uuid()}`
  };
  
  logEvent("checkout_created", { userId: user.id, plan, price: p.price }, user);
  return session;
}
