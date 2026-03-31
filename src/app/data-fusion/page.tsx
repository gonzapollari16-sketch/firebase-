
'use client';

import React, { useState, useEffect } from 'react';
import { useCore } from '@/core/use-core';
import { 
  Combine, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Zap, 
  Target, 
  Globe, 
  Cpu, 
  History, 
  Filter,
  Layers,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Análisis y Fusión 1 y 2 — CRUSHOME Central Intelligence
 * Punto 21 del Master Plan: Fusión de datos transaccionales, de mercado y comportamiento de usuario.
 */
export default function DataFusionPage() {
  const { cognitive, worldModel, tenant } = useCore();
  const [fusing, setFusing] = useState(false);
  const [fusionProgress, setFusionProgress] = useState(0);

  const startFusion = () => {
    setFusing(true);
    setFusionProgress(0);
    const interval = setInterval(() => {
      setFusionProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setFusing(false);
          toast({ title: 'Fusión Completada', description: 'Vectores de mercado sincronizados con inventario local.' });
          return 100;
        }
        return p + 2;
      });
    }, 50);
  };

  const fusionNodes = [
    { name: 'Transactional Feed (F1)', src: 'Firebase-Master', weight: '72%', icon: BarChart3 },
    { name: 'Market Sentiment (F2)', src: 'Neural-Core', weight: '28%', icon: Globe },
    { name: 'User Intention (F1+F2)', src: 'CrushIA-Logs', weight: 'Real-time', icon: Sparkles },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-1000 -m-8 md:-m-12 p-8 md:p-12 bg-[#050614] min-h-screen text-[#EAEAFF]">
      
      {/* HEADER DE INTELIGENCIA ESTRATÉGICA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-violet-600/20 text-violet-400 animate-pulse shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Combine className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic executive-gradient-text uppercase">Análisis y Fusión 1 y 2</h1>
          </div>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
            Strategic Data Merging • Cross-Dataset Analytics • Punto 21
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/"><Button variant="outline" className="border-white/10 rounded-xl text-white/60 hover:text-white">Dashboard</Button></Link>
          <Button 
            onClick={startFusion}
            disabled={fusing}
            className="bg-gradient-to-r from-violet-600 to-pink-500 text-white font-black rounded-xl shadow-lg px-8 py-6 hover:scale-105 hover:shadow-violet-600/40 transition-all border-none"
          >
            {fusing ? <Target className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
            {fusing ? `FUSIONANDO ${fusionProgress}%` : 'EJECUTAR FUSIÓN ESTRATÉGICA'}
          </Button>
        </div>
      </div>

      {/* MÉTRICAS DE INTELIGENCIA FUSIONADA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricTile label="Convergebce" value={`${cognitive.gis}%`} sub="STRATEGIC ACCURACY" icon={Target} color="text-emerald-400" />
        <MetricTile label="Data Points" value="1.4M" sub="INTEGRATED VECTORS" icon={Database} color="text-pink-400" />
        <MetricTile label="Inference" value="Stable" sub="PREDICTIVE READY" icon={ShieldCheck} color="text-violet-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL DE FUSIÓN VISUAL */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="bg-[#151737]/40 border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden backdrop-blur-3xl group">
             <div className="absolute -top-20 -right-20 p-12 opacity-5">
              <Sparkles className="h-64 w-64 text-accent" />
            </div>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-black italic tracking-tight uppercase">Matriz de Fusión</h2>
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-1">Combinación de fuentes de datos primarias (F1) y secundarias (F2)</p>
              </div>
              <Badge className="bg-violet-600/10 text-violet-400 border-none rounded-full px-4 py-1.5 font-black text-[10px]">REAL-TIME FUSION</Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {fusionNodes.map((node, i) => (
                <div key={i} className="group/fusion p-6 rounded-3xl bg-black/20 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-violet-500/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-white/5 text-white/40 group-hover/fusion:text-violet-400 transition-colors">
                            <node.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-white mb-1">{node.name}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Source: <span className="text-white/60">{node.src}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="flex-1 md:w-32 space-y-2">
                             <div className="flex justify-between text-[9px] font-black uppercase text-white/40 mb-1">
                                <span>Weight</span>
                                <span>{node.weight}</span>
                            </div>
                            <Progress value={node.weight === 'Real-time' ? 100 : parseInt(node.weight)} className="h-1 bg-white/5" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-white/10 group-hover/fusion:translate-x-2 transition-transform" />
                    </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-3xl bg-indigo-900/10 border border-indigo-500/20 text-center">
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-2 italic">
                    La fusión estratégica garantiza que cada decisión de negocio esté respaldada por una muestra representativa del mercado total.
                </p>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={cn("h-full bg-gradient-to-r from-violet-600 to-pink-500 transition-all duration-300", fusing ? "animate-pulse" : "")} style={{ width: fusing ? `${fusionProgress}%` : '100%' }} />
                </div>
            </div>
          </Card>
        </div>

        {/* INSIGHTS DE FUSIÓN (F1 + F2) */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="bg-gradient-to-b from-[#151737] to-[#050614] border-white/5 rounded-[2.5rem] p-8 h-full flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div>
               <h3 className="text-sm font-black uppercase tracking-widest text-white/40 flex items-center gap-2 mb-8">
                  <LineChart className="h-4 w-4 text-pink-500" /> Strategic Insights
               </h3>
               {[
                   { label: 'Oportunidad de Arbitraje', val: '+5.4%', desc: 'Brecha detectada entre F1 y F2 en Palermo Soho.', status: 'High' },
                   { label: 'Riesgo de Sobreoferta', val: '-12%', desc: 'Incremento sostenido de inventario según F2.', status: 'Low' },
                   { label: 'Intención de Compra', val: '+38%', desc: 'Sentimiento positivo en búsquedas CrushIA.', status: 'Stable' }
               ].map((insight, i) => (
                   <div key={i} className="mb-8 last:mb-0 group/insight">
                       <div className="flex justify-between items-center mb-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{insight.label}</span>
                           <Badge className={cn(
                               "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                               insight.status === 'High' ? "bg-emerald-500/10 text-emerald-400" : "bg-white/10 text-white/40"
                           )}>{insight.status}</Badge>
                       </div>
                       <div className="text-3xl font-black text-white group-hover/insight:text-pink-500 transition-colors">{insight.val}</div>
                       <p className="text-[10px] text-white/20 mt-1 italic">{insight.desc}</p>
                   </div>
               ))}
            </div>
            
            <div className="pt-8 border-t border-white/5">
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/5 group">
                    <span className="text-[12px] font-black uppercase tracking-widest">Generar Reporte Full</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-all" />
                </Button>
            </div>
          </Card>
        </div>

      </div>

      {/* FOOTER ESTRATÉGICO */}
      <div className="p-8 rounded-[2.5rem] bg-black border border-white/5 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-600/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <p className="text-[10px] text-violet-400 font-black uppercase tracking-[0.6em] mb-2 opacity-50">
          CENTRAL INTELLIGENCE FUSION LAYER — INFRAESTRUCTURA DE DOMINACIÓN © 2026
        </p>
      </div>

    </div>
  );
}

function MetricTile({ label, value, sub, icon: Icon, color }: any) {
    return (
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center group hover:bg-white/[0.04] transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-all" />
            <div className={cn("p-4 rounded-2xl bg-white/5 mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.05)]", color)}>
                <Icon className="h-8 w-8" />
            </div>
            <div className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">{label}</div>
            <div className="text-5xl font-black text-white tracking-tighter">{value}</div>
            <div className="text-[10px] font-bold text-white/20 mt-3 uppercase tracking-tighter">{sub}</div>
        </div>
    );
}

function Database(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 12 2 2 4-4" />
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
    </svg>
  );
}
