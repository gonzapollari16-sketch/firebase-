'use client';

import React, { useState, useEffect } from 'react';
import {
  getAdminDashboard,
  getAdminFeatures,
  updateAdminFeature,
  getPricingRecommendations,
  applyPricing,
  getRollouts,
  createRollout,
  updateRollout,
  getAnalytics,
  getSubscriptions,
  cancelSubscription,
  getStripeEvents,
  getUsers,
  getPlans,
  getTelemetry,
  getAiPrompt,
  saveAiPrompt,
  generateAiCopy,
  getFlags,
  toggleFlag,
  createCheckoutSession
} from './actions';
import Link from 'next/link';

// ============================================================
// CRUSHOME SAAS FRONTEND — ENTERPRISE
// Conectado a backend real Node
// ============================================================

interface RecentUpgrade {
    user: string;
    from: string;
    to: string;
    feature: string;
    date: string;
    value: number;
    ts: number;
    plan: string;
}

interface Metrics {
    users: { active?: number; trend?: number; total?: number; };
    mrr: { value?: number; trend?: number; total?: number; };
    conversions: { rate?: number; total?: number; };
    churn: { rate?: number; total?: number; };
    recentUpgrades: RecentUpgrade[];
}

interface Feature {
    key: string;
    name: string;
    minPlan: string;
    usage: number;
    active: boolean;
    updatedAt?: number;
}

interface PricingInfo {
    price?: number;
    delta?: number;
    current?: number;
    recommended?: number;
}

interface ElasticityItem {
    plan: string;
    price: number;
    conversion: number;
    elasticity?: number;
    mrr?: number;
}

interface Pricing {
    pro: PricingInfo;
    enterprise: PricingInfo;
    elasticity: ElasticityItem[];
}

interface Rollout {
    id: string;
    feature: string;
    cohort: string;
    percent: number;
    active?: boolean;
    status?: string;
    updatedAt?: number;
}

interface AnalyticsBlock {
    feature: string;
    blocked?: number;
    upgrades?: number;
    conversion?: number;
    plan?: string;
    count?: number;
    impact?: string;
}

interface AnalyticsFunnel {
    plan: string;
    blocked: number;
    clicked: number;
    paid: number;
}

interface Analytics {
    blocks: AnalyticsBlock[];
    funnels: AnalyticsFunnel[];
}

interface Subscription {
    id: string;
    user: string;
    plan: string;
    status: string;
    nextCharge: string;
}

interface StripeEvent {
    id: string;
    type: string;
    object: string;
    user: string;
    ts: string;
}

interface User {
    id: string;
    email: string;
    plan: string;
    usage: number;
    limit: number;
    cohort: string;
}

interface Plan {
    key: string;
    price: number;
    limit: number;
    features: string[];
    active: boolean;
}

interface TelemetryEvent {
    id: string;
    event: string;
    user: string;
    feature?: string;
    payload: Record<string, unknown>;
    ts: string;
}

interface AppData {
    user: null | Record<string, unknown>;
    metrics: Metrics;
    features: Feature[];
    pricing: Pricing;
    rollouts: Rollout[];
    analytics: Analytics;
    subscriptions: Subscription[];
    stripeEvents: StripeEvent[];
    users: User[];
    plans: Plan[];
    telemetry: TelemetryEvent[];
    aiPrompt: string;
    flags: Record<string, boolean>;
}


