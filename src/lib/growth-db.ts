import { v4 as uuid } from 'uuid';

// This is an in-memory mock DB. In a real app, this would be a database client.
export const db = {
  users: [
    { id: "u1", email: "demo@crushome.com", plan: "free", usage: 5, limit: 5, cohort: "new-users" },
    { id: "u2", email: "pro@crushome.com", plan: "pro", usage: 120, limit: 500, cohort: "power-users" }
  ],

  plans: [
    { key: "free", price: 0, limit: 5, features: ["search-ai"], active: true },
    { key: "starter", price: 19, limit: 50, features: ["search-ai"], active: true },
    { key: "pro", price: 59, limit: 500, features: ["search-ai", "upload-auto", "mls-sync"], active: true },
    { key: "enterprise", price: 199, limit: 999999, features: ["all"], active: true }
  ],

  features: [
    { key: "search-ai", minPlan: "starter", active: true, updatedAt: Date.now() },
    { key: "upload-auto", minPlan: "pro", active: true, updatedAt: Date.now() },
    { key: "mls-sync", minPlan: "pro", active: true, updatedAt: Date.now() },
    { key: "heatmap", minPlan: "enterprise", active: true, updatedAt: Date.now() },
    { key: "embeddings", minPlan: "enterprise", active: true, updatedAt: Date.now() }
  ],

  rollouts: [
    { id: "r1", feature: "upload-auto", cohort: "power-users", percent: 100, active: true, updatedAt: Date.now() },
    { id: "r2", feature: "heatmap", cohort: "enterprise", percent: 100, active: true, updatedAt: Date.now() }
  ],

  telemetry: [] as any[],
  stripeEvents: [] as any[],
  subscriptions: [] as any[],
  flags: { pricingOptimizer: true, aiCopy: true, cohorts: true },

  aiPrompt: `Sos un copywriter SaaS experto en conversión inmobiliaria.
Generá mensajes breves, claros y orientados a beneficios para incentivar upgrades de plan.`,

  pricingHistory: [] as any[],
};

export function logEvent(event: string, payload = {}, user: any = null) {
  db.telemetry.push({
    id: uuid(),
    event,
    payload,
    user: user?.id || null,
    ts: Date.now()
  });
}