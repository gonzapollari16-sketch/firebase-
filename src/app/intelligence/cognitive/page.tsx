'use client';

import React, { useEffect, useState } from 'react';
import { useCore } from '@/core/use-core';
import { 
  Brain, 
  Activity, 
  Globe, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Database,
  Cpu,
  RefreshCcw,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function CognitiveNeuroDashboard() {
  const { cognitive, worldModel, systemStatus, eventBus, plan } = useCore();
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTicker(t => t + 1), 3000);
    return () => clearInterval(timer);
  }, []);

  const MetricCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="bg-white/[0.03] border-white/10 overflow-hidden relative group">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`} />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-white/5 text-white/60">
            <Icon className="w-5 h-5" />
          </div>
          <Badge variant="outline" className="text-[10px] opacity-50">REAL-TIME</Badge>
        </div>
        <div className="text-4xl font-black text-white tracking-tighter mb-1">
          {typeof value === 'number' ? value.toFixed(1) : value}
          <span className="text-lg opacity-30 ml-1">%</span>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{title}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in duration-1000">
      
      {/* HEADER COGNITIVO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Brain className="text-accent w-10 h-10 animate-pulse" />
            NEURAL CORE DASHBOARD
          </h1>
          <p className="text-muted-foreground mt-1 uppercase text-xs font-black tracking-widest">
            SISTEMA COGNITIVO AUTOEVOLUTIVO v5.0 — {systemStatus.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/intelligence"><Button variant="outline" className="border-white/10">Back</Button></Link>
          <Button className="bg-accent text-white font-black shadow-lg shadow-accent/20">
            <RefreshCcw className="mr-2 w-4 h-4" /> RECALIBRAR MODELOS
          </Button>
        </div>
      </div>

      {/* SCORES GLOBALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Global Intelligence Score" 
          value={cognitive.gis} 
          icon={Cpu} 
          color="from-pink-500 to-violet-600" 
        />
        <MetricCard 
          title="System Evolution Score" 
          value={cognitive.ses} 
          icon={TrendingUp} 
          color="from-blue-500 to-cyan-400" 
        />
        <MetricCard 
          title="Market Sophistication" 
          value={cognitive.msi} 
          icon={Globe} 
          color="from-emerald-500 to-teal-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* DIGITAL TWIN VISUALIZATION */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-black/40 border-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-accent flex items-center gap-2">
                <Database className="w-4 h-4" /> Live World Model (Digital Twin)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Absorción', val: worldModel.absorptionRate * 100, unit: '%' },
                  { label: 'Liquidez', val: worldModel.liquidityIndex * 100, unit: '%' },
                  { label: 'Elasticidad', val: worldModel.priceElasticity, unit: '' },
                  { label: 'Presión', val: worldModel.demandSurge * 100, unit: '%' }
                ].map((m, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <div className="text-2xl font-black text-white">{m.val.toFixed(2)}{m.unit}</div>
                    <div className="text-[9px] font-black uppercase text-white/30 tracking-widest">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* SIMULACIÓN DE FLUJO NEURONAL */}
              <div className="h-48 bg-gradient-to-b from-transparent to-accent/5 rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-accent animate-pulse" />
                  <div className="absolute top-0 left-1/2 w-[1px] h-full bg-accent animate-pulse" />
                </div>
                <div className="text-center z-10">
                  <Activity className="w-12 h-12 text-accent mx-auto mb-2 opacity-50" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Procesando vectores de intención real...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FEDERATED LEARNING STATUS */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white/[0.03] border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" /> Federated Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase text-emerald-400">Local Training Status</span>
                  <Badge className="bg-emerald-500 text-black text-[9px]">ACTIVE</Badge>
                </div>
                <Progress value={ticker % 100} className="h-1 bg-white/5" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Tenant Gradientes Compartidos</span>
                  <span className="text-white font-bold">142</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Global Model Version</span>
                  <span className="text-white font-bold">v5.0.12-neural</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Aislamiento de Datos</span>
                  <span className="text-emerald-400 font-black">ENFORCED</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] text-white/30 italic leading-relaxed">
                  Tu tenant está contribuyendo a la inteligencia colectiva mediante el intercambio de pesos sinápticos cifrados. Los datos crudos permanecen en tu silo.
                </p>
              </div>
              
              {plan !== 'ENTERPRISE' && (
                <div className="p-4 rounded-xl bg-accent/20 border border-accent/30 text-center">
                  <p className="text-xs font-bold mb-3">Upgrade para Federated Full Access</p>
                  <Button size="sm" className="w-full bg-white text-black font-black text-[10px]">UPGRADE</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FOOTER COGNITIVO */}
      <div className="p-6 rounded-3xl bg-indigo-900/10 border border-indigo-500/20 text-center">
        <p className="text-[10px] text-indigo-300 font-black uppercase tracking-[0.4em]">
          CRUSHOME NEURAL CORE — SISTEMA AUTODIDACTA EN EVOLUCIÓN CONTINUA
        </p>
      </div>

    </div>
  );
}
