'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

// =======================================================
// NUEVA ARQUITECTURA CRUSHOME MAP INTELLIGENCE
// =======================================================
/*
CRUSHOME MAP SYSTEM
├── UX Layer
│   ├── Onboarding Cognitivo
│   ├── Modo Explorador / Inversor / Profesional
│   ├── Explicabilidad IA
│   ├── CTA dinámicos
│
├── AI Core
│   ├── Heat Intelligence Engine
│   ├── Investor Matching Engine
│   ├── Causal Opportunity Engine
│   ├── Market Simulator
│   ├── Shadow Policy Engine
│   ├── Time-Decayed Memory
│   ├── Identity Graph
│
├── Market Intelligence
│   ├── Heatmaps multidimensionales
│   ├── Forecast multi-horizonte
│   ├── Liquidez dinámica
│   ├── Saturación estructural
│   ├── Momentum por barrio
│
├── Monetization Engine
│   ├── Feature gating
│   ├── Preview locked
│   ├── Value surface por plan
│
├── UI System
│   ├── Premium CRUSHOME
│   ├── Adaptive panels
│   ├── Cognitive overlays
│   ├── Pin inteligente
│
└── Core Infrastructure
    ├── Sin backend
    ├── Plug & Play
    ├── Data simulada coherente
    ├── Arquitectura enterprise-ready
*/

declare global {
  interface Window {
    mapboxgl: any;
  }
}

// Moved outside component to prevent re-declaration on every render
const PLANS: Record<string, any> = {
  FREE: { name: 'Free', layers: ['heatmapDemand'] },
  BASIC: { name: 'Basic', layers: ['heatmapDemand', 'heatmapLiquidity'] },
  PRO: { name: 'Pro', layers: ['heatmapDemand', 'heatmapLiquidity', 'hotZones', 'opportunityScore'] },
  BUSINESS: { name: 'Business', layers: ['heatmapDemand', 'heatmapLiquidity', 'hotZones', 'opportunityScore', 'investorMatching', 'futureForecast', 'saturation'] },
  ENTERPRISE: { name: 'Enterprise', layers: ['heatmapDemand', 'heatmapLiquidity', 'hotZones', 'opportunityScore', 'investorMatching', 'futureForecast', 'saturation', 'marketSimulation', 'causalExplain', 'valuePreview'] }
};

const MOCK_DATA = {
  'Palermo': {
    insights: `Zona de alta demanda y liquidez. Momentum alcista moderado. Oportunidades en refacción y unidades chicas.`,
    investorMatch: `Perfil "Valor Agregado": Fix & Flip. TIR esperada: 18-24%.`,
    forecast: `Tendencia de precios: +4.5% (6m). Riesgo: Saturación de oferta monoambientes.`,
    simulation: `Shock de tasas (+50bps): Caída de precios -3.2%. Aumento de liquidez por búsqueda de refugio de valor.`,
    cta: `Explorar oportunidades de refacción en PHs sobre Av. Scalabrini Ortiz.`
  },
  'Caballito': {
    insights: `Mercado estable con demanda constante de familias. Buena liquidez en unidades de 3 ambientes.`,
    investorMatch: `Perfil "Renta Estable": Alquiler tradicional a largo plazo. Renta anual estimada: 3.5%.`,
    forecast: `Tendencia de precios: +1.2% (6m). Riesgo: Competencia de nuevos desarrollos en la zona.`,
    simulation: `Aumento del crédito hipotecario: +8% en velocidad de venta de unidades usadas.`,
    cta: `Analizar inventario de 3 ambientes cerca de Parque Rivadavia.`
  }
};


