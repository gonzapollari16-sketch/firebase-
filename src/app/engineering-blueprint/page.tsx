'use client';

import React, { useState } from 'react';
import { useCore } from '@/core/use-core';
import { 
  Cpu, 
  Globe, 
  Zap, 
  Activity,
  ShieldCheck,
  Target,
  Layers,
  Fingerprint,
  Smartphone,
  BarChart3,
  Bot,
  Terminal,
  Brain,
  TrendingUp,
  RefreshCw,
  Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * @fileOverview CRUSHOME CONSOLIDATED COCKPIT — NEURAL CORE CONTROL
 * El "Engineering Blueprint" definitivo. Orquesta la visualización de los 
 * 22 puntos del Master Plan y el estado del Sistema Cognitivo.
 */

const StatTile = ({ label, value, sub, icon: Icon, color }: any) => (
  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center group hover:bg-white/[0.04] transition-all">
    <div className={cn("p-3 rounded-2xl bg-white/5 mb-4 group-hover:scale-110 transition-transform", color)}>
      <Icon className="h-6 w-6" />
    </div>
    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">{label}</div>
    <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
    <div className="text-[10px] font-bold text-emerald-400 mt-2 uppercase tracking-widest">{sub}</div>
  </div>
);

export default function EngineeringBlueprint() {
  const { systemStatus, cognitive, worldModel, experienceLogs, eventBus } = useCore();
  const [activeTab, setActiveTab] = useState('neural');
  const [isCalibrating, setIsCalibrating] = useState(false);

  const handleRecalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      eventBus.emit('system.tool_updated', { name: 'Neural Core', version: '5.1' });
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-1000">
      
      {/* HEADER ESTRATÉGICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-500">
              <Brain className="h-8 w-8 animate-pulse" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter italic executive-gradient-text uppercase">Neural Command Cockpit</h1>
          </div>
          <p className="text-white/30 uppercase text-[10px] font-black tracking-[0.5em] flex items-center gap-3">
            CRUSHOME OS • Master Plan Engineering • {systemStatus.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/"><Button variant="outline" className="border-white/10 rounded-xl">Dashboard</Button></Link>
          <Button 
            onClick={handleRecalibrate}
            disabled={isCalibrating}
            className="bg-accent text-white font-black rounded-xl shadow-lg shadow-accent/20 px-8"
          >
            {isCalibrating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
            RECALIBRAR CORE
          </Button>
        </div>
      </div>

      {/* METRICAS DE CEREBRO UNIFICADO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatTile label="Intelligence (GIS)" value={`${cognitive.gis.toFixed(1)}%`} sub="FEDERATED ACTIVE" icon={Cpu} color="text-pink-500" />
        <StatTile label="Evolution (SES)" value={`${cognitive.ses.toFixed(1)}%`} sub="SELF-OPTIMIZING" icon={TrendingUp} color="text-violet-400" />
        <StatTile label="Liquidity Index" value={`${(worldModel.liquidityIndex * 100).toFixed(1)}%`} sub="REAL-TIME MARKET" icon={Globe} color="text-blue-400" />
        <StatTile label="Intent Precision" value="94.8%" sub="LLM GEMINI 1.5" icon={Target} color="text-emerald-400" />
      </div>

      <Tabs defaultValue="neural" onValueChange={setActiveTab} className="space-y-10">
        <TabsList className="bg-white/5 p-1 rounded-2xl border border-white/5 w-fit">
          <TabsTrigger value="neural" className="rounded-xl px-8 font-black text-xs uppercase">Arquitectura Neural</TabsTrigger>
          <TabsTrigger value="masterplan" className="rounded-xl px-8 font-black text-xs uppercase">Estado 22 Puntos</TabsTrigger>
          <TabsTrigger value="telemetry" className="rounded-xl px-8 font-black text-xs uppercase">Telemetría Viva</TabsTrigger>
        </TabsList>

        {/* VISTA: ARQUITECTURA NEURAL */}
        <TabsContent value="neural" className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-[#151737]/40 border-white/5 rounded-[2.5rem] p-8 overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-transparent" />
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-lg font-black italic flex items-center gap-3">
                  <Activity className="text-pink-500" /> Experience Engine (ELE)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <p className="text-xs text-white/40 leading-relaxed italic">
                  Analiza el 100% de los eventos del bus para detectar fricción y patrones de éxito comercial.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-white/20">Learning Throughput</span>
                    <span className="text-pink-500">142 eps</span>
                  </div>
                  <Progress value={85} className="h-1 bg-white/5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#151737]/40 border-white/5 rounded-[2.5rem] p-8 overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-transparent" />
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-lg font-black italic flex items-center gap-3">
                  <Target className="text-violet-500" /> Outcome Loop (OIL)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <p className="text-xs text-white/40 leading-relaxed italic">
                  Correlaciona cierres reales con predicciones de IA para ajustar políticas de matching.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-white/20">Policy Alignment</span>
                    <span className="text-violet-500">98.2%</span>
                  </div>
                  <Progress value={98} className="h-1 bg-white/5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#151737]/40 border-white/5 rounded-[2.5rem] p-8 overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent" />
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-lg font-black italic flex items-center gap-3">
                  <Database className="text-emerald-500" /> Digital Twin (DT)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <p className="text-xs text-white/40 leading-relaxed italic">
                  Modelo matemático vivo de la oferta y demanda en microzonas urbanas.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-white/20">Market Sync</span>
                    <span className="text-emerald-500">Synchronized</span>
                  </div>
                  <Progress value={100} className="h-1 bg-white/5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <section className="bg-black/40 border border-white/5 rounded-[3rem] p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-pink-500/5" />
            <h3 className="text-2xl font-black italic tracking-tighter mb-8 uppercase">Neural Event Bus Flow</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 relative z-10">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 font-black text-[10px] uppercase tracking-widest">Intención</div>
              <Zap className="text-accent h-4 w-4" />
              <div className="p-6 rounded-3xl bg-accent/10 border border-accent/20 font-black text-sm uppercase italic">Neural Core</div>
              <Zap className="text-accent h-4 w-4" />
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 font-black text-[10px] uppercase tracking-widest">Acción (Ads/Match)</div>
              <Zap className="text-accent h-4 w-4" />
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 font-black text-[10px] uppercase tracking-widest text-emerald-400">Outcome Real</div>
            </div>
          </section>
        </TabsContent>

        {/* VISTA: TELEMETRÍA VIVA */}
        <TabsContent value="telemetry">
          <Card className="bg-black/60 border-white/10 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/[0.02] p-8">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-black italic flex items-center gap-3">
                    <Terminal className="h-5 w-5 text-accent" /> Experiencia de Aprendizaje
                  </CardTitle>
                  <p className="text-white/20 uppercase text-[10px] font-black tracking-widest mt-1">Logs del Experience Engine en tiempo real</p>
                </div>
                <div className="bg-accent/20 text-accent border-none font-black text-[10px] px-3 py-1 rounded-full">LIVE FEED</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto scrollbar font-mono text-[11px] p-4 space-y-2 bg-black/40">
                {experienceLogs.map((log, i) => (
                  <div key={i} className={cn(
                    "flex gap-4 items-start p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group"
                  )}>
                    <span className="text-white/20 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className={cn(
                      "font-bold uppercase tracking-tighter shrink-0 w-24",
                      log.success ? "text-emerald-400" : "text-pink-500"
                    )}>
                      {log.action.replace('.', '::')}
                    </span>
                    <span className="text-white/60 italic flex-1">
                      {log.frictionDetected ? "Fricción detectada: recalibrando pesos sinápticos..." : "Evento procesado con impacto económico positivo."}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-[9px] border border-white/10 text-white/40 px-2 py-0.5 rounded">PID: {log.id}</div>
                    </div>
                  </div>
                ))}
                {experienceLogs.length === 0 && (
                  <div className="p-20 text-center text-white/20 uppercase font-black italic">Esperando actividad del Neural Bus...</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* FOOTER COGNITIVO */}
      <div className="p-10 rounded-[3rem] bg-indigo-900/10 border border-indigo-500/20 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <p className="text-[10px] text-indigo-300 font-black uppercase tracking-[0.6em] mb-2">
          CRUSHOME OPERATING SYSTEM • UNICORN ARCHITECTURE © 2026
        </p>
        <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest italic">
          Series A Internal Document • Distributed Intelligence Active
        </p>
      </div>

    </div>
  );
}
