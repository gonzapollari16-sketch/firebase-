
'use client';

import React, { useState, useEffect } from 'react';
import { useCore } from '@/core/use-core';
import { 
  Activity, 
  Settings, 
  Cpu, 
  Terminal, 
  Zap, 
  Database, 
  RefreshCw, 
  ShieldCheck, 
  Layers,
  Fingerprint,
  Radio,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Modo Procesamiento — CRUSHOME Neural Core v5.0
 * Punto 17 del Master Plan: Visualización de ingesta y normalización de datos.
 */
export default function ProcessingModePage() {
  const { systemStatus, cognitive, experienceLogs } = useCore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [load, setLoad] = useState(74);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoad(l => {
        const next = l + (Math.random() - 0.5) * 5;
        return Math.min(100, Math.max(60, next));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const processingNodes = [
    { name: 'Normalization Engine', status: 'online', load: 45, icon: Layers },
    { name: 'Vector Embedding', status: 'active', load: 88, icon: Database },
    { name: 'Geocoding Cluster', status: 'syncing', load: 12, icon: Radius },
    { name: 'Watermark Pipeline', status: 'online', load: 30, icon: Radio },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-1000 -m-8 md:-m-12 p-8 md:p-12 bg-[#050614] min-h-screen text-[#EAEAFF]">
      
      {/* HEADER TÉCNICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-accent/20 text-accent animate-pulse shadow-[0_0_20px_rgba(255,79,216,0.3)]">
              <Activity className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic executive-gradient-text uppercase">Modo Procesamiento</h1>
          </div>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
            Data Ingestion Layer • Real-Time Inflow • Punto 17
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/"><Button variant="outline" className="border-white/10 rounded-xl text-white/60 hover:text-white">Dashboard</Button></Link>
          <Button 
            onClick={() => setIsProcessing(!isProcessing)}
            className={cn(
              "font-black rounded-xl shadow-lg px-8 transition-all",
              isProcessing ? "bg-accent/20 text-accent border border-accent/40" : "bg-emerald-600 text-white"
            )}
          >
            {isProcessing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
            {isProcessing ? 'PAUSAR INGESTA' : 'REANUDAR PROCESO'}
          </Button>
        </div>
      </div>

      {/* MÉTRICAS DE CARGA SISTÉMICA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricTile label="Throughput" value="1.2 GB/s" sub="NORMALIZED" icon={Database} color="text-pink-500" />
        <MetricTile label="CPU Load" value={`${load.toFixed(1)}%`} sub="SYSTEM CORE" icon={Cpu} color="text-violet-400" />
        <MetricTile label="Latency" value="14ms" sub="REAL-TIME SYNC" icon={Zap} color="text-accent" />
        <MetricTile label="Uptime" value="99.99%" sub="NODE ACTIVE" icon={ShieldCheck} color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* VISUALIZADOR DE NODOS */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="bg-[#151737]/40 border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-violet-500 to-transparent" />
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-black italic tracking-tight uppercase">Orquestación de Nodos</h2>
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-1">Distribución de carga por microservicios</p>
              </div>
              <Badge className="bg-accent/10 text-accent border-none rounded-full px-4 py-1.5 font-black text-[10px]">OS v5.0.2</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {processingNodes.map((node, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-black/20 border border-white/5 space-y-4 hover:border-white/10 transition-all group/node">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-white/5 text-white/40 group-hover/node:text-white transition-colors">
                                <node.icon className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-sm tracking-tight">{node.name}</span>
                        </div>
                        <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                            node.status === 'online' ? "bg-emerald-500/10 text-emerald-400" : 
                            node.status === 'active' ? "bg-accent/10 text-accent" : "bg-white/10 text-white/40"
                        )}>{node.status}</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase text-white/20">
                            <span>Relay Capacity</span>
                            <span>{node.load}%</span>
                        </div>
                        <Progress value={node.load} className="h-1 bg-white/5" />
                    </div>
                </div>
              ))}
            </div>

            {/* PIPELINE LIVE FEED */}
            <div className="mt-12 p-8 rounded-[2.5rem] bg-black/40 border border-white/5 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/5 opacity-50" />
                <div className="relative z-10 flex flex-col items-center justify-center py-10 opacity-40">
                    <Radio className="h-12 w-12 mb-4 animate-ping text-accent" />
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/60">Interceptando Flujo de Datos...</p>
                </div>
            </div>
          </Card>
        </div>

        {/* TERMINAL DE INGESTA (LIVE FEED) */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="bg-black border-white/10 rounded-[2.5rem] h-full flex flex-col overflow-hidden shadow-2xl">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6 space-y-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-accent" /> Neural Log Stream
                </CardTitle>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400/20" />
                    <div className="w-2 h-2 rounded-full bg-amber-400/20" />
                    <div className="w-2 h-2 rounded-full bg-emerald-400/20" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 font-mono text-[10px] space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                {experienceLogs.map((log, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                        <span className="text-white/10 group-hover:text-white/30 transition-colors">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <div className="flex-1">
                            <p className={cn(
                                "font-bold uppercase tracking-tighter",
                                log.success ? "text-emerald-500" : "text-pink-500"
                            )}>
                                {log.action}
                            </p>
                            <p className="text-white/40 group-hover:text-white/60 transition-colors mt-0.5 italic">
                                {log.frictionDetected ? "DETECTED_COLLISION_RETRIED" : "BUFFER_COMMIT_SUCCESS"}
                            </p>
                        </div>
                    </div>
                ))}
                {experienceLogs.length === 0 && (
                    <div className="p-20 text-center opacity-20 italic">Aguardando paquetes de datos...</div>
                )}
            </CardContent>
            <div className="p-6 bg-white/[0.01] border-t border-white/5 text-[9px] font-bold text-white/20 uppercase tracking-widest text-center">
                PROCESANDO: 1245_PORTALS_ASYNC.sh
            </div>
          </Card>
        </div>

      </div>

      {/* FOOTER SISTÉMICO */}
      <div className="p-8 rounded-[2.5rem] bg-[#151737] border border-white/5 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <p className="text-[10px] text-accent font-black uppercase tracking-[0.5em] mb-2 opacity-50">
          GLOBAL DATA INGESTION PLANE © 2026
        </p>
        <div className="flex justify-center gap-6 opacity-30">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"><Fingerprint className="w-3 h-3" /> Encrypted Hash Commit</div>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"><Eye className="w-3 h-3" /> Real-Time Metadata extraction</div>
        </div>
      </div>

    </div>
  );
}

function MetricTile({ label, value, sub, icon: Icon, color }: any) {
    return (
        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center group hover:bg-white/[0.04] transition-all">
            <div className={cn("p-3 rounded-2xl bg-white/5 mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.05)]", color)}>
                <Icon className="h-6 w-6" />
            </div>
            <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">{label}</div>
            <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
            <div className="text-[10px] font-bold text-emerald-400/60 mt-2 uppercase tracking-widest">{sub}</div>
        </div>
    );
}

function Radius(props: any) {
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
            <path d="m2 2 20 20" />
            <path d="m22 2-20 20" />
            <circle cx="12" cy="12" r="10" />
        </svg>
    )
}