export default function CrushomeMapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [currentPlan, setCurrentPlan] = useState('ENTERPRISE');
  const [currentMode, setCurrentMode] = useState('M5');
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    heatmapDemand: true,
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '' });
  const [isOnboardingOpen, setOnboardingOpen] = useState(true);

  const hasPermission = useCallback((layerId: string) => {
    return PLANS[currentPlan]?.layers.includes(layerId);
  }, [currentPlan]);

  const toggleLayer = (layerId: string) => {
    if (!hasPermission(layerId)) {
      alert(`La capa "${layerId}" requiere un plan superior.`);
      return;
    }
    setActiveLayers(prev => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  const updateRightPanel = useCallback((zone: keyof typeof MOCK_DATA) => {
    const data = MOCK_DATA[zone];
    if (!data) return;
    const rightPanel = document.getElementById('right-panel');
    if (!rightPanel) return;

    const insightsEl = rightPanel.querySelector<HTMLDivElement>('#zone-insights');
    if (insightsEl) insightsEl.innerHTML = hasPermission('hotZones') ? data.insights : '<div class="lock-overlay">🔒 Plan PRO requerido</div>';

    const investorEl = rightPanel.querySelector<HTMLDivElement>('#investor-matching');
    if (investorEl) investorEl.innerHTML = hasPermission('investorMatching') ? data.investorMatch : '<div class="lock-overlay">🔒 Plan BUSINESS requerido</div>';
    
    const forecastEl = rightPanel.querySelector<HTMLDivElement>('#forecast-panel');
    if (forecastEl) forecastEl.innerHTML = hasPermission('futureForecast') ? data.forecast : '<div class="lock-overlay">🔒 Plan BUSINESS requerido</div>';
    
    const simEl = rightPanel.querySelector<HTMLDivElement>('#market-simulation');
    if (simEl) simEl.innerHTML = hasPermission('marketSimulation') ? data.simulation : '<div class="lock-overlay">🔒 Plan ENTERPRISE requerido</div>';

    const ctaEl = rightPanel.querySelector<HTMLDivElement>('#cta-panel');
    if (ctaEl) ctaEl.innerHTML = data.cta;
  }, [hasPermission]);


  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    if (mapRef.current) return; // initialize map only once

    const initializeMap = () => {
        window.mapboxgl.accessToken = 'pk.eyJ1IjoiZmVkZWdhbGl6emkiLCJhIjoiY2p2bDM5cDVhMDFxZDRhcGNvZmNyM3F3MyJ9.v3-e0b8pSc22x2g1Iu1j4Q';

        mapRef.current = new window.mapboxgl.Map({
          container: mapContainerRef.current!,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [-58.43, -34.60],
          zoom: 12,
          pitch: 45,
          bearing: -17.6,
        });

        mapRef.current.on('load', () => {
          if(!mapRef.current) return;
          mapRef.current.addSource('heatmap-source', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': [
                { 'type': 'Feature', 'properties': { 'weight': 0.8 }, 'geometry': { 'type': 'Point', 'coordinates': [-58.43, -34.58] } }, // Palermo
                { 'type': 'Feature', 'properties': { 'weight': 0.5 }, 'geometry': { 'type': 'Point', 'coordinates': [-58.45, -34.62] } }, // Caballito
                { 'type': 'Feature', 'properties': { 'weight': 0.3 }, 'geometry': { 'type': 'Point', 'coordinates': [-58.38, -34.60] } }  // Microcentro
              ]
            }
          });
          mapRef.current.addLayer({
            'id': 'demand-heatmap',
            'type': 'heatmap',
            'source': 'heatmap-source',
            'maxzoom': 15,
            'paint': {
              'heatmap-weight': ['get', 'weight'],
              'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(79,107,255,0)',
                0.2, 'rgba(123,77,255,0.4)',
                0.4, 'rgba(201,75,255,0.6)',
                0.6, 'rgba(255,79,216,0.8)',
                0.8, '#ff3c3c'
              ],
              'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
              'heatmap-opacity': 0.7
            }
          }, 'waterway-label');

          const pins = [
            { coords: [-58.435, -34.585], type: 'hot', title: 'Oportunidad Palermo', body: 'Alta demanda, potencial de refacción. Proyección +8% anual.' },
            { coords: [-58.455, -34.615], type: 'good', title: 'Unidad en Caballito', body: 'Mercado estable, ideal para renta familiar. TIR 4%.' },
            { coords: [-58.40, -34.60], type: 'future', title: 'Desarrollo Almagro', body: 'Zona en crecimiento. Proyección de revalorización a 3 años.' },
          ];
          pins.forEach(pin => {
            const el = document.createElement('div');
            el.className = `crushome-marker ${pin.type}`;
            el.innerHTML = '<div class="pin-body"><img src="https://assets.stickpng.com/images/58afdad6829958a978a4a693.png" alt="pin"></div>';
            
            el.addEventListener('click', () => {
              setModalContent({ title: pin.title, body: pin.body });
              setModalOpen(true);
            });

            new window.mapboxgl.Marker(el)
              .setLngLat(pin.coords as [number, number])
              .addTo(mapRef.current);
          });
          
          updateRightPanel('Palermo');
        });

        mapRef.current.on('click', (e: any) => {
            const features = mapRef.current.queryRenderedFeatures(e.point, { layers: ['demand-heatmap'] });
            if(features.length > 0) {
                if(e.lngLat.lng > -58.44) {
                     updateRightPanel('Palermo');
                } else {
                     updateRightPanel('Caballito');
                }
            }
        });
    }

    if(window.mapboxgl) {
        initializeMap();
    } else {
        const interval = setInterval(() => {
            if(window.mapboxgl) {
                clearInterval(interval);
                initializeMap();
            }
        }, 100);
    }


    return () => mapRef.current?.remove();
  }, [updateRightPanel]);

  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;

    Object.entries(activeLayers).forEach(([layerId, isActive]) => {
      const mapLayerId = layerId.startsWith('heatmap') ? 'demand-heatmap' : layerId;
      if (mapRef.current.getLayer(mapLayerId)) {
        mapRef.current.setLayoutProperty(mapLayerId, 'visibility', isActive ? 'visible' : 'none');
      }
    });
  }, [activeLayers]);

  useEffect(() => {
    const leftPanelContainer = document.querySelector('.layer-group');
    if (!leftPanelContainer) return;
    
    leftPanelContainer.innerHTML = '';
    LAYERS_CONFIG.forEach(layer => {
      const hasPerm = hasPermission(layer.id);
      const div = document.createElement('div');
      div.className = `layer-toggle ${activeLayers[layer.id] ? 'active' : ''} ${!hasPerm ? 'locked' : ''}`;
      div.textContent = layer.label;
      div.onclick = () => toggleLayer(layer.id);
      leftPanelContainer.appendChild(div);
    });
  }, [currentPlan, activeLayers, hasPermission, toggleLayer]);

  const LAYERS_CONFIG = [
    { id: 'heatmapDemand', label: '🔥 Heatmap Demanda' },
    { id: 'heatmapLiquidity', label: '💧 Heatmap Liquidez' },
    { id: 'hotZones', label: '🚀 Zonas Calientes' },
    { id: 'opportunityScore', label: '🎯 Oportunidad vs Mercado' },
    { id: 'investorMatching', label: '💼 Matching Inversor' },
    { id: 'futureForecast', label: '🔮 Proyección Futura' },
    { id: 'saturation', label: '📊 Saturación Oferta' },
    { id: 'marketSimulation', label: '🧪 Simulación Mercado' },
    { id: 'causalExplain', label: '🧠 Explicabilidad IA' },
    { id: 'valuePreview', label: '💎 Value Preview' }
  ];

  return (
    <>
      <style jsx global>{`
        /* ============================================================
           🎨 CRUSHOME DESIGN SYSTEM — PALETA OFICIAL LOGO
        ============================================================ */
        :root {
          --crush-pink: #FF4FD8;
          --crush-magenta: #C94BFF;
          --crush-purple: #7B4DFF;
          --crush-blue: #4F6BFF;
          --crush-indigo: #3A2F7D;
          --crush-dark: #0E1026;
          --crush-darker: #07081a;
          --crush-light: #f8f9ff;
          --crush-white: #ffffff;

          --crush-gradient-main: linear-gradient(135deg, #FF4FD8, #C94BFF, #7B4DFF, #4F6BFF);
          --crush-gradient-soft: linear-gradient(135deg, #FF6AE1, #D17CFF, #8C7CFF, #6A8BFF);
          --crush-gradient-dark: linear-gradient(135deg, #1b1f3b, #3A2F7D, #1b4d7a);

          --glass-bg: rgba(14, 16, 38, 0.65);
          --glass-border: rgba(255, 255, 255, 0.15);
          --glass-blur: blur(18px);

          --shadow-soft: 0 10px 30px rgba(0,0,0,0.25);
          --shadow-strong: 0 20px 60px rgba(0,0,0,0.45);
          --shadow-glow: 0 0 20px rgba(255, 79, 216, 0.55);
        }

        * {
          box-sizing: border-box;
          font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        body {
          margin: 0;
          background: radial-gradient(circle at top, #15183a, #07081a);
          color: white;
          overflow: hidden;
        }

        /* ============================================================
           🧭 GLOBAL LAYOUT
        ============================================================ */
        #app {
          display: flex;
          width: 100vw;
          height: 100vh;
        }

        #map {
          flex: 1;
          position: relative;
          height: 100%;
          width: 100%;
        }

        /* ============================================================
           🧭 TOP BAR — SEARCH / PLAN / MODE / USER PROFILE
        ============================================================ */
        #top-bar {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 40;
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 10px 14px;
          border-radius: 18px;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-soft);
        }

        #logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 900;
          letter-spacing: 0.5px;
          background: var(--crush-gradient-main);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 14px;
        }

        #logo .logo-img-placeholder {
          height: 26px;
          width: 26px;
          object-fit: contain;
          filter: drop-shadow(0 0 6px rgba(255,79,216,0.6));
          background: var(--crush-gradient-main);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        #plan-selector,
        #mode-selector,
        #radius-selector {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          color: white;
          border-radius: 10px;
          padding: 6px 8px;
          font-weight: 700;
          outline: none;
          cursor: pointer;
        }

        #search-box {
          min-width: 240px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          border-radius: 12px;
          padding: 8px 12px;
          outline: none;
          font-weight: 500;
        }

        .crush-btn {
          background: var(--crush-gradient-main);
          border: none;
          border-radius: 12px;
          color: white;
          padding: 8px 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: var(--shadow-glow);
          transition: all 0.2s ease;
        }

        .crush-btn:hover {
          transform: translateY(-1px) scale(1.05);
          box-shadow: 0 0 28px rgba(255,79,216,0.75);
        }

        /* ============================================================
           🧠 LEFT PANEL — MAP LAYERS / AI TOGGLES
        ============================================================ */
        #left-panel {
          position: absolute;
          top: 92px;
          left: 16px;
          z-index: 30;
          width: 270px;
          padding: 16px;
          border-radius: 22px;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-soft);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .panel-title {
          font-weight: 900;
          letter-spacing: 0.5px;
          background: var(--crush-gradient-main);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 13px;
          text-transform: uppercase;
        }

        .layer-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .layer-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px;
          padding: 7px 10px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .layer-toggle:hover {
          background: rgba(255,255,255,0.18);
        }

        .layer-toggle.active {
          background: var(--crush-gradient-soft);
          color: white;
          box-shadow: var(--shadow-glow);
        }

        .layer-toggle.locked {
          opacity: 0.35;
          cursor: not-allowed;
          position: relative;
        }
        
        .layer-toggle.locked::after {
          content: '🔒';
          position: absolute;
          right: 10px;
        }

        /* ============================================================
           📍 RIGHT PANEL — AI INTELLIGENCE HUB
        ============================================================ */
        #right-panel {
          position: absolute;
          top: 92px;
          right: 16px;
          z-index: 30;
          width: 320px;
          padding: 16px;
          border-radius: 22px;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-soft);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .card {
          background: rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 12px;
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: var(--shadow-soft);
          position: relative;
        }

        .card-title {
          font-weight: 900;
          font-size: 13px;
          margin-bottom: 6px;
          background: var(--crush-gradient-main);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .insight-item {
          font-size: 12px;
          line-height: 1.45;
          margin-bottom: 6px;
          opacity: 0.95;
        }

        .tag {
          display: inline-block;
          background: rgba(255,255,255,0.15);
          border-radius: 6px;
          padding: 2px 6px;
          font-size: 10px;
          font-weight: 800;
          margin-right: 4px;
        }

        .tag.hot {
          background: linear-gradient(135deg, #ff3c3c, #ff9f00);
          color: white;
          box-shadow: 0 0 10px rgba(255,100,60,0.6);
        }

        .tag.good {
          background: linear-gradient(135deg, #00ffaa, #4F6BFF);
          color: #021a14;
          box-shadow: 0 0 10px rgba(0,255,170,0.5);
        }

        .tag.warn {
          background: linear-gradient(135deg, #ff9f00, #ff3c3c);
          color: white;
          box-shadow: 0 0 10px rgba(255,80,80,0.5);
        }

        .tag.ai {
          background: var(--crush-gradient-main);
          color: white;
        }

        /* ============================================================
           📍 CRUSHOME SMART PIN (GOOGLE-MAPS STYLE PREMIUM)
        ============================================================ */
        .crushome-marker {
          position: relative;
          width: 46px;
          height: 46px;
          transform: translate(-50%, -100%);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .crushome-marker:hover {
          transform: translate(-50%, -100%) scale(1.18);
          z-index: 10;
        }

        .crushome-marker .pin-body {
          width: 100%;
          height: 100%;
          background: var(--crush-gradient-main);
          border-radius: 50%;
          position: relative;
          box-shadow: 0 0 20px rgba(255, 79, 216, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          z-index: 2;
        }

        .crushome-marker .pin-body img {
          width: 68%;
          height: 68%;
          object-fit: contain;
          pointer-events: none;
          filter: drop-shadow(0 0 4px rgba(0,0,0,0.45));
        }

        .crushome-marker::after {
          content: "";
          position: absolute;
          bottom: -14px;
          left: 50%;
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-top: 16px solid #7B4DFF;
          transform: translateX(-50%);
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35));
        }

        .crushome-marker.hot .pin-body {
          background: linear-gradient(135deg, #ff3c3c, #ff9f00);
          box-shadow: 0 0 24px rgba(255, 80, 80, 0.95);
        }

        .crushome-marker.good .pin-body {
          background: linear-gradient(135deg, #00ffaa, #4F6BFF);
          box-shadow: 0 0 22px rgba(0, 255, 170, 0.85);
        }

        .crushome-marker.future .pin-body {
          background: linear-gradient(135deg, #4F6BFF, #00ffaa);
          box-shadow: 0 0 22px rgba(100, 150, 255, 0.9);
        }

        /* ============================================================
           🔥 HEAT LEGEND
        ============================================================ */
        #legend {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 10px 14px;
          display: flex;
          gap: 12px;
          align-items: center;
          box-shadow: var(--shadow-soft);
          font-size: 11px;
          font-weight: 700;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(0,0,0,0.4);
        }

        .legend-hot {
          background: linear-gradient(135deg, #ff3c3c, #ff9f00);
        }

        .legend-warm {
          background: linear-gradient(135deg, #ff9f00, #ffe600);
        }

        .legend-neutral {
          background: linear-gradient(135deg, #4F6BFF, #00ffaa);
        }

        .legend-cold {
          background: linear-gradient(135deg, #7B4DFF, #1b1f3b);
        }

        /* ============================================================
           🪟 MODAL — PROPERTY DETAIL / IA EXPLAINABILITY
        ============================================================ */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(6px);
        }

        .modal-content {
          width: 420px;
          max-width: calc(100vw - 32px);
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          border-radius: 22px;
          padding: 18px;
          box-shadow: var(--shadow-strong);
          color: white;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255,255,255,0.15);
          border: none;
          border-radius: 8px;
          color: white;
          width: 28px;
          height: 28px;
          cursor: pointer;
          font-weight: 900;
        }

        .modal-title {
          font-weight: 900;
          font-size: 16px;
          margin-bottom: 6px;
          background: var(--crush-gradient-main);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .modal-body {
          font-size: 13px;
          line-height: 1.5;
        }
        
        .modal-row {
          margin-bottom: 6px;
        }

        .modal-row span {
          opacity: 0.7;
        }

        /* ============================================================
           🧠 ONBOARDING OVERLAY
        ============================================================ */
        .onboarding-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          backdrop-filter: blur(6px);
        }

        .onboarding-content {
          width: 460px;
          max-width: calc(100vw - 32px);
          background: var(--glass-bg);
          border-radius: 24px;
          border: 1px solid var(--glass-border);
          padding: 20px;
          box-shadow: var(--shadow-strong);
        }

        .onboarding-title {
          font-weight: 900;
          font-size: 18px;
          margin-bottom: 6px;
          background: var(--crush-gradient-main);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .onboarding-body {
          font-size: 13px;
          line-height: 1.55;
          margin-bottom: 12px;
        }

        .onboarding-actions {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        /* ============================================================
           🧠 INVESTOR PROFILE PANEL
        ============================================================ */
        #profile-panel {
          position: absolute;
          bottom: 24px;
          left: 16px;
          z-index: 30;
          width: 280px;
          padding: 14px;
          border-radius: 22px;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-soft);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .profile-title {
          font-weight: 900;
          font-size: 13px;
          background: var(--crush-gradient-main);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .profile-row {
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          gap: 6px;
          align-items: center;
        }

        .profile-row input,
        .profile-row select {
          flex: 1;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          color: white;
          border-radius: 8px;
          padding: 4px 6px;
          outline: none;
          font-size: 11px;
        }

        /* ============================================================
           🔒 LOCKED OVERLAY
        ============================================================ */
        .lock-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
          font-weight: 900;
          font-size: 12px;
          letter-spacing: 0.4px;
          color: white;
          text-align: center;
          padding: 12px;
        }

        /* ============================================================
           📱 MOBILE ADAPTATION
        ============================================================ */
        @media (max-width: 900px) {
          #left-panel, #right-panel, #profile-panel {
            width: calc(100vw - 32px);
            left: 16px;
            right: 16px;
          }
          #top-bar {
            flex-direction: column;
            gap: 6px;
            padding: 8px;
          }
          #left-panel {
            top: 210px;
          }
          #right-panel {
            display: none;
          }
          #profile-panel {
            display: none;
          }
        }
      `}</style>

<div id="app">
  <div id="map" ref={mapContainerRef} style={{height: '100vh', width: '100vw'}}></div>

  <div id="top-bar">
    <div id="logo">
      <div className="logo-img-placeholder">C</div>
      CRUSHOME MAP
    </div>

    <select id="plan-selector" value={currentPlan} onChange={(e) => setCurrentPlan(e.target.value)}>
      <option value="FREE">FREE</option>
      <option value="BASIC">BASIC</option>
      <option value="PRO">PRO</option>
      <option value="BUSINESS">BUSINESS</option>
      <option value="ENTERPRISE">ENTERPRISE</option>
    </select>

    <select id="mode-selector" value={currentMode} onChange={(e) => setCurrentMode(e.target.value)}>
      <option value="M1">M1 Exploratorio</option>
      <option value="M2">M2 Operativo</option>
      <option value="M3">M3 Inteligente</option>
      <option value="M4">M4 Predictivo</option>
      <option value="M5">M5 Estratégico</option>
    </select>

    <input id="search-box" type="text" placeholder="Buscar dirección, barrio o punto de interés" />

    <select id="radius-selector">
      <option value="200">2 cuadras</option>
      <option value="400">4 cuadras</option>
      <option value="600">6 cuadras</option>
      <option value="1000">10 cuadras</option>
    </select>

    <button id="search-btn" className="crush-btn">Buscar</button>
    <button id="onboarding-btn" className="crush-btn" onClick={() => setOnboardingOpen(true)}>Guía</button>
  </div>

  <div id="left-panel">
    <div className="panel-title">Capas Inteligentes</div>
    <div className="layer-group">
    </div>
  </div>

  <div id="right-panel">
    <div className="card" id="zone-insights-card">
      <div className="card-title">🧠 Inteligencia de Zona</div>
      <div id="zone-insights"></div>
    </div>
    <div className="card" id="investor-matching-card">
      <div className="card-title">💼 Matching Inversor</div>
      <div id="investor-matching"></div>
    </div>
    <div className="card" id="forecast-card">
      <div className="card-title">🔮 Forecast & Momentum</div>
      <div id="forecast-panel"></div>
    </div>
    <div className="card" id="market-sim-card">
      <div className="card-title">🧪 Simulación de Mercado</div>
      <div id="market-simulation"></div>
    </div>
    <div className="card" id="cta-card">
      <div className="card-title">🚀 Próxima Acción Recomendada</div>
      <div id="cta-panel"></div>
    </div>
  </div>

  <div id="profile-panel">
    <div className="profile-title">👤 Perfil Inversor (Editable)</div>
    <div className="profile-row">
      <span>Tipo:</span>
      <select id="profile-type">
        <option>Valor Agregado</option>
        <option>Renta Estable</option>
        <option>Desarrollo</option>
        <option>Oportunista</option>
      </select>
    </div>
    <div className="profile-row">
      <span>Ticket (USD):</span>
      <input id="profile-ticket" type="number" defaultValue="150000" step="10000" />
    </div>
    <div className="profile-row">
      <span>TIR Mínima:</span>
      <input id="profile-tir" type="number" defaultValue="12" step="1" min="0" max="100" />
    </div>
  </div>

  <div id="legend">
    <div className="legend-item"><div className="legend-dot legend-hot"></div> Hot</div>
    <div className="legend-item"><div className="legend-dot legend-warm"></div> Warm</div>
    <div className="legend-item"><div className="legend-dot legend-neutral"></div> Neutral</div>
    <div className="legend-item"><div className="legend-dot legend-cold"></div> Cold</div>
  </div>

  {isModalOpen && (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close" onClick={() => setModalOpen(false)}>X</button>
        <h3 className="modal-title">{modalContent.title}</h3>
        <p className="modal-body">{modalContent.body}</p>
      </div>
    </div>
  )}

  {isOnboardingOpen && (
    <div className="onboarding-backdrop">
      <div className="onboarding-content">
        <h2 className="onboarding-title">Bienvenido a CRUSHOME AI Map Intelligence</h2>
        <p className="onboarding-body">
          Esto no es un mapa, es un motor de decisiones. Seleccioná un <strong>Plan</strong> y un <strong>Modo</strong> para empezar.
          Cada capa de IA te da una visión única del mercado. Hacé clic en el mapa para obtener inteligencia específica de la zona.
        </p>
        <div className="onboarding-actions">
          <button className="crush-btn" onClick={() => setOnboardingOpen(false)}>Saltar Guía</button>
          <button className="crush-btn" onClick={() => setOnboardingOpen(false)}>Siguiente</button>
        </div>
      </div>
    </div>
  )}
</div>
    </>
  );
}
