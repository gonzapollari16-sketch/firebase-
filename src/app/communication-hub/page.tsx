
'use client';

import React, { useState, useEffect } from 'react';
import { useCore } from '@/core/use-core';
import { 
  Bell, 
  MessageSquare, 
  Sparkles, 
  Zap, 
  Target, 
  Activity, 
  History, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Communication Hub — CRUSHOME Neural Node v5.0
 * Punto 8 del Master Plan: Feed, Notificaciones y Chat.
 * Orquestador de eventos sistémicos y comunicación bidireccional.
 */
export default function CommunicationHubPage() {
  const { eventBus, experienceLogs, user, role } = useCore();
  const [activeTab, setActiveTab] = useState('feed');

  // Simulación de hilos de chat
  const chatThreads = [
    { id: 1, name: 'Soporte Técnico', last: 'Tu solicitud #124 ha sido escalada.', time: '10:14', unread: 2, online: true },
    { id: 2, name: 'CrushIA AI Advisor', last: 'He encontrado un match perfecto para Palermo.', time: '09:45', unread: 0, online: true },
    { id: 3, name: 'Inmobiliaria Alpha (Broker)', last: 'Confirmamos la visita para mañana.', time: 'Ayer', unread: 0, online: false },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-1000">
      
      {/* HEADER DE COMUNICACIÓN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-pink-600/20 text-pink-400">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic executive-gradient-text uppercase">Communication Hub</h1>
          </div>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
            Feed • Notifications • Chat • Punto 8
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/"><Button variant="outline" className="border-white/10 rounded-xl">Dashboard</Button></Link>
          <Button className="bg-gradient-to-r from-pink-600 to-violet-600 text-white font-black rounded-xl shadow-lg border-none">
            NUEVO MENSAJE
          </Button>
        </div>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 rounded-[2rem] p-1.5 h-16 w-full md:w-auto mb-10">
          <TabsTrigger value="feed" className="rounded-full px-8 h-full data-[state=active]:bg-accent data-[state=active]:text-white font-black uppercase text-[11px] tracking-widest">Global Feed</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-full px-8 h-full data-[state=active]:bg-accent data-[state=active]:text-white font-black uppercase text-[11px] tracking-widest">Notificaciones</TabsTrigger>
          <TabsTrigger value="chat" className="rounded-full px-8 h-full data-[state=active]:bg-accent data-[state=active]:text-white font-black uppercase text-[11px] tracking-widest">Mensajería IA</TabsTrigger>
        </TabsList>

        {/* FEED GLOBAL DE EVENTOS */}
        <TabsContent value="feed" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {experienceLogs.length > 0 ? experienceLogs.map((log, i) => (
                <Card key={i} className="bg-[#151737]/40 border-white/5 rounded-[2.5rem] overflow-hidden group hover:bg-[#151737]/60 transition-all">
                  <CardContent className="p-8 flex gap-6">
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xl",
                        log.success ? "bg-emerald-500/20 text-emerald-400" : "bg-pink-500/20 text-pink-400"
                    )}>
                        {log.action.includes('property') ? <History className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                             <h3 className="text-xl font-bold tracking-tight">{log.action.toUpperCase()}</h3>
                             <span className="text-[10px] font-mono text-white/20">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm text-white/40 leading-relaxed italic mb-4">
                            El sistema detectó un flujo de {log.action} y lo integró al vector de mercado con un impacto de {(Math.random() * 0.5 + 0.1).toFixed(2)}.
                        </p>
                        <div className="flex gap-3">
                            <Badge className="bg-white/5 text-white/60 border-none px-3 font-bold">NODE_SYNC</Badge>
                            <Badge className="bg-white/5 text-white/60 border-none px-3 font-bold">NEURAL_COMMIT</Badge>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] opacity-20 italic">
                    Esperando flujo de eventos sistémicos...
                </div>
              )}
            </div>
            
            <div className="lg:col-span-4 space-y-8">
                <Card className="bg-gradient-to-b from-[#151737] to-black/40 border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" /> Sugerido por IA
                    </h3>
                    <div className="space-y-6">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 border-l-accent border-l-4">
                            <p className="text-xs font-bold mb-2">Evolución de Palermo</p>
                            <p className="text-[10px] text-white/30 italic">La liquidez en la zona aumentó +4% tras el último commit de datos.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 border-l-pink-500 border-l-4">
                            <p className="text-xs font-bold mb-2">Alerta de Lead</p>
                            <p className="text-[10px] text-white/30 italic">3 usuarios buscaron "Loft industrial" en las últimas 2 horas.</p>
                        </div>
                    </div>
                </Card>
            </div>
          </div>
        </TabsContent>

        {/* NOTIFICACIONES CRÍTICAS */}
        <TabsContent value="notifications" className="mt-0">
             <div className="max-w-4xl mx-auto space-y-4">
                {[
                    { title: 'Nueva Verificación de Tenant', type: 'system', desc: 'Inmobiliaria Alpha ha sido validada.', time: 'Hace 5 min' },
                    { title: 'Propiedad Duplicada Detectada', type: 'warning', desc: 'Se bloqueó un intento de carga colisionante.', time: 'Hace 1h' },
                    { title: 'ACM Recalculado', type: 'success', desc: 'Se actualizaron 14 valores de mercado.', time: 'Hace 3h' },
                ].map((notif, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center",
                                notif.type === 'warning' ? "bg-pink-500/10 text-pink-500" : "bg-emerald-500/10 text-emerald-400"
                            )}>
                                {notif.type === 'warning' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg">{notif.title}</h4>
                                <p className="text-xs text-white/30">{notif.desc}</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase text-white/20 flex items-center gap-2">
                            <Clock className="h-3 w-3" /> {notif.time}
                        </span>
                    </div>
                ))}
             </div>
        </TabsContent>

        {/* CHAT IA / MENSAJERÍA */}
        <TabsContent value="chat" className="mt-0">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
                <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/5 bg-black/20">
                        <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Conversaciones</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {chatThreads.map(thread => (
                            <div key={thread.id} className="p-6 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-all flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black">{thread.name[0]}</div>
                                        {thread.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#07081a]" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white mb-1">{thread.name}</h4>
                                        <p className="text-[11px] text-white/30 truncate w-32 font-medium">{thread.last}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-[9px] font-bold text-white/20">{thread.time}</span>
                                    {thread.unread > 0 && <Badge className="bg-accent text-white font-black text-[9px] rounded-full h-5 w-5 flex items-center justify-center p-0">{thread.unread}</Badge>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-8 bg-[#151737]/40 border border-white/5 rounded-[2.5rem] flex flex-col relative overflow-hidden backdrop-blur-3xl">
                     <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center font-black">C</div>
                            <div>
                                <h3 className="font-bold text-sm">CrushIA AI Advisor</h3>
                                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Siempre Online</p>
                            </div>
                        </div>
                     </div>
                     <div className="flex-1 p-8 flex flex-col justify-end opacity-40 italic text-center">
                        <p className="text-sm">Seleccioná una conversación para iniciar la sincronización...</p>
                     </div>
                     <div className="p-6 bg-black/40 border-t border-white/5 flex gap-4">
                        <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-medium outline-none focus:border-accent" placeholder="Escribí un mensaje..." />
                        <Button className="bg-accent text-white font-black rounded-xl h-12 px-8">ENVIAR</Button>
                     </div>
                </div>
             </div>
        </TabsContent>
      </Tabs>

      {/* FOOTER DE HUB */}
      <div className="p-8 rounded-[2.5rem] bg-black border border-white/5 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-600/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <p className="text-[10px] text-pink-400 font-black uppercase tracking-[0.6em] mb-2 opacity-50">
          NEURAL COMMUNICATION HUB © 2026
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
