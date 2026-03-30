'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Mic, 
  Send, 
  RefreshCw, 
  Sparkles, 
  X,
  Brain,
  Search as SearchIcon
} from 'lucide-react';
import { useCore } from '@/core/use-core';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { collection, query, orderBy, limit, type CollectionReference, type DocumentData } from 'firebase/firestore';
import type { Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

// 🧠 CONFIGURACIÓN DE ESTADOS COGNITIVOS
type AIState = 
  | 'idle' 
  | 'listening' 
  | 'typing_acknowledging' 
  | 'thinking' 
  | 'searching' 
  | 'found_result' 
  | 'empathetic' 
  | 'reformulating' 
  | 'suggesting_alternative'
  | 'no_results'
  | 'confusion';

const StateConfig: Record<AIState, { label: string; statusText: string; imagePath: string; colorClass: string; duration: number }> = {
  idle: { label: 'En espera', statusText: 'Crushia está lista para escucharte', imagePath: '/images/assistant-ia.png', colorClass: 'from-[#7A3DF0] to-[#E63A8C]', duration: 0 },
  listening: { label: 'Escuchando atentamente', statusText: 'Te estoy escuchando...', imagePath: '/images/assistant-ia.png', colorClass: 'from-[#10B981] to-[#3B82F6]', duration: 0 },
  typing_acknowledging: { label: 'Tomando nota', statusText: 'Registrando lo que me contás...', imagePath: '/images/assistant-ia.png', colorClass: 'from-[#F472B6] to-[#DB2777]', duration: 0 },
  thinking: { label: 'Analizando tu pedido', statusText: 'Pensando en lo que me contaste...', imagePath: '/images/assistant-ia.png', colorClass: 'from-[#6366F1] to-[#8B5CF6]', duration: 1800 },
  searching: { label: 'Buscando activamente', statusText: 'Explorando opciones que resuenen con vos...', imagePath: '/images/assistant-ia.png', colorClass: 'from-[#3B82F6] to-[#6366F1]', duration: 2200 },
  found_result: { label: '¡Encontré algo!', statusText: '¡Encontré lugares que podrían gustarte!', imagePath: '/images/assistant-ia.png', colorClass: 'from-[#34D399] to-[#059669]', duration: 2800 },
  empathetic: { label: 'Entiendo tu punto', statusText: 'Entiendo... vamos a buscar algo mejor', imagePath: '/images/assistant-ia.png', colorClass: 'from-[#f59e0b] to-[#d97706]', duration: 1500 },
  reformulating: { label: 'Ajustando búsqueda', statusText: 'Refinando la búsqueda con tu feedback...', imagePath: '/images/assistant-ia.png', colorClass: 'from-[#8B5CF6] to-[#6366F1]', duration: 1600 },
  suggesting_alternative: { label: 'Tengo alternativas', statusText: 'Encontré opciones cercanas a lo que buscás', imagePath: '/images/assistant-ia.png', colorClass: 'from-[#06B6D4] to-[#0891B2]', duration: 2000 },
  no_results: { label: 'Sin datos exactos', statusText: 'No encontré propiedades con esa descripción específica', imagePath: '/images/assistant-ia.png', colorClass: 'from-[#6B7280] to-[#374151]', duration: 1000 },
  confusion: { label: 'No comprendí', statusText: 'No logré entenderte. ¿Podés intentar con otras palabras?', imagePath: '/images/assistant-ia.png', colorClass: 'from-[#EF4444] to-[#991B1B]', duration: 1000 }
};

export default function CrushiaSearchPage() {
  const { toast } = useToast();
  const { cognitive, _store, eventBus, user, tenant } = useCore();
  const firestore = useFirestore();
  const [aiState, setAiState] = useState<AIState>('idle');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const propertiesRef = useMemoFirebase(() => {
    if (!user || !firestore || !tenant?.id) return null;
    return query(
      collection(firestore, 'tenants', tenant.id, 'properties'), 
      orderBy('createdAt', 'desc'),
      limit(50)
    ) as unknown as CollectionReference<DocumentData>;
  }, [user, firestore, tenant?.id]);

  const { data: dbProperties } = useCollection<Property>(propertiesRef as any);
  const recognitionRef = useRef<any>(null);

  // Modelo Cognitivo del Usuario (UCM)
  const [ucm, setUcm] = useState<any>({
    emotionalDriver: "confort",
    stage: "explorando",
    frustrationStreak: 0,
    accepted: [],
    rejected: [],
    interactionCount: 0,
    hypotheses: [
      {id:1, conf:0.60, desc:"Lugar cálido para familia", tags:["familia","patio","jardín"]},
      {id:2, conf:0.25, desc:"Opción práctica", tags:["económico","inversión"]},
      {id:3, conf:0.15, desc:"Sorpresa y libertad", tags:["terraza","vista","luz"]}
    ]
  });

  useEffect(() => {
    const saved = localStorage.getItem('crushome_ucm_enterprise_v2');
    if (saved) setUcm(JSON.parse(saved));

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'es-AR';
        recognitionRef.current.onstart = () => {
          setIsRecording(true);
          setAiState('listening');
        };
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          handleProcess(transcript);
        };
        recognitionRef.current.onend = () => setIsRecording(false);
      }
    }
  }, []);

  const handleProcess = async (text: string = inputText) => {
    if (!text.trim()) return;
    
    // Iniciar Ciclo Cognitivo
    setAiState('thinking');
    const isFrustrated = /(no|mal|nada|otro|distinto|no me gusta)/i.test(text);
    
    // Inferencia de conductores emocionales
    let driver = ucm.emotionalDriver;
    if (/familia|chicos|crecer|seguro/i.test(text)) driver = "familia";
    if (/tranqui|silencio|paz|luz|respir/i.test(text)) driver = "tranquilidad";
    if (/invertir|renta|oportunidad|barato/i.test(text)) driver = "inversión";

    await new Promise(r => setTimeout(r, StateConfig.thinking.duration));
    setAiState('searching');
    await new Promise(r => setTimeout(r, StateConfig.searching.duration));

    // Lógica de Ranking Cognitivo basada en coincidencia real
    const textLower = text.toLowerCase().trim();
    const isGibberish = textLower.length < 3 || !/[aeiouy]/i.test(textLower) || /^([a-z])\1+$/.test(textLower);
    
    let scored: any[] = [];
    
    if (isGibberish) {
      setResults([]);
      setAiState('confusion');
      return; // Cortamos el flujo, el input no tiene sentido
    }
    
    const words = textLower.split(' ').filter(w => w.length > 2);
    const realProperties = dbProperties || [];
    
    scored = realProperties.map(p => {
      let score = 0;
      let wordMatched = false;
      
      words.forEach(word => {
        if (p.barrio?.toLowerCase().includes(word)) { score += 40; wordMatched = true; }
        if (p.titulo?.toLowerCase().includes(word)) { score += 30; wordMatched = true; }
        if (p.descripcion?.toLowerCase().includes(word)) { score += 20; wordMatched = true; }
        if (p.tipo?.toLowerCase().includes(word)) { score += 30; wordMatched = true; }
      });

      if (wordMatched) {
        if (driver === "familia" && (p.ambientes || 0) >= 3) score += 30;
        if (driver === "tranquilidad" && (p.descripcion?.toLowerCase().includes("patio") || p.descripcion?.toLowerCase().includes("jardin"))) score += 30;
        if (driver === "inversión" && (p.precio || Infinity) <= 150000) score += 30;
      } else {
        score = 0; // Obligamos a descartarlo si no pegó UNA sola palabra real
      }
      
      if (ucm.rejected.includes(p.id)) score -= 60;
      
      return { ...p, score: Math.min(100, score) };
    })
    .filter(p => p.score >= 20) // Obligamos a que haya coincidido con algo real
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

    setResults(scored);
    
    if (scored.length > 0) {
      setAiState('found_result');
    } else {
      setAiState('no_results');
    }

    const updatedUcm = {
      ...ucm,
      emotionalDriver: driver,
      interactionCount: ucm.interactionCount + 1,
      frustrationStreak: isFrustrated ? ucm.frustrationStreak + 1 : Math.max(0, ucm.frustrationStreak - 1)
    };
    setUcm(updatedUcm);
    localStorage.setItem('crushome_ucm_enterprise_v2', JSON.stringify(updatedUcm));

    eventBus.emit('search.created', {
      query: text,
      resultsCount: scored.length,
      emotionalDriver: driver,
      isFrustrated
    });

    _store.getState().setCognitiveMetrics({ ses: Math.min(100, cognitive.ses + 0.5) });
  };

  const handleDecision = async (id: string, approved: boolean) => {
    if (approved) {
      setUcm((prev: any) => ({ ...prev, accepted: [...prev.accepted, id] }));
      setAiState('found_result');
      toast({ title: "¡Excelente elección!", description: "He guardado este match en tu perfil." });
    } else {
      setUcm((prev: any) => ({ ...prev, rejected: [...prev.rejected, id] }));
      setAiState('empathetic');
    }
    
    localStorage.setItem('crushome_ucm_enterprise_v2', JSON.stringify(ucm));
    setTimeout(() => setAiState('idle'), 2500);
  };

  return (
    <div className="min-h-screen bg-[#07081a] text-white p-4 md:p-10 flex flex-col items-center relative overflow-hidden font-sans -m-12">
      <style jsx global>{`
        @keyframes breathe-natural {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translate(0, 0) scale(0.8); opacity: 0.4; }
          50% { transform: translate(-15px, -25px) scale(1.3); opacity: 0.9; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.85); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .breathe { animation: breathe-natural 4s ease-in-out infinite; }
        .particle-anim { animation: float-gentle 4s ease-in-out infinite; }
        .pulse-layer { animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
        .animation-delay-500 { animation-delay: 500ms; }
      `}</style>

      {/* HEADER COGNITIVO */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-12 z-10">
        <Link href="/" passHref>
          <Button variant="ghost" className="bg-white/5 border-white/10 hover:bg-white/10 rounded-2xl">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-[#6366F1] to-[#A855F7] bg-clip-text text-transparent uppercase">CrushIA Master</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Neural Operating System v5.0</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
          <Brain className="h-4 w-4 text-indigo-400" />
          <span className="text-[10px] font-bold uppercase text-indigo-300">Modo: {ucm.emotionalDriver}</span>
        </div>
      </header>

      {/* AVATAR DINÁMICO */}
      <div className="flex flex-col items-center mb-12 z-10">
        <div className={cn(
          "relative w-64 h-64 rounded-full flex items-center justify-center transition-all duration-700 breathe",
          (aiState === 'thinking' || aiState === 'searching' || aiState === 'listening') && "scale-110"
        )}>
          {/* RINGS & GLOW FUTURISTA */}
          {aiState !== 'idle' && (
            <>
              <div className={cn("absolute inset-0 rounded-full border-2 pulse-layer", StateConfig[aiState].colorClass.replace('from-', 'border-').split(' ')[0])} />
              <div className={cn("absolute inset-2 rounded-full border border-white/20 pulse-layer animation-delay-500")} />
            </>
          )}
          <div className={cn(
            "absolute inset-[-40px] rounded-full blur-[50px] opacity-40 bg-gradient-to-tr transition-all duration-700",
            StateConfig[aiState].colorClass,
            aiState === 'listening' ? "animate-pulse opacity-60" : ""
          )} />

          {/* SISTEMA DE PARTÍCULAS RADIALES */}
          {aiState !== 'idle' && Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/70 particle-anim shadow-[0_0_10px_rgba(255,255,255,1)]"
              style={{
                left: `${50 + (Math.random() - 0.5) * 180}%`,
                top: `${50 + (Math.random() - 0.5) * 180}%`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}

          <div className={cn(
            "relative w-52 h-52 rounded-full overflow-hidden border-4 transition-all shadow-2xl bg-black/60 z-10",
            aiState === 'listening' ? "border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)]" : 
            aiState === 'confusion' || aiState === 'no_results' ? "border-red-500/50" : "border-white/10"
          )}>
            <Image 
              src={StateConfig[aiState].imagePath} 
              alt="Crushia" 
              fill 
              className={cn(
                "object-cover transition-opacity duration-700",
                aiState === 'idle' ? "opacity-70 grayscale-[30%]" : "opacity-100"
              )}
              unoptimized
              onError={(e: any) => {
                e.currentTarget.src = `https://picsum.photos/seed/${aiState}/400`;
              }}
            />
          </div>
        </div>
        
        <div className="mt-8 text-center bg-black/40 px-8 py-3 rounded-full border border-white/5 backdrop-blur-md">
          <div className="flex items-center justify-center gap-3">
            <h2 className={cn("text-2xl font-black tracking-tight uppercase italic", 
              aiState === 'confusion' || aiState === 'no_results' ? "text-red-400" : "text-white"
            )}>{StateConfig[aiState].label}</h2>
            {(aiState === 'thinking' || aiState === 'searching') && <RefreshCw className="h-5 w-5 animate-spin text-accent" />}
          </div>
          <p className="text-zinc-400 text-sm italic mt-1 font-medium">{StateConfig[aiState].statusText}</p>
        </div>
      </div>

      {/* SISTEMA DE ENTRADA */}
      <div className="w-full max-w-2xl relative mb-16 z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#6366F1] to-[#A855F7] rounded-3xl blur opacity-20" />
        <div className="relative bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 flex items-center shadow-2xl">
          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
            placeholder="¿Qué lugar estás sintiendo que necesitás hoy?"
            className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-lg placeholder:text-zinc-600 font-medium text-white"
          />
          <div className="flex gap-2 pr-2">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => isRecording ? recognitionRef.current?.stop() : recognitionRef.current?.start()}
              className={cn("rounded-full h-12 w-12 transition-all", isRecording && "text-red-500 bg-red-500/10 scale-110")}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button 
              onClick={() => handleProcess()}
              className="rounded-2xl h-12 px-8 bg-accent text-white font-black shadow-lg shadow-accent/20 hover:scale-105 transition-transform"
            >
              <Send className="h-4 w-4 mr-2" /> IR
            </Button>
          </div>
        </div>
      </div>

      {/* PARRILLA DE RESULTADOS CON RANKING DIVERSO */}
      {results.length > 0 && (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 z-10 pb-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
          {results.map((res) => (
            <div key={res.id} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-accent/30 transition-all group backdrop-blur-sm shadow-xl flex flex-col">
              <div className="relative h-56 bg-white/5 overflow-hidden">
                <Image 
                  src={(PlaceHolderImages.find(img => img.id === res.imagen)?.imageUrl) || `https://picsum.photos/seed/${res.id}/600/400`} 
                  alt={res.titulo || 'Propiedad'} 
                  fill 
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                  unoptimized
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10">
                  <Sparkles className="h-3 w-3 text-accent animate-pulse" /> Match Cognitivo {Math.round(res.score || 85)}%
                </div>
              </div>
              <div className="p-8 space-y-5 flex-1 flex flex-col">
                <div>
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-accent transition-colors">{res.titulo}</h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">{res.barrio} • {res.tipo}</p>
                </div>
                <div className="text-sm text-zinc-400 italic leading-relaxed border-l-2 border-accent/30 pl-4 py-1 bg-white/5 rounded-r-lg">
                  {res.descripcion ? res.descripcion.substring(0, 100) : 'Estratégica unidad residencial...'}...
                </div>
                <div className="mt-auto pt-4">
                  <div className="text-2xl font-black text-white">USD {(res.precio || 0).toLocaleString()}</div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={() => handleDecision(res.id, true)} className="flex-1 h-12 rounded-xl bg-white text-black font-black hover:bg-zinc-200 transition-all">ME GUSTA</Button>
                    <Button onClick={() => handleDecision(res.id, false)} variant="outline" className="h-12 w-12 rounded-xl border-white/10 hover:bg-red-500/10 hover:text-red-500 transition-all group/btn">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ÁREA DE REPROMPT EMPÁTICO */}
      {ucm.frustrationStreak >= 3 && (
        <div className="w-full max-w-2xl p-8 bg-indigo-900/20 border border-indigo-500/30 rounded-3xl mb-12 animate-in zoom-in duration-500">
          <div className="flex items-start gap-4">
            <RefreshCw className="h-6 w-6 text-indigo-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-indigo-300">Quiero entenderte mejor</h3>
              <p className="text-sm text-indigo-200/70 mt-1 leading-relaxed">
                Siento que todavía no estamos llegando justo a lo que buscás... ¿Querés contarme qué sentís que falta o qué cambiarías?
              </p>
              <div className="mt-4 flex gap-3">
                <input 
                  placeholder="Ej: Busco algo más rústico, con menos cemento..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleProcess((e.target as HTMLInputElement).value)}
                />
                <Button variant="outline" className="border-indigo-500/30 text-indigo-300">Ajustar</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Button 
        onClick={() => { localStorage.removeItem('crushome_ucm_enterprise_v2'); window.location.reload(); }}
        className="fixed bottom-8 right-8 bg-black/40 border border-white/10 text-zinc-500 hover:text-white transition-colors"
      >
        Reiniciar Perfil
      </Button>
    </div>
  );
}
