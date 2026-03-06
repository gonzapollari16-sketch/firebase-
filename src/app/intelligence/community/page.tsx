'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useCore } from '@/core/use-core';
import { 
  Users, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  Handshake, 
  Share2, 
  RefreshCcw,
  Plus,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function CommunityNetworkPage() {
  const { tenant, user, eventBus } = useCore();
  const [activeView, setActiveView] = useState('dashboard');
  const [icp, setIcp] = useState(tenant?.icp || 78);

  const communities = [
    { id: 'c1', name: 'Palermo Premium', members: 18, avgIcp: 84, status: 'ok', rules: 'Min ICP 75' },
    { id: 'c2', name: 'Belgrano Network', members: 12, avgIcp: 79, status: 'ok', rules: 'Reciprocidad 60%' },
    { id: 'c3', name: 'Centro Abierto', members: 25, avgIcp: 42, status: 'risk', rules: 'Soft Enforcement' },
  ];

  const collabFeed = [
    { id: 'f1', title: 'Depto 2 amb Palermo Soho', price: 135000, agency: 'Norte Real Estate', icp: 86, commission: 50, urgency: 'alta' },
    { id: 'f2', title: 'PH 3 amb Recoleta', price: 210000, agency: 'Urban Brokers', icp: 72, commission: 50, urgency: 'media' },
    { id: 'f3', title: 'Oficina Microcentro', price: 98000, agency: 'Centro Negocios', icp: 35, commission: 40, urgency: 'baja' },
  ];

  const icpHistory = [
    { event: 'Cierre colaborativo exitoso', delta: +4, date: 'hace 2 días' },
    { event: 'Difusión de propiedad de colega', delta: +2, date: 'hace 3 días' },
    { event: 'Rechazo sistemático de matching', delta: -3, date: 'hace 5 días' },
  ];

  const handleSimulateTick = () => {
    const delta = Math.random() > 0.5 ? 1 : -1;
    setIcp(prev => Math.min(100, Math.max(0, prev + delta)));
    eventBus.emit('match.suggested', { type: 'collab', tenantId: tenant?.id });
    toast({
      title: "Evento Colaborativo",
      description: "Se ha detectado un nuevo match en la red.",
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      
      {/* HEADER ESTRATÉGICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Users className="text-accent w-10 h-10" />
            RED COLABORATIVA
          </h1>
          <p className="text-muted-foreground mt-1">Gestión de confianza y reciprocidad profesional (MLS Descentralizado).</p>
        </div>
        <div className="flex gap-3">
          <Link href="/"><Button variant="outline">Dashboard</Button></Link>
          <Button onClick={handleSimulateTick} className="bg-accent text-white font-bold">
            <RefreshCcw className="mr-2 w-4 h-4" /> Simular Actividad
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL IZQUIERDO: ESTADO Y COMUNIDADES */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* MI ICP CARD */}
          <Card className="bg-white/[0.03] border-white/10 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary" />
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex justify-between">
                Mi Índice de Cooperación
                <Badge variant="outline" className="border-green-500/50 text-green-400">EN REGLA</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-6xl font-black tracking-tighter text-white">{icp}</span>
                <span className="text-sm font-bold text-accent">TOP 15%</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase opacity-60">
                  <span>Crítico</span>
                  <span>Excelente</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-1000" style={{ width: `${icp}%` }} />
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Difusión Fantasma</span>
                  <Badge variant="secondary" className="bg-white/5 text-muted-foreground">INACTIVA</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground italic">
                  Tu ICP es alto. Acceso total a leads prioritarios y comunidades premium habilitado.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* COMUNIDADES HUB */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Mis Comunidades
            </h3>
            {communities.map(c => (
              <Card key={c.id} className="bg-white/[0.02] border-white/5 hover:bg-white/[0.05] transition-colors cursor-pointer group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white group-hover:text-accent transition-colors">{c.name}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">{c.members} Miembros · ICP PROM {c.avgIcp}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${c.status === 'ok' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full border-dashed border-white/10 hover:bg-white/5 text-muted-foreground text-xs py-6">
              <Plus className="mr-2 w-4 h-4" /> CREAR COMUNIDAD
            </Button>
          </div>
        </div>

        {/* PANEL CENTRAL: FEED Y ACTIVIDAD */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* FEED COLABORATIVO */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-2">
                <Zap className="w-4 h-4" /> Oportunidades en Red
              </h3>
              <div className="flex gap-2">
                <Badge className="bg-white/5 text-white/60 text-[10px]">PALERMO</Badge>
                <Badge className="bg-white/5 text-white/60 text-[10px]">VENTA</Badge>
              </div>
            </div>

            <div className="space-y-4">
              {collabFeed.map(item => (
                <Card key={item.id} className="bg-white/[0.03] border-white/10 overflow-hidden hover:border-accent/30 transition-all group">
                  <CardContent className="p-0 flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-32 bg-white/5 shrink-0 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-2 left-2 bg-black/40 text-[9px] uppercase font-black">MATCH 94%</Badge>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-white leading-tight">{item.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">Agencia: <span className="text-white font-bold">{item.agency}</span></p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-black text-accent">USD {item.price.toLocaleString()}</div>
                          <Badge className="bg-green-500/10 text-green-400 text-[10px] mt-1">COMISIÓN {item.commission}%</Badge>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-3">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase text-indigo-400">ICP AGENCIA: {item.icp}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-8 text-[10px] font-black uppercase text-muted-foreground hover:text-white">
                            <MessageSquare className="w-3 h-3 mr-1.5" /> Chatear
                          </Button>
                          <Button size="sm" className="h-8 text-[10px] font-black uppercase px-4">
                            <Handshake className="w-3 h-3 mr-1.5" /> Colaborar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* HISTORIAL ICP */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Registro de Reciprocidad
            </h3>
            <Card className="bg-white/[0.02] border-white/5">
              <CardContent className="p-0">
                {icpHistory.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="text-sm font-bold text-white/90">{h.event}</p>
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">{h.date}</span>
                    </div>
                    <span className={`text-sm font-black ${h.delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {h.delta > 0 ? '+' : ''}{h.delta} ICP
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      {/* FOOTER INFORMATIVO */}
      <div className="p-6 rounded-3xl bg-indigo-900/10 border border-indigo-500/20 text-center">
        <p className="text-xs text-indigo-300 font-medium">
          CRUSHOME utiliza un motor de reciprocidad forzada. El incumplimiento de las reglas comunitarias activa la penalización silenciosa por Difusión Fantasma.
        </p>
      </div>

    </div>
  );
}