const GrowthPage = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [toast, setToast] = useState({ show: false, message: '' });
    const [upgradeModal, setUpgradeModal] = useState<{show: boolean, userId: string | null}>({ show: false, userId: null });
    const [appData, setAppData] = useState<AppData>({
        user: null,
        metrics: { 
            users: {}, 
            mrr: {}, 
            conversions: {}, 
            churn: {}, 
            recentUpgrades: [] 
        },
        features: [],
        pricing: { pro: {}, enterprise: {}, elasticity: [] },
        rollouts: [],
        analytics: { blocks: [], funnels: [] },
        subscriptions: [],
        stripeEvents: [],
        users: [],
        plans: [],
        telemetry: [],
        aiPrompt: '',
        flags: {}
    });

    const showToast = (message: string) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 2800);
    };

    const switchPage = (page: string) => {
        setCurrentPage(page);
    };
    
    const loadPageData = async (page: string) => {
        try {
            switch(page) {
                case 'dashboard': {
                    const data = await getAdminDashboard(); 
                    if (data) setAppData((s) => ({...s, metrics: data as Metrics})); 
                    break;
                }
                case 'features': {
                    const data = await getAdminFeatures(); 
                    if (data) setAppData((s) => ({...s, features: data as Feature[]})); 
                    break;
                }
                case 'pricing': {
                    const data = await getPricingRecommendations(); 
                    if (data) setAppData((s) => ({...s, pricing: data as Pricing})); 
                    break;
                }
                case 'cohorts': {
                    const data = await getRollouts(); 
                    if (data) setAppData((s) => ({...s, rollouts: data as Rollout[]})); 
                    break;
                }
                case 'analytics': {
                    const data = await getAnalytics(); 
                    if (data) setAppData((s) => ({...s, analytics: data as Analytics})); 
                    break;
                }
                case 'billing': {
                    const subs = await getSubscriptions();
                    const events = await getStripeEvents();
                    if (subs && events) {
                        setAppData((s) => ({
                            ...s, 
                            subscriptions: subs as Subscription[], 
                            stripeEvents: events as StripeEvent[]
                        }));
                    }
                    break;
                }
                case 'users': {
                    const data = await getUsers(); 
                    if (data) setAppData((s) => ({...s, users: data as User[]})); 
                    break;
                }
                case 'plans': {
                    const data = await getPlans(); 
                    if (data) setAppData((s) => ({...s, plans: data as Plan[]})); 
                    break;
                }
                case 'telemetry': {
                    const data = await getTelemetry(); 
                    if (data) setAppData((s) => ({...s, telemetry: data as TelemetryEvent[]})); 
                    break;
                }
                case 'ai-copy': {
                    const data = await getAiPrompt(); 
                    if (data && typeof data === 'object' && 'prompt' in data) {
                        setAppData((s) => ({...s, aiPrompt: data.prompt as string}));
                    }
                    const features = await getAdminFeatures();
                    if (features) setAppData((s) => ({...s, features: features as Feature[]}));
                    break;
                }
                case 'settings': {
                    const data = await getFlags(); 
                    if (data) setAppData((s) => ({...s, flags: data as Record<string, boolean>})); 
                    break;
                }
            }
        } catch (e) {
            console.error(`Failed to load data for page: ${page}`, e);
            showToast(`Error cargando datos para ${page}`);
        }
    };

    useEffect(() => {
        loadPageData(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);
    
    // UI Handlers
    const FeaturesUI = { 
        toggle: async (key: string, active: boolean) => { 
            await updateAdminFeature(key, { active }); 
            showToast("Feature actualizado"); 
        } 
    };
    
    const PricingUI = { 
        apply: async (plan: string) => { 
            await applyPricing(plan); 
            showToast(`Nuevo precio aplicado para ${plan}`); 
        } 
    };
    
    const CohortUI = { 
        create: async () => { 
            const featureEl = document.getElementById("rolloutFeature") as HTMLSelectElement;
            const cohortEl = document.getElementById("rolloutCohort") as HTMLSelectElement;
            const percentEl = document.getElementById("rolloutPercent") as HTMLInputElement;
            
            if (featureEl && cohortEl && percentEl) {
                await createRollout({
                    feature: featureEl.value,
                    cohort: cohortEl.value,
                    percent: Number(percentEl.value)
                });
                showToast("Rollout creado"); 
                loadPageData('cohorts');
            }
        }, 
        update: async (id: string) => { 
            const percentEl = document.getElementById(`rollout-${id}`) as HTMLInputElement;
            if (percentEl) {
                await updateRollout(id, { percent: Number(percentEl.value) }); 
                showToast("Rollout actualizado");
            }
        } 
    };
    
    const BillingUI = { 
        cancel: async (id: string) => { 
            await cancelSubscription(id); 
            showToast("Suscripción cancelada"); 
            loadPageData('billing'); 
        } 
    };
    
    const UsersUI = { 
        upgrade: (userId: string) => { 
            setUpgradeModal({ show: true, userId }); 
        } 
    };
    
    const AICopyUI = { 
        savePrompt: async () => { 
            const promptEl = document.getElementById("aiPrompt") as HTMLTextAreaElement;
            if (promptEl) {
                await saveAiPrompt(promptEl.value); 
                showToast("Prompt guardado");
            }
        }, 
        generate: async () => { 
            const featureEl = document.getElementById("aiTestFeature") as HTMLSelectElement;
            const planEl = document.getElementById("aiTestPlan") as HTMLSelectElement;
            const resultEl = document.getElementById("aiResult");
            
            if (featureEl && planEl && resultEl) {
                const result = await generateAiCopy({ feature: featureEl.value, plan: planEl.value });
                resultEl.innerText = result.text || "Error generando copy";
            }
        } 
    };
    
    const SettingsUI = { 
        toggle: async (key: string, val: boolean) => { 
            await toggleFlag(key, val); 
            showToast(`Flag ${key} actualizado`); 
        } 
    };
    
    const UpgradeUI = { 
        close: () => { 
            setUpgradeModal({ show: false, userId: null }); 
        }, 
        goCheckout: async () => { 
            if (upgradeModal.userId) {
                const session = await createCheckoutSession(upgradeModal.userId, 'pro');
                if (session && typeof session === 'object' && 'url' in session) {
                    window.location.href = session.url as string;
                }
            }
        } 
    };

    return (
        <>
            <style jsx>{`
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                .container { display: flex; height: 100vh; overflow: hidden; }
                aside { width: 220px; background: rgba(0,0,0,.3); padding: 20px; display: flex; flex-direction: column; }
                aside .logo { font-size: 18px; font-weight: 700; margin-bottom: 30px; }
                aside nav a { display: block; padding: 10px 14px; margin-bottom: 6px; border-radius: 10px; color: white; text-decoration: none; transition: .2s; cursor: pointer; }
                aside nav a:hover { background: rgba(255,255,255,.1); }
                aside nav a.active { background: rgba(255,255,255,.2); }
                main { flex: 1; padding: 24px; overflow-y: auto; }
                .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .page-title { font-size: 26px; font-weight: 700; }
                .page-sub { font-size: 13px; opacity: .75; margin-top: 4px; }
                .card { background: rgba(255,255,255,.1); backdrop-filter: blur(10px); border-radius: 16px; padding: 20px; box-shadow: 0 8px 32px rgba(0,0,0,.1); }
                .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 16px; }
                .metric { display: flex; flex-direction: column; }
                .metric .label { font-size: 12px; opacity: .7; margin-bottom: 4px; }
                .metric .value { font-size: 24px; font-weight: 700; }
                table { width: 100%; border-collapse: collapse; margin-top: 12px; }
                table th, table td { text-align: left; padding: 10px; border-bottom: 1px solid rgba(255,255,255,.1); }
                table th { font-weight: 600; font-size: 12px; opacity: .7; }
                .btn { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: .2s; }
                .btn-primary { background: white; color: #667eea; }
                .btn-secondary { background: rgba(255,255,255,.2); color: white; }
                .btn:hover { transform: translateY(-2px); }
                .form-group { margin-bottom: 12px; }
                .form-group label { display: block; font-size: 12px; margin-bottom: 4px; opacity: .8; }
                .form-group select, .form-group input { width: 100%; padding: 8px; border-radius: 8px; border: none; background: rgba(255,255,255,.1); color: white; }
                .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,.2); border-radius: 24px; transition: .3s; }
                .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: .3s; }
                input:checked + .slider { background: #4caf50; }
                input:checked + .slider:before { transform: translateX(20px); }
                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,.6); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .modal { background: white; color: #333; padding: 30px; border-radius: 16px; max-width: 400px; width: 90%; }
                .modal h2 { margin-bottom: 10px; }
                .modal .actions { display: flex; gap: 10px; margin-top: 20px; }
                .toast { position: fixed; bottom: 20px; right: 20px; background: rgba(0,0,0,.85); color: white; padding: 14px 20px; border-radius: 12px; font-size: 13px; z-index: 1001; }
                .hidden { display: none !important; }
            `}</style>
            <div className="container">
                <aside>
                    <div className="logo">🚀 CruSaaS</div>
                    <nav>
                        <a href="#" className={currentPage === 'dashboard' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchPage('dashboard'); }}>Dashboard</a>
                        <a href="#" className={currentPage === 'features' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchPage('features'); }}>Features</a>
                        <a href="#" className={currentPage === 'pricing' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchPage('pricing'); }}>Pricing</a>
                        <a href="#" className={currentPage === 'cohorts' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchPage('cohorts'); }}>Cohorts</a>
                        <a href="#" className={currentPage === 'analytics' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchPage('analytics'); }}>Analytics</a>
                        <a href="#" className={currentPage === 'billing' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchPage('billing'); }}>Billing</a>
                        <a href="#" className={currentPage === 'users' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchPage('users'); }}>Usuarios</a>
                        <a href="#" className={currentPage === 'plans' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchPage('plans'); }}>Planes</a>
                        <a href="#" className={currentPage === 'telemetry' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchPage('telemetry'); }}>Telemetría</a>
                        <a href="#" className={currentPage === 'ai-copy' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchPage('ai-copy'); }}>IA Copy</a>
                        <a href="#" className={currentPage === 'settings' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchPage('settings'); }}>Settings</a>
                    </nav>
                </aside>

                <main>
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
                        <Link href="/"><button className="btn btn-secondary">Volver al Dashboard</button></Link>
                    </div>
                    <section>
                        {/* Dashboard */}
                        <div id="page-dashboard" className={currentPage === 'dashboard' ? '' : 'hidden'}>
                            <div className="page-title">Dashboard</div>
                            <div className="page-sub">Métricas SaaS centralizadas</div>
                            <div className="grid">
                                <div className="card">
                                    <div className="metric">
                                        <span className="label">Usuarios activos</span>
                                        <span className="value">{appData.metrics?.users?.total || appData.metrics?.users?.active || 0}</span>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="metric">
                                        <span className="label">MRR</span>
                                        <span className="value">${appData.metrics?.mrr?.total || appData.metrics?.mrr?.value || 0}</span>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="metric">
                                        <span className="label">Conversión</span>
                                        <span className="value">{appData.metrics?.conversions?.rate || 0}%</span>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="metric">
                                        <span className="label">Churn</span>
                                        <span className="value">{appData.metrics?.churn?.rate || 0}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card" style={{marginTop: '16px'}}>
                                <h3>Upgrades recientes</h3>
                                <table>
                                    <thead><tr><th>Usuario</th><th>Plan</th><th>Fecha</th><th>Valor</th></tr></thead>
                                    <tbody>
                                        {appData.metrics?.recentUpgrades?.map((u, i) => (
                                            <tr key={i}><td>{u.user}</td><td>{u.plan}</td><td>{new Date(u.date).toLocaleDateString()}</td><td>${u.value}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Features */}
                        <div id="page-features" className={currentPage === 'features' ? '' : 'hidden'}>
                            <div className="page-title">Feature Gating</div>
                            <div className="page-sub">Control granular por plan</div>
                            <div className="card">
                                <h3>Features activos</h3>
                                <table>
                                    <thead><tr><th>Feature</th><th>Plan mínimo</th><th>Uso</th><th>Activo</th></tr></thead>
                                    <tbody>
                                        {appData.features?.map((f) => (
                                            <tr key={f.key}>
                                                <td>{f.name}</td>
                                                <td>{f.minPlan}</td>
                                                <td>{f.usage}</td>
                                                <td>
                                                    <label className="switch">
                                                        <input type="checkbox" defaultChecked={f.active} onChange={e => FeaturesUI.toggle(f.key, e.target.checked)} />
                                                        <span className="slider"></span>
                                                    </label>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div id="page-pricing" className={currentPage === 'pricing' ? '' : 'hidden'}>
                            <div className="page-title">Pricing Optimizer</div>
                            <div className="page-sub">ML-driven pricing recommendations</div>
                            <div className="grid">
                                <div className="card">
                                    <h3>Pro</h3>
                                    <div className="metric">
                                        <span className="label">Precio actual</span>
                                        <span className="value">${appData.pricing?.pro?.current || appData.pricing?.pro?.price || 0}</span>
                                    </div>
                                    <div className="metric" style={{marginTop: '10px'}}>
                                        <span className="label">Recomendado</span>
                                        <span className="value">${appData.pricing?.pro?.recommended || 0}</span>
                                    </div>
                                    <button className="btn btn-primary" style={{marginTop: '12px'}} onClick={() => PricingUI.apply('pro')}>Aplicar</button>
                                </div>
                                <div className="card">
                                    <h3>Enterprise</h3>
                                    <div className="metric">
                                        <span className="label">Precio actual</span>
                                        <span className="value">${appData.pricing?.enterprise?.current || appData.pricing?.enterprise?.price || 0}</span>
                                    </div>
                                    <div className="metric" style={{marginTop: '10px'}}>
                                        <span className="label">Recomendado</span>
                                        <span className="value">${appData.pricing?.enterprise?.recommended || 0}</span>
                                    </div>
                                    <button className="btn btn-primary" style={{marginTop: '12px'}} onClick={() => PricingUI.apply('enterprise')}>Aplicar</button>
                                </div>
                            </div>
                            <div className="card" style={{marginTop: '16px'}}>
                                <h3>Elasticidad precio-demanda</h3>
                                <table>
                                    <thead><tr><th>Plan</th><th>Precio</th><th>Conversión estimada</th><th>MRR proyectado</th></tr></thead>
                                    <tbody>
                                        {appData.pricing?.elasticity?.map((e, i) => (
                                            <tr key={i}><td>{e.plan}</td><td>${e.price}</td><td>{e.conversion}%</td><td>${e.mrr || 0}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Cohorts */}
                        <div id="page-cohorts" className={currentPage === 'cohorts' ? '' : 'hidden'}>
                            <div className="page-title">Cohort Rollouts</div>
                            <div className="page-sub">Gradual feature deployment</div>
                            <div className="card">
                                <h3>Crear rollout</h3>
                                <div className="grid">
                                    <div className="form-group">
                                        <label>Feature</label>
                                        <select id="rolloutFeature">
                                            {appData.features?.map((f) => (
                                                <option key={f.key} value={f.key}>{f.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Cohort</label>
                                        <select id="rolloutCohort">
                                            <option value="beta">Beta</option>
                                            <option value="early">Early</option>
                                            <option value="general">General</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Porcentaje</label>
                                        <input id="rolloutPercent" type="number" min="0" max="100" defaultValue="10" />
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={CohortUI.create}>Crear rollout</button>
                            </div>
                            <div className="card" style={{marginTop: '16px'}}>
                                <h3>Rollouts activos</h3>
                                <table>
                                    <thead><tr><th>Feature</th><th>Cohort</th><th>%</th><th>Estado</th><th>Acción</th></tr></thead>
                                    <tbody>
                                        {appData.rollouts?.map((r) => (
                                            <tr key={r.id}>
                                                <td>{r.feature}</td>
                                                <td>{r.cohort}</td>
                                                <td><input id={`rollout-${r.id}`} type="number" defaultValue={r.percent} style={{width:'60px'}} /></td>
                                                <td>{r.status || (r.active ? 'Activo' : 'Inactivo')}</td>
                                                <td><button className="btn btn-secondary" onClick={() => CohortUI.update(r.id)}>Actualizar</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Analytics */}
                        <div id="page-analytics" className={currentPage === 'analytics' ? '' : 'hidden'}>
                             <div className="page-title">Analytics</div>
                             <div className="page-sub">Conversión y funnel tracking</div>
                             <div className="card">
                                 <h3>Feature blocks</h3>
                                 <small>Usuarios que intentaron usar features bloqueadas</small>
                                 <div style={{marginTop: '12px'}}>
                                     <table>
                                         <thead><tr><th>Feature</th><th>Plan usuario</th><th>Bloques</th><th>Impacto</th></tr></thead>
                                         <tbody>
                                             {appData.analytics?.blocks?.map((b, idx) => (
                                                <tr key={idx}><td>{b.feature}</td><td>{b.plan || '-'}</td><td>{b.count || b.blocked || 0}</td><td>{b.impact || '-'}</td></tr>
                                             ))}
                                         </tbody>
                                     </table>
                                 </div>
                             </div>
                             <div className="card" style={{marginTop: '16px'}}>
                                 <h3>Conversion funnel</h3>
                                 <small>Desde bloqueo hasta pago</small>
                                 <div style={{marginTop: '12px'}}>
                                     <table>
                                         <thead><tr><th>Plan</th><th>Bloqueados</th><th>Click CTA</th><th>Pagos</th></tr></thead>
                                         <tbody>
                                             {appData.analytics?.funnels?.map((f) => (
                                                <tr key={f.plan}><td>{f.plan}</td><td>{f.blocked}</td><td>{f.clicked}</td><td>{f.paid}</td></tr>
                                             ))}
                                         </tbody>
                                     </table>
                                 </div>
                             </div>
                        </div>

                        {/* Billing */}
                        <div id="page-billing" className={currentPage === 'billing' ? '' : 'hidden'}>
                            <div className="page-title">Billing & Stripe</div>
                            <div className="page-sub">Suscripciones, pagos y webhooks</div>
                            <div className="card">
                                <h3>Suscripciones activas</h3>
                                <table>
                                    <thead><tr><th>Usuario</th><th>Plan</th><th>Status</th><th>Próximo cobro</th><th>Acción</th></tr></thead>
                                    <tbody>
                                        {appData.subscriptions?.map((s) => (
                                            <tr key={s.id}><td>{s.user}</td><td>{s.plan}</td><td>{s.status}</td><td>{new Date(s.nextCharge).toLocaleDateString()}</td><td><button className="btn btn-secondary" onClick={() => BillingUI.cancel(s.id)}>Cancelar</button></td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card" style={{marginTop: '16px'}}>
                                <h3>Eventos Stripe recientes</h3>
                                <table>
                                    <thead><tr><th>Evento</th><th>Objeto</th><th>Usuario</th><th>Timestamp</th></tr></thead>
                                    <tbody>
                                        {appData.stripeEvents?.map((e) => (
                                            <tr key={e.id}><td>{e.type}</td><td>{e.object}</td><td>{e.user}</td><td>{new Date(e.ts).toLocaleString()}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Users */}
                        <div id="page-users" className={currentPage === 'users' ? '' : 'hidden'}>
                             <div className="page-title">Usuarios</div>
                             <div className="page-sub">Gestión SaaS multi-plan</div>
                             <div className="card">
                                 <h3>Usuarios activos</h3>
                                 <table>
                                    <thead><tr><th>ID</th><th>Email</th><th>Plan</th><th>Uso</th><th>Cohort</th><th>Acción</th></tr></thead>
                                    <tbody>
                                        {appData.users?.map((u) => (
                                            <tr key={u.id}><td>{u.id}</td><td>{u.email}</td><td>{u.plan}</td><td>{u.usage}/{u.limit}</td><td>{u.cohort}</td><td><button className="btn btn-secondary" onClick={() => UsersUI.upgrade(u.id)}>Upgrade</button></td></tr>
                                        ))}
                                    </tbody>
                                 </table>
                             </div>
                        </div>

                        {/* Plans */}
                        <div id="page-plans" className={currentPage === 'plans' ? '' : 'hidden'}>
                             <div className="page-title">Planes</div>
                             <div className="page-sub">Configuración de límites y features</div>
                             <div className="card">
                                 <h3>Planes activos</h3>
                                 <table>
                                     <thead><tr><th>Plan</th><th>Precio</th><th>Límite consultas</th><th>Features</th><th>Activo</th></tr></thead>
                                     <tbody>
                                        {appData.plans?.map((p) => (
                                            <tr key={p.key}><td>{p.key}</td><td>${p.price}</td><td>{p.limit}</td><td>{p.features.join(', ')}</td><td>{p.active ? 'Sí' : 'No'}</td></tr>
                                        ))}
                                     </tbody>
                                 </table>
                             </div>
                        </div>
                        
                        {/* Telemetry */}
                        <div id="page-telemetry" className={currentPage === 'telemetry' ? '' : 'hidden'}>
                            <div className="page-title">Telemetría</div>
                            <div className="page-sub">Eventos crudos del sistema</div>
                            <div className="card">
                                <h3>Eventos recientes</h3>
                                <table>
                                    <thead><tr><th>Evento</th><th>Usuario</th><th>Feature</th><th>Payload</th><th>Timestamp</th></tr></thead>
                                    <tbody>
                                        {appData.telemetry?.map((e) => (
                                            <tr key={e.id}><td>{e.event}</td><td>{e.user}</td><td>{e.feature || '-'}</td><td>{JSON.stringify(e.payload)}</td><td>{new Date(e.ts).toLocaleString()}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* AI Copy */}
                        <div id="page-ai-copy" className={currentPage === 'ai-copy' ? '' : 'hidden'}>
                            <div className="page-title">Motor IA de Copy</div>
                            <div className="page-sub">Generación dinámica de mensajes de upsell</div>
                            <div className="grid">
                                <div className="card">
                                    <h3>Prompt base activo</h3><small>Usado para generación automática</small>
                                    <div className="form-group" style={{marginTop:'10px'}}><textarea id="aiPrompt" rows={6} defaultValue={appData.aiPrompt} style={{width:'100%',borderRadius:'12px',border:'none',background:'rgba(255,255,255,.1)',color:'white',padding:'10px',fontSize:'12px'}}></textarea></div>
                                    <button className="btn btn-primary" onClick={AICopyUI.savePrompt}>Guardar prompt</button>
                                </div>
                                <div className="card">
                                    <h3>Test de generación</h3><small>Simulación backend IA</small>
                                    <div className="form-group" style={{marginTop:'10px'}}><label>Feature</label>
                                      <select id="aiTestFeature">
                                        {appData.features?.map((f) => (
                                          <option key={f.key} value={f.key}>{f.name}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="form-group"><label>Plan usuario</label><select id="aiTestPlan"><option value="free">Free</option><option value="starter">Starter</option><option value="pro">Pro</option><option value="enterprise">Enterprise</option></select></div>
                                    <button className="btn btn-secondary" onClick={AICopyUI.generate}>Generar copy</button>
                                    <div id="aiResult" style={{marginTop:'12px',fontSize:'13px',opacity:'.85'}}></div>
                                </div>
                            </div>
                        </div>

                        {/* Settings */}
                        <div id="page-settings" className={currentPage === 'settings' ? '' : 'hidden'}>
                             <div className="page-title">Configuración</div>
                             <div className="page-sub">Parámetros globales del sistema</div>
                             <div className="card">
                                 <h3>Flags globales</h3>
                                 <table>
                                     <thead><tr><th>Flag</th><th>Activo</th><th>Descripción</th></tr></thead>
                                     <tbody>
                                         {Object.entries(appData.flags).map(([key, val]) => (
                                             <tr key={key}>
                                                <td>{key}</td>
                                                <td><label className="switch"><input type="checkbox" defaultChecked={val} onChange={e => SettingsUI.toggle(key, e.target.checked)} /><span className="slider"></span></label></td>
                                                <td>Feature flag global</td>
                                             </tr>
                                         ))}
                                     </tbody>
                                 </table>
                             </div>
                        </div>

                    </section>
                </main>

                {upgradeModal.show && (
                    <div id="upgradeModalOverlay" className="modal-overlay" style={{display: 'flex'}}>
                        <div className="modal">
                            <h2 id="upgradeTitle">Actualizar plan</h2>
                            <p id="upgradeDesc">Desbloqueá esta funcionalidad premium y acelerá tus cierres.</p>
                            <div id="upgradeBenefits" style={{marginBottom: '12px'}}></div>
                            <div className="actions">
                                <button className="btn btn-primary" onClick={UpgradeUI.goCheckout}>Ir a checkout</button>
                                <button className="btn btn-secondary" onClick={UpgradeUI.close}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {toast.show && <div id="toast" className="toast" style={{display: 'block'}}>{toast.message}</div>}
            </div>
        </>
    );
};

export default GrowthPage;
