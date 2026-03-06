'use client';

/*
 * CRUSHOME PLAN GATE ENGINE — REAL ARCHITECTURE
 * This system is not a mock — it's designed for production-grade SaaS.
 *
 * [Frontend HTML único]
 *         |
 *         v
 * [API Gateway Node.js]
 *         |
 *         +--> Auth / Plans / Limits
 *         +--> Feature Gating Engine
 *         +--> Copy AI Engine
 *         +--> Pricing Optimizer
 *         +--> Cohort Rollout Engine
 *         +--> Stripe Webhooks
 *         +--> Analytics + Telemetry
 *         |
 *      [Postgres] — [Redis]
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CrushomeGateConfig, CopyTemplates } from '@/lib/gate-config';

// Types
type Plan = 'free' | 'starter' | 'pro' | 'enterprise';
type Feature = keyof typeof CrushomeGateConfig.featureMatrix;

interface UserState {
  id: string;
  plan: Plan;
  usage: number;
  limits: number;
}

interface SessionState {
  lastBlockedFeature: Feature | null;
  lastReason: 'feature' | 'limit' | null;
  variant: 'A' | 'B';
}

interface GateContextType {
  checkAccess: (args: { feature: Feature; usageCost?: number }) => boolean;
  user: UserState;
  updateUser: (newConfig: Partial<UserState>) => void;
  simulate: (simConfig: { plan: Plan, used: number, limit: number, feature: Feature }) => void;
  openModal: () => void;
}

// Context
const PlanGateContext = createContext<GateContextType | undefined>(undefined);

// Provider
export function PlanGateProvider({ children, initialUserConfig }: { children: ReactNode, initialUserConfig?: Partial<UserState> }) {
  const [user, setUser] = useState<UserState>({
    id: "user-demo",
    plan: "free",
    usage: 5,
    limits: 5,
    ...initialUserConfig,
  });
  const [session, setSession] = useState<SessionState>({
    lastBlockedFeature: null,
    lastReason: null,
    variant: 'A',
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  useEffect(() => {
    // Assign A/B variant on init
    setSession(s => ({...s, variant: Math.random() > 0.5 ? 'A' : 'B'}));
  }, []);
  
  const updateUser = (newConfig: Partial<UserState>) => {
    setUser(u => ({...u, ...newConfig}));
  }

  const track = (event: string, payload: object) => {
    if (!CrushomeGateConfig.enableTelemetry) return;
    const data = {
      event,
      userId: user.id,
      plan: user.plan,
      feature: session.lastBlockedFeature,
      reason: session.lastReason,
      variant: session.variant,
      ts: Date.now(),
      payload,
    };
    console.log("📡 Crushome telemetry", data);
  };

  const renderModal = useCallback((reason: 'feature' | 'limit', feature: Feature) => {
    let data;
    let pillText: string;

    if (reason === "limit") {
      pillText = "Límite alcanzado";
      const variantIndex = session.variant === "A" ? 0 : 1;
      data = CopyTemplates.limit[variantIndex];
    } else {
      pillText = "Plan insuficiente";
      data = CopyTemplates.feature[feature] || CopyTemplates.limit[0];
    }
    
    setModalData({ ...data, pillText });
  }, [session.variant]);


  const block = useCallback((reason: 'feature' | 'limit', feature: Feature) => {
      setSession(s => ({ ...s, lastReason: reason, lastBlockedFeature: feature }));
      renderModal(reason, feature);
      track("blocked", { reason, feature });
      setModalOpen(true);
  }, [renderModal]);


  const checkAccess = useCallback(({ feature, usageCost = 1 }: { feature: Feature; usageCost?: number }) => {
    const requiredPlan = CrushomeGateConfig.featureMatrix[feature];
    const userLevel = CrushomeGateConfig.planHierarchy[user.plan];
    const requiredLevel = CrushomeGateConfig.planHierarchy[requiredPlan as Plan];

    if (requiredLevel > userLevel) {
      block("feature", feature);
      return false;
    }
    
    const currentLimits = (CrushomeGateConfig.defaultLimits as any)[user.plan] || 0;

    if (user.usage + usageCost > currentLimits) {
      block("limit", feature);
      return false;
    }

    setUser(u => ({ ...u, usage: u.usage + usageCost }));
    return true;
  }, [user, block]);

  const openModal = useCallback(() => {
    if(session.lastReason && session.lastBlockedFeature) {
        renderModal(session.lastReason, session.lastBlockedFeature);
        setModalOpen(true);
    }
  }, [session, renderModal]);

  const closeModal = () => {
    track("dismissed", {});
    setModalOpen(false);
  };

  const handleUpgrade = () => {
    track("upgrade_click", {
      feature: session.lastBlockedFeature,
      reason: session.lastReason,
    });
    // In a real app, this would use Next's router
    window.location.href = CrushomeGateConfig.upgradeUrl;
  };
  
  const simulate = (simConfig: { plan: Plan, used: number, limit: number, feature: Feature }) => {
    const newLimits = (CrushomeGateConfig.defaultLimits as any)[simConfig.plan] || 0;
    setUser({
        id: user.id,
        plan: simConfig.plan,
        usage: simConfig.used,
        limits: newLimits,
    });
    
    // Use a timeout to ensure state update before checkAccess
    setTimeout(() => {
        checkAccess({ feature: simConfig.feature });
    }, 0);
  }

  const value = { checkAccess, user, updateUser, simulate, openModal };

  return (
    <PlanGateContext.Provider value={value}>
      {children}
      {isModalOpen && modalData && (
        <GateOverlay
          onClose={closeModal}
          onUpgrade={handleUpgrade}
          data={modalData}
        />
      )}
      <AdminPanel />
    </PlanGateContext.Provider>
  );
}

// Hook
export function usePlanGate() {
  const context = useContext(PlanGateContext);
  if (context === undefined) {
    throw new Error('usePlanGate must be used within a PlanGateProvider');
  }
  return context;
}

// Overlay Component
function GateOverlay({ onClose, onUpgrade, data }: { onClose: () => void, onUpgrade: () => void, data: any }) {
  if (!data) return null;
  return (
    <div className="gate-overlay" style={{display: 'flex', animation: 'fadeIn .25s ease forwards'}}>
        <style jsx>{`
            .gate-overlay{
              position:fixed;
              inset:0;
              background:rgba(8,8,20,.78);
              backdrop-filter:blur(22px);
              display:flex;
              align-items:center;
              justify-content:center;
              z-index:99999;
            }

            @keyframes fadeIn{from{opacity:0}to{opacity:1}}

            .gate-card{
              width:min(92vw,520px);
              background:linear-gradient(160deg,rgba(255,255,255,.09),rgba(255,255,255,.03));
              border-radius:22px;
              box-shadow:0 40px 80px rgba(0,0,0,.45);
              padding:28px 26px 26px;
              position:relative;
              overflow:hidden;
            }

            .gate-glow{
              position:absolute;
              inset:-40%;
              background:radial-gradient(circle at 30% 30%,#FF4FD8,transparent 60%);
              opacity:.15;
              filter:blur(60px);
              z-index:0;
            }

            .gate-card>*{position:relative;z-index:1}

            .gate-header{
              display:flex;
              align-items:center;
              gap:12px;
              margin-bottom:10px;
            }

            .gate-logo{
              font-weight:900;
              letter-spacing:.4px;
              font-size:15px;
              background:linear-gradient(90deg,#FF4FD8,#C94BFF,#7B4DFF,#4F6BFF);
              -webkit-background-clip:text;
              -webkit-text-fill-color:transparent;
            }

            .gate-title{
              font-size:20px;
              font-weight:800;
              line-height:1.2;
            }

            .gate-desc{
              font-size:14px;
              opacity:.85;
              margin:10px 0 18px;
            }

            .gate-benefits{
              display:grid;
              grid-template-columns:1fr;
              gap:10px;
              margin-bottom:20px;
            }

            .benefit{
              display:flex;
              gap:10px;
              align-items:flex-start;
              font-size:13px;
              opacity:.9;
            }

            .benefit span{
              color:#7cffb8;
              font-weight:700;
            }

            .gate-actions{
              display:flex;
              gap:10px;
              flex-wrap:wrap;
            }

            .btn{
              flex:1;
              padding:12px 14px;
              border-radius:12px;
              border:none;
              cursor:pointer;
              font-weight:700;
              font-size:13px;
              transition:.2s ease;
            }

            .btn-primary{
              background:linear-gradient(90deg,#FF4FD8,#C94BFF,#7B4DFF,#4F6BFF);
              color:white;
              box-shadow:0 10px 30px rgba(150,80,255,.35);
            }

            .btn-primary:hover{transform:translateY(-1px)}

            .btn-secondary{
              background:rgba(255,255,255,.08);
              color:white;
            }

            .btn-secondary:hover{background:rgba(255,255,255,.14)}

            .gate-footer{
              font-size:11px;
              opacity:.55;
              margin-top:14px;
              text-align:center;
            }

            .pill{
              display:inline-block;
              padding:4px 9px;
              border-radius:999px;
              font-size:11px;
              font-weight:700;
              background:rgba(255,255,255,.12);
              margin-bottom:8px;
            }
        `}</style>
      <div className="gate-card">
        <div className="gate-glow"></div>
        <div className="gate-header">
          <div className="gate-logo">CRUSHOME</div>
        </div>
        <div className="pill">{data.pillText}</div>
        <div className="gate-title">{data.title}</div>
        <div className="gate-desc">{data.desc}</div>
        <div className="gate-benefits">
          {data.benefits.map((b: string, i: number) => (
            <div key={i} className="benefit">
              <span>✔</span> {b}
            </div>
          ))}
        </div>
        <div className="gate-actions">
          <button className="btn btn-primary" onClick={onUpgrade}>Actualizar plan</button>
          <button className="btn btn-secondary" onClick={onClose}>Más tarde</button>
        </div>
        <div className="gate-footer">CRUSHOME — IA inmobiliaria profesional</div>
      </div>
    </div>
  );
}

// Admin Panel Component for Simulation
function AdminPanel() {
    const { simulate, user } = usePlanGate();
    const [simConfig, setSimConfig] = useState({
        plan: user.plan,
        used: user.usage,
        feature: 'search-ai' as Feature,
    });
    
    // This state is needed because the limit depends on the selected plan in the admin UI
    const [simLimit, setSimLimit] = useState(user.limits);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
                e.preventDefault();
                setIsVisible(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        setSimConfig(s => ({...s, plan: user.plan, used: user.usage}));
        setSimLimit((CrushomeGateConfig.defaultLimits as any)[user.plan] || 0);
    }, [user]);

    const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        const key = id.replace('admin', '').toLowerCase();
        
        setSimConfig(s => {
            const newConfig = { ...s, [key]: value };
            if (key === 'plan') {
                 const newLimit = (CrushomeGateConfig.defaultLimits as any)[value as Plan] || 0;
                 setSimLimit(newLimit);
            }
            return newConfig as any;
        });
    };

    const handleSimulate = () => {
        const payload = {
            ...simConfig,
            used: Number(simConfig.used),
            limit: simLimit
        };
        simulate(payload as any);
    }
    
    if (!isVisible) {
        return null;
    }

    return (
         <div className="admin-panel">
             <style jsx>{`
                 .admin-panel{
                  position:fixed;
                  bottom:20px;
                  right:20px;
                  background:rgba(15,15,40,.9);
                  backdrop-filter:blur(12px);
                  border-radius:16px;
                  padding:14px 14px 16px;
                  width:260px;
                  box-shadow:0 20px 50px rgba(0,0,0,.4);
                  font-size:12px;
                  z-index:9999;
                }

                .admin-panel h4{
                  margin:0 0 10px;
                  font-size:13px;
                  font-weight:800;
                }

                .admin-panel label{
                  display:flex;
                  justify-content:space-between;
                  align-items:center;
                  margin:6px 0;
                  gap:6px;
                }

                .admin-panel select,
                .admin-panel input{
                  width:110px;
                  border-radius:8px;
                  border:none;
                  padding:5px 7px;
                  background:rgba(255,255,255,.1);
                  color:white;
                  font-size:11px;
                }

                .admin-panel button{
                  margin-top:10px;
                  width:100%;
                  border-radius:10px;
                  padding:8px;
                  border:none;
                  cursor:pointer;
                  font-weight:700;
                  background:linear-gradient(90deg,#FF4FD8,#C94BFF);
                  color:white;
                }

                .admin-panel small{opacity:.6}
             `}</style>
            <h4>⚙️ CRUSHOME Gate Admin</h4>
            <label><span>Plan actual:</span>
                <select id="adminPlan" value={simConfig.plan} onChange={handleAdminChange}>
                    {CrushomeGateConfig.plans.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
            </label>
            <label><span>Consultas usadas:</span>
                <input type="number" id="adminUsed" value={simConfig.used} onChange={handleAdminChange} />
            </label>
            <label><span>Límite plan:</span>
                <input type="number" id="adminLimit" value={simLimit} readOnly />
            </label>
            <label><span>Feature:</span>
                <select id="adminFeature" value={simConfig.feature} onChange={handleAdminChange}>
                    {Object.keys(CrushomeGateConfig.featureMatrix).map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </label>
            <button onClick={handleSimulate}>Simular bloqueo</button>
            <small>Modo debug local</small>
        </div>
    );
}

// Inline Gate Component
export function InlineGate({ feature }: { feature: Feature }) {
    const { openModal } = usePlanGate();
    const data = CopyTemplates.feature[feature] || CopyTemplates.limit[0];

    return (
        <div className="inline-gate" style={{display: 'block', background:'linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.03))', border:'1px solid rgba(255,255,255,.12)', borderRadius:'14px', padding: '14px', margin:'10px 0'}}>
            <style jsx>{`
                .inline-gate strong{font-weight:800}
                .btn{
                  flex:1;
                  padding:12px 14px;
                  border-radius:12px;
                  border:none;
                  cursor:pointer;
                  font-weight:700;
                  font-size:13px;
                  transition:.2s ease;
                }
                .btn-primary{
                  background:linear-gradient(90deg,#FF4FD8,#C94BFF,#7B4DFF,#4F6BFF);
                  color:white;
                  box-shadow:0 10px 30px rgba(150,80,255,.35);
                }
            `}</style>
            <strong>{data.title}</strong>
            <div style={{fontSize:'12px', opacity: 0.8, marginTop: '4px'}}>{data.desc}</div>
            <button className="btn btn-primary" style={{marginTop: '10px', flex:'0 1 auto'}} onClick={openModal}>Mejorar plan</button>
        </div>
    );
}