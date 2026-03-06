'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Search, Zap } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase/provider';
import { collection, DocumentData, CollectionReference } from 'firebase/firestore';
import { SpatialSearchEngine } from '@/core/geo/spatial-search-engine';
import { useCore } from '@/core/use-core';
import type { Property } from '@/lib/types';

declare global {
  interface Window {
    mapboxgl: any;
    MapboxDraw: any;
  }
}

const MAP_MODES = [
  { id: 'M1', label: 'Exploratorio', desc: 'Vista base' },
  { id: 'M2', label: 'Operativo', desc: 'Demanda + Liquidez' },
  { id: 'M3', label: 'Inteligente', desc: 'Matching Inversor' },
  { id: 'M4', label: 'Predictivo', desc: 'Forecast IA' },
  { id: 'M5', label: 'Estratégico', desc: 'Análisis Total' }
];

export default function GeoSearchPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { plan } = useCore();
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const drawRef = useRef<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [currentMode, setCurrentMode] = useState('M1');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [results, setFilteredResults] = useState<Property[]>([]);
  const [insights, setInsights] = useState<any>({ total: 0, avgPrice: 0, hotspot: '' });

  const propertiesRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return collection(db, 'properties'); 
  }, [user, db]);

  const { data: properties } = useCollection<Property>(propertiesRef as CollectionReference<DocumentData> | null);

  const processVisibleData = useCallback(() => {
    if (!mapRef.current || !properties) return;

    const bounds = mapRef.current.getBounds();
    const bbox = {
      west: bounds.getWest(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      north: bounds.getNorth()
    };

    let filtered = SpatialSearchEngine.filterByBBox(properties, bbox);

    if (drawRef.current) {
      const drawings = drawRef.current.getAll();
      if (drawings.features.length > 0) {
        filtered = SpatialSearchEngine.filterByPolygon(filtered, drawings.features[0]);
      }
    }

    const geojson = {
      type: "FeatureCollection",
      features: filtered.map(p => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [p.lng, p.lat] },
        properties: { id: p.id }
      }))
    };
    
    const source = mapRef.current.getSource("properties-source");
    if (source) {
      source.setData(geojson);
    }

    const total = filtered.length;
    const avgPrice = total > 0 ? filtered.reduce((acc, p) => acc + (p.precio || 0), 0) / total : 0;
    const hotspot = SpatialSearchEngine.calculateHotspot(filtered);

    setFilteredResults(filtered);
    setInsights({
      total,
      avgPrice,
      hotspot: hotspot ? `${hotspot.lat.toFixed(4)}, ${hotspot.lng.toFixed(4)}` : 'N/A'
    });

  }, [properties]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    const MAPBOX_TOKEN = "pk.eyJ1IjoiZmVkZWdhbGl6emkiLCJhIjoiY2p2bDM5cDVhMDFxZDRhcGNvZmNyM3F3MyJ9.v3-e0b8pSc22x2g1Iu1j4Q";
    window.mapboxgl.accessToken = MAPBOX_TOKEN;

    const setupMapLayers = () => {
      const map = mapRef.current;
      if (!map.getSource("properties-source")) {
        map.addSource("properties-source", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });

        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "properties-source",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": ["step", ["get", "point_count"], "#7B4DFF", 10, "#C94BFF", 30, "#FF4FD8"],
            "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 30, 40],
            "circle-opacity": 0.8
          }
        });

        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "properties-source",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-size": 12
          },
          paint: { "text-color": "#ffffff" }
        });

        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "properties-source",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#FF4FD8",
            "circle-radius": 8,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff"
          }
        });

        map.on("click", "unclustered-point", (e: any) => {
          const id = e.features[0].properties.id;
          const prop = properties?.find(p => p.id === id);
          if (prop) {
            setSelectedProperty(prop);
            setModalOpen(true);
          }
        });
      }
    };

    const initMap = () => {
      if (mapRef.current) return;

      mapRef.current = new window.mapboxgl.Map({
        container: mapContainerRef.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-58.43, -34.60],
        zoom: 12,
        pitch: 45
      });

      mapRef.current.addControl(new window.mapboxgl.NavigationControl(), "bottom-right");
      
      if (window.MapboxDraw) {
        drawRef.current = new window.MapboxDraw({
          displayControlsDefault: false,
          controls: { polygon: true, trash: true }
        });
        mapRef.current.addControl(drawRef.current, "top-right");
      }

      mapRef.current.on("load", () => {
        setLoading(false);
        setupMapLayers();
        processVisibleData();
      });

      mapRef.current.on("moveend", processVisibleData);
      mapRef.current.on("draw.create", processVisibleData);
      mapRef.current.on("draw.delete", processVisibleData);
      mapRef.current.on("draw.update", processVisibleData);
    };

    const checkDependencies = setInterval(() => {
      if (window.mapboxgl && window.MapboxDraw) {
        clearInterval(checkDependencies);
        initMap();
      }
    }, 100);

    return () => {
      clearInterval(checkDependencies);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [properties, processVisibleData]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryStr = (document.getElementById('geoSearchInput') as HTMLInputElement).value;
    if (!queryStr) return;

    try {
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(queryStr)}.json?access_token=${window.mapboxgl.accessToken}&limit=1`);
      const data = await res.json();
      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].center;
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 15 });
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#07081a] text-white overflow-hidden" style={{ margin: '-2rem' }}>
      <header className="h-16 flex items-center px-6 glass z-50 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-black">C</div>
          <div className="font-bold tracking-tight text-lg">CRUSHOME SPATIAL ENGINE</div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="px-3 py-1 rounded bg-accent/20 text-accent text-xs font-bold uppercase">{plan}</div>
          <Link href="/" passHref><Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/20"><ArrowLeft className="mr-2 h-4 w-4" /> Volver</Button></Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className="w-96 glass z-40 flex flex-col p-4 gap-6 shrink-0 shadow-2xl border-r border-white/5 bg-black/20">
          <section className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Búsqueda Inteligente</h3>
            <form onSubmit={handleSearch} className="space-y-2">
              <div className="relative">
                <input id="geoSearchInput" placeholder="Ej: Palermo Soho, CABA" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none pr-10" />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500">Localizar Zona</Button>
            </form>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Modos de Capa</h3>
            <div className="grid grid-cols-1 gap-2">
              {MAP_MODES.map(m => (
                <button 
                  key={m.id}
                  onClick={() => setCurrentMode(m.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${currentMode === m.id ? 'bg-indigo-600 border-indigo-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <div className="text-left">
                    <div className="text-sm font-bold">{m.label}</div>
                    <div className="text-[10px] opacity-60 uppercase">{m.desc}</div>
                  </div>
                  <div className="text-xs font-black opacity-40">{m.id}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="flex-1 overflow-y-auto scrollbar space-y-3 pr-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Resultados ({results.length})</h3>
            {results.slice(0, 50).map(p => (
              <div 
                key={p.id}
                onClick={() => {
                  setSelectedProperty(p);
                  setModalOpen(true);
                  mapRef.current?.flyTo({ center: [p.lng, p.lat], zoom: 16 });
                }}
                className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-indigo-500/50 cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-sm truncate pr-2 group-hover:text-indigo-300 transition-colors">{p.titulo}</div>
                  <div className="text-xs font-black text-emerald-400 shrink-0">USD {p.precio.toLocaleString()}</div>
                </div>
                <div className="text-[10px] text-zinc-400 uppercase font-medium">{p.tipo} • {p.barrio}</div>
              </div>
            ))}
          </section>

          <section className="pt-4 border-t border-white/10 space-y-2 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
            <div className="flex justify-between"><span>Visibles:</span> <span className="text-white">{insights.total}</span></div>
            <div className="flex justify-between"><span>Precio prom:</span> <span className="text-white">USD {Math.round(insights.avgPrice).toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Hotspot:</span> <span className="text-indigo-400">{insights.hotspot}</span></div>
          </section>
        </aside>

        <main className="flex-1 relative">
          <div ref={mapContainerRef} className="w-full h-full" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
            </div>
          )}
        </main>
      </div>

      {isModalOpen && selectedProperty && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] backdrop-blur-md bg-black/40" onClick={() => setModalOpen(false)}>
          <div className="bg-[#151737] w-[450px] p-8 rounded-[2.5rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <button className="absolute top-6 right-6 text-xl opacity-40 hover:opacity-100 transition-opacity font-black text-white" onClick={() => setModalOpen(false)}>×</button>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black mb-1 leading-tight text-white">{selectedProperty.titulo}</h2>
                <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest">{selectedProperty.tipo} • {selectedProperty.barrio}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-black text-zinc-500 uppercase mb-1">Precio</div>
                  <div className="text-xl font-black text-emerald-400">USD {selectedProperty.precio.toLocaleString()}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-black text-zinc-500 uppercase mb-1">Score</div>
                  <div className="text-xl font-black text-indigo-400">8.4 / 10</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Insights IA CRUSHOME</span>
                </div>
                <p className="text-sm italic opacity-80 leading-relaxed text-zinc-300">"Propiedad con alta liquidez territorial. El precio está un 4% por debajo del promedio del cluster detectado."</p>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 h-12 rounded-xl bg-accent text-white font-bold shadow-lg shadow-accent/20">Contactar</Button>
                <Button variant="outline" className="flex-1 h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold text-white">Ver Ficha</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
