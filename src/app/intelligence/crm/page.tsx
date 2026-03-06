'use client';
import { useState, useEffect } from 'react';

// ===========================================================
// 1️⃣ BACKEND FULL STACK SIMULADO (Node.js + Postgres + Auth)
// ===========================================================

const Backend = {
  db: {
    users: [] as any[],
    tenants: [] as any[],
    listings: [] as any[],
    transactions: [] as any[],
    projects: [] as any[],
    alerts: [] as any[],
    investors: [] as any[],
    apiKeys: [] as any[],
    macroData: [] as any[]
  },

  auth: {
    login(email: string,password: string){
      return Backend.db.users.find(u=>u.email===email) || null;
    },
    register(user: any){
      Backend.db.users.push(user);
      return user;
    },
    issueToken(user: any){
      return btoa(JSON.stringify({id:user.id,tenant:user.tenant,role:user.role,plan:user.plan}));
    },
    verify(token: string){
      try { return JSON.parse(atob(token)); } catch { return null; }
    }
  },

  api: {
    getMarketRadar(){
      return MarketEngine.getRadarSnapshot();
    },
    getMacroSimulation(){
      return MacroSimulator.runSimulation();
    },
    getPricingSignals(){
      return PricingEngine.getSignals();
    },
    getProjects(){
      return Backend.db.projects;
    },
    getInvestors(){
      return Backend.db.investors;
    },
    createAlert(alert: any){
      Backend.db.alerts.push(alert);
      return alert;
    }
  }
};

// ===========================================================
// 2️⃣ MULTI-TENANT SaaS PRODUCTIVO
// ===========================================================

const Tenants = [
  { id:"t1", name:"Inmobiliaria Alpha", tier:"full" },
  { id:"t2", name:"Developer Group X", tier:"enterprise" },
  { id:"t3", name:"Usuario Individual", tier:"basic" },
  { id:"t4", name:"CRUSHOME CORP", tier:"enterprise" }
];

const Users = [
  { id:1, name:"Juan Pérez", email:"juan@test.com", role:"particular", plan:"basic", tenant:"t3" },
  { id:2, name:"María López", email:"maria@test.com", role:"agent", plan:"fullLight", tenant:"t1" },
  { id:3, name:"Carlos Gómez", email:"carlos@test.com", role:"developer", plan:"full", tenant:"t2" },
  { id:4, name:"CRUSHOME Admin", email:"admin@crushome.ai", role:"admin", plan:"enterprise", tenant:"t4" }
];

Backend.db.users = Users;
Backend.db.tenants = Tenants;

// ===========================================================
// 3️⃣ PLANES COMERCIALES CMR
// ===========================================================

const PLANS: Record<string, any> = {
  basic: {
    id:"basic",
    label:"CMR Básico",
    narrative:"Inteligencia personal básica para decisiones individuales.",
    permissions:{
      dashboard:true, market:false, scenarios:false, recommendations:false, radar:false, pricing:false, macro:false, developers:false, investors:false, api:false, alerts:false, crushia:false, exports:true
    }
  },
  fullLight: {
    id:"fullLight",
    label:"CMR Full Light",
    narrative:"Inteligencia local de mercado con escenarios y pricing orientativo.",
    permissions:{
      dashboard:true, market:true, scenarios:true, recommendations:true, radar:false, pricing:true, macro:false, developers:false, investors:false, api:false, alerts:true, crushia:true, exports:true
    }
  },
  full: {
    id:"full",
    label:"CMR Full",
    narrative:"Control completo de micro-mercado, comparables, ROI y predicción.",
    permissions:{
      dashboard:true, market:true, scenarios:true, recommendations:true, radar:false, pricing:true, macro:true, developers:true, investors:false, api:false, alerts:true, crushia:true, exports:true
    }
  },
  enterprise: {
    id:"enterprise",
    label:"Radar de Mercado Enterprise",
    narrative:"Sistema estratégico institucional de mercado total.",
    permissions:{
      dashboard:true, market:true, scenarios:true, recommendations:true, radar:true, pricing:true, macro:true, developers:true, investors:true, api:true, alerts:true, crushia:true, exports:true
    }
  }
};

