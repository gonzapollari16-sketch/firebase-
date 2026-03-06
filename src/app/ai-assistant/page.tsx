'use client';

import React, { useState } from 'react';
import { useCore } from '@/core/use-core';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Cpu, 
  Zap, 
  Activity, 
  Sparkles, 
  Terminal, 
  RefreshCcw, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import Link from "next/link";
import { getAIResponse } from '@/app/ai-actions';
import { cn } from '@/lib/utils';

export default function AIAssistantPage() {
  const { cognitive, systemStatus, eventBus } = useCore();
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logs, setLogs] = useState<{msg: string, type: 'info' | 'success' | 'warn' | 'ai'}[]>([]);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' | 'ai' = 'info') => {
    setLogs(prev => [{ msg, type }, ...prev].slice(0, 10));
  };

  const handleNeuralInput = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    addLog(`Iniciando extracción: "${input.substring(0, 30)}..."`, 'info');
    
    try {
      const result = await getAIResponse(input);
      
      if (!result.success) {
        addLog("Error en el Neural Core", 'warn');
      } else {
        setAiResponse(result.data || null);
        addLog("Inferencia completada", 'success');
        
        eventBus.emit('cognitive.process', {
          originalEvent: 'assistant.query',
          data: { query: input, success: true }
        });
      }
    } catch (err) {
      addLog("Fallo crítico cognitivo", 'warn');
    } finally {
      setIsAnalyzing(false);
      setInput('');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20 -m-8 md:-m-12 p-8 md:p-12 bg-[#0E1026] min-h-screen text-[#EAEAFF]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#2A2F6A] pb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-500">
              <Brain className="h-8 w-8 animate-pulse" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic executive-gradient-text uppercase">NEURAL COMMAND</h1>
          </div>
          <p className="text-[#AAA8FF]/40 text-[10px] font-black uppercase tracking-[0.4em]">
            v5.0 • {systemStatus.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/"><Button variant="outline" className="border-[#2A2F6A] text-[#AAA8FF] hover:bg-white/5">Dashboard</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-[#14173A] border-[#2A2F6A] rounded-[2rem] overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-[#AAA8FF]/60 flex items-center gap-2">
                <Cpu className="h-4 w-4" /> Estado Cognitivo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-[#AAA8FF]/40">GIS</span>
                    <span className="text-pink-500">{cognitive.gis.toFixed(1)}%</span>
                  </div>
                  <Progress value={cognitive.gis} className="h-1 bg-white/5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-[#2A2F6A] rounded-[2rem] h-64 flex flex-col">
            <CardHeader className="py-4 border-b border-[#2A2F6A]">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-[#AAA8FF]/40 flex items-center gap-2">
                <Terminal className="h-3 w-3" /> Telemetría
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-2">
              {logs.map((log, i) => (
                <div key={i} className={cn(
                  "flex gap-2",
                  log.type === 'success' ? "text-emerald-400" : 
                  log.type === 'warn' ? "text-pink-500" : 
                  log.type === 'ai' ? "text-violet-400" : "text-[#AAA8FF]/60"
                )}>
                  <span>[{new Date().toLocaleTimeString()}]</span>
                  <span>{log.msg}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <Card className="bg-gradient-to-br from-[#1A1D3A] to-[#11142D] border-[#2A2F6A] rounded-[2.5rem] p-8 md:p-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-black italic tracking-tight uppercase">NEURAL ANALYZER</h2>
              <div className="space-y-4">
                <Textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ingresa tu consulta estratégica..."
                  className="bg-black/40 border-[#2A2F6A] rounded-2xl min-h-[150px] p-6 text-lg"
                />
                <Button 
                  onClick={handleNeuralInput}
                  disabled={isAnalyzing || !input.trim()}
                  className="w-full h-16 bg-gradient-to-r from-pink-500 to-violet-600 font-black text-lg rounded-2xl"
                >
                  {isAnalyzing ? <RefreshCcw className="h-5 w-5 animate-spin" /> : "EJECUTAR ANÁLISIS"}
                </Button>
              </div>

              {aiResponse && (
                <div className="bg-black/40 border-l-4 border-pink-500 rounded-2xl p-8 space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-pink-500">
                    <ShieldAlert className="h-4 w-4" /> Respuesta Neural
                  </div>
                  <p className="text-lg italic text-[#F0EEFF]">"{aiResponse}"</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
