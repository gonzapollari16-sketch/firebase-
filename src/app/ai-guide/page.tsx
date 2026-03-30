'use client';

import React, { useState, useEffect } from 'react';
import { useCore } from '@/core/use-core';
import { 
  Brain, 
  Activity, 
  Target, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Database,
  Cpu,
  RefreshCcw,
  BarChart3,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import CrushomeLogo from '@/components/crushome-logo';

/**
 * @fileOverview CRUSHOME AI GUIDE™ — Master Console
 * Interfaz unificada del Sistema Cognitivo Operativo.
 */
export default function AiGuideMasterPage() {
  const { cognitive, worldModel, experienceLogs, systemStatus, plan, role } = useCore();
  const [activeTab, setActiveTab] = useState('overview');

  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: "Hola. Soy el Neural Core de Crushome. Analizo y respondo a todas tus dudas sobre la plataforma. ¿Qué necesitás aprender hoy?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim() || isTyping) return;
    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let aiResponse = "Lo siento, sigo indexando esa parte del sistema. Por ahora, podés buscar información en el panel lateral o comunicarte con el equipo de ingeniería.";
      
      if (lower.includes('carga') || lower.includes('cargar') || lower.includes('propiedad') || lower.includes('publicar')) {
        aiResponse = "Para subir una nueva propiedad, dirigite al módulo '1. Carga Propiedades' en tu panel lateral izquierdo. Allí encontrarás un formulario avanzado para detallar ambientes, fotos, precio y amenidades. Guardar generará automáticamente un borrador que podrás destacar.";
      } else if (lower.includes('crm') || lower.includes('lead') || lower.includes('cliente') || lower.includes('realmatch') || lower.includes('crushmatch')) {
        aiResponse = "El seguimiento automatizado de leads y clientes se gestiona desde el módulo '18. CRM CrushMatch' (en Admin Center). Podrás calificar interesados, registrar etapas de cierre y asignar puntajes para maximizar tu conversión (ROI).";
      } else if (lower.includes('match') || lower.includes('buscador') || lower.includes('crushia') || lower.includes('ia')) {
        aiResponse = "El motor semántico lo encuentras en el módulo '2. CrushIA Master'. Permite que ingreses descripciones naturales del cliente (ej: 'Busco lugar tranquilo para mi familia') y cruzará los datos algorítmicamente para encontrar la propiedad perfecta.";
      } else if (lower.includes('hola') || lower.includes('buen') || lower.includes('saludo')) {
        aiResponse = "¡Hola! Bienvenido al cerebro central de operaciones. Estoy listo para ayudarte a dominar el ecosistema. ¿Sobre qué módulo quieres aprender?";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="bg-white/[0.02] border-white/5 overflow-hidden relative group hover:bg-white/[0.04] transition-all">
      <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r", color)} />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-white/5 text-white/60">
            <Icon className="w-5 h-5" />
          </div>
          <Badge variant="outline" className="text-[10px] opacity-50">REAL-TIME</Badge>
        </div>
        <div className="text-3xl font-black text-white tracking-tighter mb-1">
          {typeof value === 'number' ? value.toFixed(1) : value}
          <span className="text-lg opacity-30 ml-1">%</span>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{title}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 animate-in fade-in duration-1000">
      
      {/* HEADER DE COMANDO COGNITIVO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="bg-black/40 p-3 rounded-2xl border border-white/5 shadow-2xl shrink-0">
             <CrushomeLogo className="w-16 h-16 md:w-20 md:h-20" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter flex items-center gap-4 italic text-white shadow-sm">
              <Sparkles className="text-accent h-8 w-8 md:h-12 md:w-12 animate-pulse" />
              AI GUIDE MASTER
            </h1>
            <p className="text-white/40 mt-2 uppercase text-[10px] md:text-xs font-black tracking-[0.3em]">
              Sistema Operativo Cognitivo v1.0 — {systemStatus.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/"><Button variant="outline" className="border-white/10 rounded-xl">Dashboard</Button></Link>
          <Button className="bg-gradient-to-r from-pink-500 to-violet-600 text-white font-black rounded-xl shadow-lg shadow-pink-500/20">
            <RefreshCcw className="mr-2 w-4 h-4" /> REINDEXAR MAESTRO
          </Button>
        </div>
      </div>

      {/* METRICAS DE INTELIGENCIA GLOBAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Inteligencia Global (GIS)" 
          value={cognitive.gis} 
          icon={Cpu} 
          color="from-pink-500 to-violet-600" 
        />
        <StatCard 
          title="Evolución Sistémica (SES)" 
          value={cognitive.ses} 
          icon={TrendingUp} 
          color="from-blue-500 to-cyan-400" 
        />
        <StatCard 
          title="Sofisticación de Mercado (MSI)" 
          value={cognitive.msi} 
          icon={Target} 
          color="from-emerald-500 to-teal-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL DE CONTROL DE CONOCIMIENTO */}
        <div className="lg:col-span-8 space-y-8">
          
          <Card className="bg-[#151737]/40 border-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-white/5">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight italic">Manual Maestro Vivo</CardTitle>
                  <CardDescription className="text-white/40 uppercase text-[10px] font-black tracking-widest mt-1">Conocimiento Vectorizado en Tiempo Real</CardDescription>
                </div>
                <Badge className="bg-accent text-black font-black">ACTIVE RAG</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Carga de Propiedades', status: 'Optimizado', impact: '+34% Velocidad' },
                  { title: 'ACM Inteligente', status: 'Aprendiendo', impact: '+12% Precisión' },
                  { title: 'WhatsApp Business', status: 'Automatizado', impact: '+50% Respuesta' },
                  { title: 'Matching de Inversores', status: 'Evolucionando', impact: '+18% ROI' }
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-accent/20 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white group-hover:text-accent transition-colors">{item.title}</h4>
                      <Badge variant="outline" className="text-[9px] border-white/10 opacity-60">{item.status}</Badge>
                    </div>
                    <p className="text-xs text-emerald-400 font-black uppercase tracking-tighter">{item.impact}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="h-5 w-5 text-accent" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/60">Experiencia Reciente (Experience logs)</h3>
                </div>
                <div className="space-y-3">
                  {experienceLogs.slice(0, 5).map((log, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-1.5 h-1.5 rounded-full", log.success ? "bg-emerald-500" : "bg-red-500")} />
                        <span className="font-bold text-white/80">{log.action}</span>
                      </div>
                      <span className="text-white/20 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                  {experienceLogs.length === 0 && (
                    <p className="text-center text-white/20 text-[10px] uppercase font-black py-4">Esperando flujo de eventos...</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ASISTENTE COGNITIVO INTEGRADO */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="bg-gradient-to-b from-[#151737] to-black/40 border-white/5 rounded-[2.5rem] h-full flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 p-12 opacity-5">
              <Brain className="h-64 w-64 text-accent" />
            </div>
            
            <CardHeader className="p-8">
              <div className="flex items-center gap-4 mb-2">
                <div className={cn(
                  "w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl font-black shadow-xl transition-all duration-500",
                  isTyping ? "animate-pulse scale-110 shadow-[0_0_30px_rgba(236,72,153,0.5)]" : ""
                )}>
                  C
                </div>
                <div>
                  <CardTitle className="text-lg font-black tracking-tight italic">AI Assistant</CardTitle>
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-widest transition-colors",
                    isTyping ? "text-pink-400 animate-pulse" : "text-emerald-400"
                  )}>
                    {isTyping ? "Procesando Consulta..." : "Operator Mode Active"}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-8 pt-0 flex flex-col h-[500px]">
              <div 
                ref={scrollRef} 
                className="flex-1 bg-black/20 rounded-3xl p-6 mb-6 border border-white/5 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
              >
                {messages.map((m, i) => (
                  <div key={i} className={cn("flex flex-col w-full", m.role === 'user' ? "items-end" : "items-start")}>
                    <div className={cn(
                      "text-xs p-4 max-w-[85%] leading-relaxed",
                      m.role === 'user' 
                        ? "bg-accent/10 border-accent/20 border text-white font-medium rounded-2xl rounded-tr-md shadow-lg" 
                        : "bg-white/5 text-white/70 italic rounded-2xl rounded-tl-md border border-white/5"
                    )}>
                      {m.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-center gap-1.5 p-4 bg-white/5 text-white/50 w-20 rounded-2xl rounded-tl-md border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>

              <div className="relative group shrink-0">
                <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-full" />
                <div className="relative flex gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl focus-within:border-accent/50 transition-colors">
                  <input 
                    placeholder="Escribí acá (Ej: ¿Cómo cargo una propiedad?)" 
                    className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-medium text-white placeholder:text-white/20"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={handleSend} 
                    disabled={isTyping || !inputText.trim()}
                    size="icon" 
                    className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-105 transition-all shadow-lg"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>

            <div className="p-8 pt-0 mt-auto">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/40">Aprendizaje de Sesión</span>
                  <span className="text-accent">84% Convergencia</span>
                </div>
                <Progress value={84} className="h-1 bg-white/5" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* FOOTER DE ESTADO COGNITIVO */}
      <div className="p-8 rounded-[2.5rem] bg-indigo-900/10 border border-indigo-500/20 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <p className="text-[10px] text-indigo-300 font-black uppercase tracking-[0.5em]">
          CRUSHOME NEURAL CORE — INFRAESTRUCTURA DE DOMINACIÓN INMOBILIARIA © 2026
        </p>
      </div>

    </div>
  );
}
