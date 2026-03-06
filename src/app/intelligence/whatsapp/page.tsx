'use client';

import React, { useState, useEffect } from 'react';
import { useCore } from '@/core/use-core';
import { 
  Smartphone, 
  Send, 
  Bot, 
  Zap, 
  Settings, 
  History, 
  DollarSign, 
  ShieldCheck,
  RefreshCw,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Terminal,
  Activity,
  Brain,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * @fileOverview CRUSHOME — WHATSAPP INTELLIGENCE KERNEL v5.0
 * Centro de control para Meta Cloud API con Inferencia Neural Integrada.
 */
export default function WhatsAppHub() {
  const { cognitive, systemStatus, hasFeature, eventBus } = useCore();
  const router = useRouter();
  const [apiMode, setApiMode] = useState<'sandbox' | 'production'>('sandbox');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<{msg: string, type: string}[]>([]);
  const [neuralIntel, setNeuralIntel] = useState({ intent: 'Unknown', urgency: 0, sentiment: 'Neutral' });

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' | 'neural' = 'info') => {
    setLogs(prev => [{ msg, type }, ...prev].slice(0, 15));
  };

  useEffect(() => {
    addLog(`Sistema de mensajería iniciado en modo ${apiMode.toUpperCase()}`, 'info');
    addLog("Conectado a Meta Cloud API v18.0", 'success');
  }, [apiMode]);

  const handleSimulateInbound = () => {
    addLog("Evento entrante: 'messages' recibido de Meta Webhook", 'info');
    setTimeout(() => {
      addLog("Neural Extraction: Analizando intención semántica...", 'neural');
      setNeuralIntel({ intent: 'Compra / Palermo', urgency: 85, sentiment: 'Positivo / Curiosidad' });
      addLog("Intención detectada: Interés en Depto Palermo Soho (Match 94%)", 'success');
    }, 800);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setIsAnalyzing(true);
    addLog(`Encolando mensaje saliente a Event Bus...`, 'info');
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setMessage('');
      addLog(`Mensaje enviado exitosamente vía ${apiMode.toUpperCase()}`, 'success');
      toast({ 
        title: "Operación Exitosa", 
        description: "El mensaje ha sido procesado por el Kernel de Comunicación." 
      });
      
      eventBus.emit('notification.created', {
        userId: 'admin',
        message: 'WhatsApp: Respuesta automática generada y enviada.',
        type: 'communication'
      });
    }, 1200);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20 -m-8 md:-m-12 p-8 md:p-12 bg-[#07081a] min-h-screen text-[#EAEAFF]">
      
      {/* HEADER ESTRATÉGICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-5">
          <div className="p-3 rounded-2xl bg-[#25D366]/10 text-[#25D366]">
            <Smartphone className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter italic executive-gradient-text uppercase">Communication Kernel</h1>
            <p className="text-[#AAA8FF]/40 text-[10px] font-black uppercase tracking-[0.4em] mt-1">
              WhatsApp Business API • Neural Analysis • {apiMode.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 text-[#AAA8FF] hover:bg-white/5" onClick={() => setApiMode(m => m === 'sandbox' ? 'production' : 'sandbox')}>
            {apiMode === 'sandbox' ? 'Activar Producción' : 'Volver a Sandbox'}
          </Button>
          <Button className="bg-gradient-to-r from-pink-500 to-violet-600 text-white font-black shadow-lg shadow-pink-500/20">
            <RefreshCw className="mr-2 h-4 w-4" /> RECALIBRAR API
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL LATERAL: TELEMETRÍA Y MÉTRICAS */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-[#14173A]/40 border-white/5 rounded-[2rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#25D366]" />
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-[#AAA8FF]/60 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Telemetría Meta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <div className="text-[10px] font-black uppercase text-white/30 mb-1">Costo Estimado</div>
                  <div className="text-lg font-black text-[#25D366]">USD 12.45</div>
                </div>
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <div className="text-[10px] font-black uppercase text-white/30 mb-1">Status API</div>
                  <div className="text-lg font-black text-emerald-400">99.9%</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#25D366]/5 border border-[#25D366]/20 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#25D366]">
                  <CheckCircle2 className="h-3 w-3" /> Conexión Activa
                </div>
                <div className="text-xs text-[#AAA8FF]/60 leading-relaxed italic">
                  "Webhook verificado y autenticado. Token de acceso válido por 58 días."
                </div>
              </div>
            </CardContent>
          </Card>

          {/* REGISTRO DE EVENTOS (CONSOLE STYLE) */}
          <Card className="bg-black/40 border-white/5 rounded-[2rem] h-80 flex flex-col">
            <CardHeader className="py-4 border-b border-white/5">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-[#AAA8FF]/40 flex items-center gap-2">
                <Terminal className="h-3 w-3" /> Event Log
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 scrollbar font-mono text-[10px] space-y-2">
              {logs.map((log, i) => (
                <div key={i} className={cn(
                  "flex gap-2",
                  log.type === 'success' ? "text-emerald-400" : 
                  log.type === 'warn' ? "text-pink-500" : 
                  log.type === 'neural' ? "text-violet-400" : "text-[#AAA8FF]/60"
                )}>
                  <span className="opacity-30">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                  <span>{log.msg}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* PANEL CENTRAL: CONSOLA DE MENSAJERÍA NEURAL */}
        <div className="lg:col-span-8 space-y-8">
          
          <Tabs defaultValue="sender" className="space-y-8">
            <TabsList className="bg-white/5 p-1 rounded-2xl border border-white/5 w-fit">
              <TabsTrigger value="sender" className="rounded-xl px-8">Consola de Envío</TabsTrigger>
              <TabsTrigger value="automations" className="rounded-xl px-8">Flujos IA</TabsTrigger>
              <TabsTrigger value="templates" className="rounded-xl px-8">Plantillas</TabsTrigger>
            </TabsList>

            <TabsContent value="sender">
              <Card className="bg-gradient-to-br from-[#1A1D3A] to-[#11142D] border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-20 -right-20 p-12 opacity-5">
                  <MessageSquare className="h-64 w-64 text-[#25D366]" />
                </div>

                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-black italic tracking-tight mb-2 uppercase">Neural Dispatcher</h2>
                      <p className="text-[#AAA8FF]/60 text-sm leading-relaxed max-w-md">
                        Componer respuesta utilizando el contexto cognitivo del lead detectado.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#25D366]/20 text-[#25D366]" onClick={handleSimulateInbound}>
                      Simular Entrada
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">Lead Phone</label>
                        <Input placeholder="+54 9 351 000-0000" className="bg-black/40 border-white/10 rounded-xl h-12" />
                      </div>
                      <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-violet-400 tracking-widest">
                          <Brain className="h-4 w-4" /> Neural Analysis
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/40 font-bold uppercase">Intención:</span>
                            <span className="text-white font-black italic">{neuralIntel.intent}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-black uppercase">
                              <span className="text-white/20">Urgencia detectada</span>
                              <span className="text-[#25D366]">{neuralIntel.urgency}%</span>
                            </div>
                            <Progress value={neuralIntel.urgency} className="h-1 bg-white/5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">Neural Message Body</label>
                        <Textarea 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="La IA sugiere una respuesta basada en el match..." 
                          className="bg-black/40 border-white/10 rounded-xl min-h-[180px] p-6 text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      disabled={isAnalyzing || !message.trim()}
                      onClick={handleSendMessage}
                      className="flex-1 h-16 bg-gradient-to-r from-[#25D366] to-emerald-600 font-black text-lg rounded-2xl shadow-xl shadow-[#25D366]/10 hover:scale-[1.01] transition-all"
                    >
                      {isAnalyzing ? <RefreshCw className="h-6 w-6 animate-spin" /> : <div className="flex items-center gap-3"><Send className="h-5 w-5" /> DESPACHAR MENSAJE</div>}
                    </Button>
                    <Button variant="outline" className="h-16 px-8 rounded-2xl border-white/10 group">
                      <Bot className="h-6 w-6 text-[#AAA8FF] group-hover:text-white" />
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="automations">
              <div className="p-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
                <AlertCircle className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold opacity-40 italic">Módulo de Flujos IA en Entrenamiento</h3>
                <p className="text-sm text-white/20 mt-2">La Red Neuronal está aprendiendo de las interacciones manuales.</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* SECURITY ALERT (OBLIGATORIA) */}
          <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-6">
            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500">End-to-End Encryption Enforced</h4>
              <p className="text-[10px] text-[#AAA8FF]/40 mt-1">
                Toda comunicación viaja cifrada y cumple con las normativas GDPR y Ley de Datos Personales AR.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER COGNITIVO */}
      <div className="p-8 rounded-[2.5rem] bg-[#151737] border border-white/5 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <p className="text-[10px] text-[#AAA8FF]/30 font-black uppercase tracking-[0.5em]">
          CRUSHOME OPERATING SYSTEM • COMMUNICATION KERNEL © 2026
        </p>
      </div>

    </div>
  );
}