// ===========================================================
// 4️⃣ ROLES
// ===========================================================

const ROLES: Record<string, any> = {
  particular:{ label:"Usuario Particular", scope:"personal" },
  agent:{ label:"Agente / Inmobiliaria", scope:"portfolio" },
  developer:{ label:"Desarrollista", scope:"project" },
  admin:{ label:"Administrador / Institucional", scope:"market" }
};


// ===========================================================
//   ENGINE SIMULATIONS
// ===========================================================

const MLModel = {
  weights:{ demand:0.32, supply:-0.25, liquidity:0.21, macro:0.14, sentiment:0.08 },
  train(dataset: any[]){
    dataset.forEach(d=>{
      this.weights.demand += (Math.random()-0.5)*0.01;
      this.weights.supply += (Math.random()-0.5)*0.01;
      this.weights.liquidity += (Math.random()-0.5)*0.01;
      this.weights.macro += (Math.random()-0.5)*0.01;
      this.weights.sentiment += (Math.random()-0.5)*0.01;
    });
  },
  predict(input: any){
    const base =
      input.demand*this.weights.demand +
      input.supply*this.weights.supply +
      input.liquidity*this.weights.liquidity +
      input.macro*this.weights.macro +
      input.sentiment*this.weights.sentiment;
    return base + (Math.random()-0.5)*0.05;
  },
  simulateScenarios(input: any,iterations=500){
    const results=[];
    for(let i=0;i<iterations;i++){
      results.push(this.predict({
        demand:input.demand*(1+(Math.random()-0.5)*0.2),
        supply:input.supply*(1+(Math.random()-0.5)*0.2),
        liquidity:input.liquidity*(1+(Math.random()-0.5)*0.2),
        macro:input.macro*(1+(Math.random()-0.5)*0.2),
        sentiment:input.sentiment*(1+(Math.random()-0.5)*0.2)
      }));
    }
    return results;
  }
};

const PricingEngine = {
  getSignals(){
    return {
      institutionalPremium:+3.8, retailDiscount:-2.1, zoneArbitrage:+5.4, riskAdjustedYield:7.2
    };
  },
  computePrice(base: number,market: any){
    const signals=this.getSignals();
    return base*(1+(signals.zoneArbitrage/100)-(signals.retailDiscount/100));
  }
};

const MacroSimulator = {
  base:{ inflation:180, interest:110, usd:1300, constructionCost:100, creditAvailability:0.25 },
  runSimulation(){
    const s=[];
    for(let i=0;i<5;i++){
      s.push({
        inflation:this.base.inflation*(1+(Math.random()-0.5)*0.25),
        interest:this.base.interest*(1+(Math.random()-0.5)*0.25),
        usd:this.base.usd*(1+(Math.random()-0.5)*0.25),
        credit:this.base.creditAvailability*(1+(Math.random()-0.5)*0.4),
        impact:Math.random()>0.6?"expansivo":Math.random()>0.3?"neutro":"contractivo"
      });
    }
    return s;
  }
};

const MarketEngine = {
  snapshot:{
    liquidity:72, absorption:3.4, momentum:"alcista moderada", demandPressure:"alta",
    riskClusters:["Microcentro","Constitución"], growthClusters:["Villa Urquiza","Chacarita"]
  },
  getRadarSnapshot(){
    return this.snapshot;
  }
};

const VIEWS = [
    { id:"dashboard", label:"Dashboard", feature:"dashboard" },
    { id:"market", label:"Pulso de Mercado", feature:"market" },
    { id:"scenarios", label:"Escenarios", feature:"scenarios" },
    { id:"recommendations", label:"Recomendaciones", feature:"recommendations" },
    { id:"crushia", label:"Crushia Central", feature:"crushia" },
    { id:"pricing", label:"Pricing Institucional", feature:"pricing" },
    { id:"macro", label:"Simulador Macro", feature:"macro" },
    { id:"developers", label:"Marketplace Developers", feature:"developers" },
    { id:"investors", label:"Data Room Inversores", feature:"investors" },
    { id:"alerts", label:"Alertas", feature:"alerts" },
    { id:"radar", label:"Radar de Mercado", feature:"radar", badge:"enterprise" },
    { id:"api", label:"API Pública", feature:"api" },
    { id:"exports", label:"Exportación", feature:"exports" }
];


export default function CrmPage() {
    const [currentUser, setCurrentUser] = useState(Users[3]);
    const [currentView, setCurrentView] = useState('dashboard');
    const [mode, setMode] = useState('human');

    const hasPermission = (feature: string) => PLANS[currentUser.plan].permissions[feature];
    const upgrade = () => alert("Flujo SaaS real: Stripe / Billing / Upgrade");

    const Gate = ({ feature, children }: { feature: string; children: React.ReactNode }) => {
        if (hasPermission(feature)) {
            return <>{children}</>;
        }
        return (
            <div className="card" style={{ position: 'relative', minHeight: '400px' }}>
                <div className="locked-overlay">
                    <strong>Disponible en plan superior</strong>
                    <span>Función incluida en <b>{PLANS.enterprise.label}</b></span>
                    <button onClick={upgrade}>Actualizar Plan</button>
                </div>
            </div>
        );
    };

    const NarrativeHeader = () => (
        <div className="card">
            <h3>{PLANS[currentUser.plan].label} — {ROLES[currentUser.role].label}</h3>
            <p>{PLANS[currentUser.plan].narrative}</p>
            <div className="divider"></div>
            <p>{ROLES[currentUser.role].scope}</p>
        </div>
    );

    const DashboardView = () => (
        <div className="space-y-4">
            <NarrativeHeader />
            <div className="grid">
                <div className="card">
                    <h3>Liquidez del Mercado</h3>
                    <p>{mode === "human" ? "Velocidad promedio con la que los inmuebles se convierten en operaciones reales." : "Índice sintético compuesto por absorción, rotación y presión de demanda."}</p>
                    <div className="metric good">{MarketEngine.snapshot.liquidity}%</div>
                </div>
                <div className="card">
                    <h3>Ritmo de Absorción</h3>
                    <p>{mode === "human" ? "Tiempo promedio en que se vende el stock activo." : "Meses de inventario al ritmo actual de cierre."}</p>
                    <div className="metric warn">{MarketEngine.snapshot.absorption} meses</div>
                </div>
                <div className="card">
                    <h3>Momentum de Precios</h3>
                    <p>{mode === "human" ? "Tendencia general de valores de cierre." : "Derivada temporal positiva del vector de precios transaccionales."}</p>
                    <div className="metric good">{MarketEngine.snapshot.momentum}</div>
                </div>
                <div className="card">
                    <h3>Presión de Demanda</h3>
                    <p>{mode === "human" ? "Nivel de competencia entre compradores." : "Ratio demanda efectiva / oferta disponible."}</p>
                    <div className="metric good">{MarketEngine.snapshot.demandPressure}</div>
                </div>
            </div>
        </div>
    );

    const MarketView = () => (
        <div className="space-y-4">
            <NarrativeHeader />
            {/* Market View Content */}
        </div>
    );
    
    const ScenariosView = () => {
        const SCENARIOS = [
          { id:"optimista", label:"Escenario de Expansión", class:"good", narrative:"Si se mantiene el ritmo actual de demanda y absorción, el mercado tenderá a una compresión de inventario...", probability:0.48, impact:"Alta rotación, mejores márgenes..." },
          { id:"neutro", label:"Escenario de Estabilización", class:"warn", narrative:"La oferta se equilibra con la demanda, generando un mercado más selectivo...", probability:0.34, impact:"Necesidad de ajuste estratégico..." },
          { id:"adverso", label:"Escenario de Contracción", class:"bad", narrative:"Una desaceleración macroeconómica podría generar acumulación de inventario...", probability:0.18, impact:"Priorizar liquidez, rotación y estrategias defensivas." }
        ];
        return (
            <div className="grid">
                {SCENARIOS.map(s => (
                    <div key={s.id} className={`scenario ${s.class}`}>
                        <h4>{s.label}</h4>
                        <span>{s.narrative}</span>
                        <span><b>Impacto:</b> {s.impact}</span>
                        {mode === "analyst" ? <span><b>Probabilidad:</b> {(s.probability * 100).toFixed(1)}%</span> : <span><b>Probabilidad relativa:</b> {s.id === 'optimista' ? 'Alta' : s.id === 'neutro' ? 'Media' : 'Baja'}</span>}
                    </div>
                ))}
            </div>
        );
    };

    const RecommendationsView = () => {
        const getRecommendations = () => {
             const base: Record<string, string[]> = {
                particular: ["Acelerar decisión en propiedades con alta absorción.", "Negociar descuentos en zonas con sobreoferta."],
                agent: ["Reasignar esfuerzo comercial a tipologías con alta rotación.", "Ajustar pricing de listings con baja absorción."],
                developer: ["Reformular mix de unidades.", "Optimizar timing de lanzamiento."],
                admin: ["Detectar clusters de sobreoferta.", "Redirigir inversión a submercados emergentes."]
            };
            let recs = base[currentUser.role] || [];
            if (currentUser.plan === "enterprise") {
                recs.push("Ejecutar simulación de estrés multi-zona.");
            }
            return recs;
        };
        return (
            <div className="card">
                <h3>Recomendaciones Accionables</h3>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                    {getRecommendations().map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
            </div>
        );
    };
    
    const CrushiaView = () => {
        const [messages, setMessages] = useState([{ from: 'crushia', text: 'Crushia Central conectada. ¿Qué necesitás analizar?' }]);
        const [input, setInput] = useState('');

        const handleSend = () => {
            if (!input.trim()) return;
            const newMessages: any[] = [...messages, { from: 'user', text: input }];
            newMessages.push({ from: 'crushia', text: 'Analizando... dame un segundo.' });
            setMessages(newMessages);
            setInput('');
            setTimeout(() => {
                setMessages(prev => [...prev, { from: 'crushia', text: 'Basado en tu consulta, te recomiendo revisar el radar de riesgo de liquidez en Microcentro.' }]);
            }, 1500);
        };
        
        return (
             <div className="card">
                <h3>Crushia Central</h3>
                <div className="chat-box">
                    {messages.map((msg, i) => (
                        <div key={i} className={`chat-msg ${msg.from}`}>{msg.text}</div>
                    ))}
                </div>
                <div className="chat-input">
                    <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ej: Analizá riesgo de sobreoferta en Palermo" />
                    <button onClick={handleSend}>Enviar</button>
                </div>
            </div>
        );
    };

    const renderView = () => {
        const viewMap: Record<string, React.FC> = {
            dashboard: DashboardView,
            market: MarketView,
            scenarios: ScenariosView,
            recommendations: RecommendationsView,
            crushia: CrushiaView,
        };
        const Component = viewMap[currentView];
        if (!Component) return <div>Vista no encontrada</div>;

        const feature = VIEWS.find(v => v.id === currentView)?.feature;
        if (!feature) return <Component />;

        return <Gate feature={feature}><Component /></Gate>
    };

    return (
        <>
            <style jsx>{`
                :root {
                  --pink:#FF4FD8; --violet:#C94BFF; --blue:#4F6BFF; --dark:#0E1026; --deep:#3A2F7D; --bg:#070816;
                  --card:#12142b; --glass:rgba(255,255,255,0.06); --text:#f1f1ff; --muted:#9fa6ff; --good:#39FFB6;
                  --warn:#FFC857; --bad:#FF5C77; --radius:18px; --blur:14px; --shadow:0 0 40px rgba(120,80,255,0.35);
                }
                * { box-sizing:border-box; font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,sans-serif; }
                .crm-page-container {
                    margin: -2rem; /* Negate parent padding */
                    background:radial-gradient(circle at 15% 10%, #1b1f55, #050611 70%);
                    color:var(--text); min-height:100vh;
                }
                #app { display:flex; min-height:100vh; }
                .sidebar {
                  width:300px; background:linear-gradient(180deg,#0b0d26,#060713); border-right:1px solid rgba(255,255,255,0.06);
                  padding:20px; display:flex; flex-direction:column; gap:18px;
                }
                .logo {
                  font-weight:900; font-size:22px; letter-spacing:0.6px;
                  background:linear-gradient(90deg,var(--pink),var(--violet),var(--blue));
                  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
                }
                .user-box { background:var(--glass); border-radius:var(--radius); padding:14px; box-shadow:var(--shadow); }
                .user-box strong { display:block; font-size:14px; }
                .user-box span { font-size:12px; color:var(--muted); }
                .plan-badge {
                  display:inline-block; margin-top:6px; padding:3px 9px; border-radius:999px; font-size:10px;
                  background:linear-gradient(90deg,var(--pink),var(--violet),var(--blue)); color:#fff;
                }
                .nav { display:flex; flex-direction:column; gap:6px; }
                .nav button {
                  all:unset; cursor:pointer; padding:11px 14px; border-radius:14px; font-size:13px;
                  display:flex; justify-content:space-between; align-items:center; transition:0.2s;
                  background:transparent; color:var(--text);
                }
                .nav button:hover { background:rgba(255,255,255,0.06); }
                .nav button.active {
                  background:linear-gradient(90deg,rgba(255,79,216,0.25),rgba(79,107,255,0.25));
                  box-shadow:0 0 18px rgba(140,90,255,0.45);
                }
                .badge { font-size:10px; padding:3px 7px; border-radius:999px; background:rgba(255,255,255,0.15); color:#fff; }
                .badge.locked { background:rgba(255,92,119,0.25); color:var(--bad); }
                .badge.enterprise { background:linear-gradient(90deg,var(--pink),var(--violet),var(--blue)); color:#fff; }
                .footer-side { margin-top:auto; font-size:11px; color:var(--muted); opacity:0.7; }
                .main { flex:1; padding:28px; overflow-y:auto; }
                .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
                .header h1 { font-size:22px; margin:0; }
                .mode-switch { display:flex; gap:12px; }
                .toggle { background:var(--glass); border-radius:999px; padding:4px; display:flex; gap:4px; }
                .toggle button {
                  all:unset; cursor:pointer; padding:6px 14px; border-radius:999px; font-size:12px; color:var(--muted);
                }
                .toggle button.active {
                  background:linear-gradient(90deg,var(--pink),var(--violet),var(--blue)); color:#fff;
                  box-shadow:0 0 12px rgba(140,90,255,0.55);
                }
                .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:18px; }
                .card {
                  background:linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02));
                  border-radius:var(--radius); padding:16px 18px; box-shadow:var(--shadow); position:relative; overflow:hidden;
                }
                .card h3 { margin:0 0 6px 0; font-size:14px; letter-spacing:0.2px; }
                .card p { margin:0; font-size:12px; color:var(--muted); line-height:1.55; }
                .metric { font-size:28px; font-weight:900; margin-top:8px; }
                .metric.good { color:var(--good); }
                .metric.warn { color:var(--warn); }
                .metric.bad { color:var(--bad); }
                .small { font-size:11px; opacity:0.75; }
                .divider { height:1px; background:rgba(255,255,255,0.08); margin:12px 0; }
                .scenario {
                  border-radius:14px; padding:14px; background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08); display:flex; flex-direction:column; gap:6px;
                }
                .scenario.good { border-color:rgba(57,255,182,0.35); background:rgba(57,255,182,0.08); }
                .scenario.warn { border-color:rgba(255,200,87,0.35); background:rgba(255,200,87,0.08); }
                .scenario.bad { border-color:rgba(255,92,119,0.35); background:rgba(255,92,119,0.08); }
                .scenario h4 { margin:0; font-size:13px; }
                .scenario span { font-size:11px; color:var(--muted); }
                .locked-overlay {
                  position:absolute; inset:0; background:linear-gradient(180deg,rgba(8,8,20,0.8),rgba(8,8,20,0.96));
                  backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center;
                  flex-direction:column; gap:10px; font-size:12px; text-align:center; padding:20px;
                }
                .locked-overlay strong { font-size:13px; }
                .locked-overlay button {
                  all:unset; cursor:pointer; padding:7px 14px; border-radius:999px; font-size:11px;
                  background:linear-gradient(90deg,var(--pink),var(--violet),var(--blue)); color:#fff;
                  box-shadow:0 0 12px rgba(140,90,255,0.7);
                }
                .table { width:100%; border-collapse:collapse; font-size:12px; }
                .table th, .table td { padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.08); text-align:left; }
                .table th { font-size:11px; text-transform:uppercase; letter-spacing:0.4px; color:var(--muted); }
                .actions { display:flex; gap:10px; flex-wrap:wrap; }
                .actions button {
                  all:unset; cursor:pointer; padding:8px 14px; border-radius:999px; font-size:12px;
                  background:linear-gradient(90deg,var(--pink),var(--violet),var(--blue)); color:#fff;
                  box-shadow:0 0 14px rgba(140,90,255,0.65);
                }
                .actions button.secondary { background:rgba(255,255,255,0.14); box-shadow:none; }
                .alert { border-radius:12px; padding:10px 12px; font-size:12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); }
                .alert.good { border-color:rgba(57,255,182,0.35); background:rgba(57,255,182,0.1); color:var(--good); }
                .alert.warn { border-color:rgba(255,200,87,0.35); background:rgba(255,200,87,0.1); color:var(--warn); }
                .alert.bad { border-color:rgba(255,92,119,0.35); background:rgba(255,92,119,0.1); color:var(--bad); }
                .chat-box { display:flex; flex-direction:column; gap:8px; max-height:300px; overflow-y:auto; font-size:12px; }
                .chat-msg { padding:8px 10px; border-radius:12px; background:rgba(255,255,255,0.08); max-width:85%; }
                .chat-msg.user { align-self:flex-end; background:linear-gradient(90deg,rgba(255,79,216,0.35),rgba(79,107,255,0.35)); }
                .chat-input { display:flex; gap:6px; margin-top:8px; }
                .chat-input input {
                  flex:1; padding:8px 10px; border-radius:10px; border:none; outline:none;
                  background:rgba(255,255,255,0.1); color:#fff; font-size:12px;
                }
                .chat-input button {
                  all:unset; cursor:pointer; padding:8px 12px; border-radius:10px;
                  background:linear-gradient(90deg,var(--pink),var(--violet),var(--blue)); color:#fff; font-size:12px;
                }
                @media(max-width:900px){ .sidebar{display:none;} .main{padding:16px;} }
            `}</style>
            <div className="crm-page-container">
                <div id="app">
                    <div className="sidebar">
                        <div className="logo">CRUSHOME MARKET OS</div>
                        <div className="user-box">
                             <select
                                value={currentUser.id}
                                onChange={(e) => setCurrentUser(Users.find(u => u.id === parseInt(e.target.value))!)}
                                style={{background: 'none', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '100%', marginBottom: '4px', cursor: 'pointer'}}
                             >
                                {Users.map(user => <option key={user.id} value={user.id} style={{background: 'var(--card)'}}>{user.name}</option>)}
                            </select>
                            <span>{ROLES[currentUser.role].label}</span>
                             <div className="plan-badge" style={{background: PLANS[currentUser.plan].color}}>
                                {PLANS[currentUser.plan].label}
                            </div>
                        </div>
                        <div className="nav">
                            {VIEWS.map(view => (
                                <button key={view.id} onClick={() => setCurrentView(view.id)} className={currentView === view.id ? 'active' : ''}>
                                    <span>{view.label}</span>
                                    {view.badge ? (
                                        <span className={`badge ${view.badge}`}>{view.badge}</span>
                                    ) : !hasPermission(view.feature) ? (
                                        <span className="badge locked">Locked</span>
                                    ) : null}
                                </button>
                            ))}
                        </div>
                        <div className="footer-side">
                            Enterprise Full Stack · Multi-tenant · Crushome
                        </div>
                    </div>
                    <div className="main">
                        <div className="header">
                            <h1>{VIEWS.find(v => v.id === currentView)?.label}</h1>
                            <div className="mode-switch">
                                <div className="toggle">
                                    <button onClick={() => setMode('human')} className={mode === 'human' ? 'active' : ''}>Modo Humano</button>
                                    <button onClick={() => setMode('analyst')} className={mode === 'analyst' ? 'active' : ''}>Modo Analista</button>
                                </div>
                            </div>
                        </div>
                        <div id="viewContainer">
                            {renderView()}
                        </div>
                        <div className="small" style={{ marginTop: '28px', color: 'var(--muted)', opacity: 0.7 }}>
                            Este sistema no muestra datos. Muestra contexto, intención, riesgo, oportunidad y estrategia.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
