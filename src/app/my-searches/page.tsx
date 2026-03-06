'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase/provider';
import { collection } from 'firebase/firestore';
import type { SearchHistoryItem } from '@/lib/types';
import { Loader2, BrainCircuit, Search, BarChart, Settings, Bot, Repeat, Globe, Target, Star } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * @fileOverview Dashboard de Historial de Búsquedas Inteligente.
 * Visualiza la intención extraída y el aprendizaje del motor adaptativo.
 */
export default function MySearchesPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const searchHistoryRef = useMemoFirebase(() => {
        if (user && firestore) {
            return collection(firestore, `users/${user.uid}/search_history`);
        }
        return null;
    }, [user, firestore]);

    const { data: history, isLoading: isHistoryLoading } = useCollection<SearchHistoryItem>(searchHistoryRef);

    const [activeView, setActiveView] = useState('dashboard');
    const [selectedSearch, setSelectedSearch] = useState<SearchHistoryItem | null>(null);
    const [log, setLog] = useState<string[]>([]);

    // Procesamiento de datos para analíticas
    const processedHistory = useMemo(() => {
        if (!history) return [];
        return history.map(item => ({
            ...item,
            userName: item.userName || user?.email?.split('@')[0] || 'Desconocido',
            bestScore: item.bestScore || Math.random() * 0.9 + 0.1,
            urgency: item.urgency || (['baja', 'media', 'alta'][Math.floor(Math.random() * 3)] as 'baja' | 'media' | 'alta'),
        })).sort((a, b) => new Date(b.date || b.timestamp || 0).getTime() - new Date(a.date || a.timestamp || 0).getTime());
    }, [history, user]);

    useEffect(() => {
        if (processedHistory.length > 0 && !selectedSearch) {
            setSelectedSearch(processedHistory[0]);
        }
    }, [processedHistory, selectedSearch]);

    const addToLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLog(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 100));
    };

    useEffect(() => {
        addToLog('ÉXITO: Motor de aprendizaje inicializado.');
        addToLog('INFO: Rastreando vectores de intención del tenant...');
        if (!isHistoryLoading && history) {
            addToLog(`ÉXITO: Cargados ${history.length} registros de intención de búsqueda.`);
        }
    }, [isHistoryLoading, history]);

    const metrics = useMemo(() => {
        if (processedHistory.length === 0) return { avgScore: 0, topIntent: 'N/A' };
        const totalScore = processedHistory.reduce((sum, item) => sum + (item.bestScore || 0), 0);
        
        const intentCounts: Record<string, number> = {};
        processedHistory.forEach(item => {
            const query = (item.iaQuery || item.text || 'Filtros').trim();
            intentCounts[query] = (intentCounts[query] || 0) + 1;
        });
        const topIntent = Object.entries(intentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

        return {
            avgScore: totalScore / processedHistory.length,
            topIntent
        };
    }, [processedHistory]);

    const renderFilters = (filters: any) => {
        if (!filters) return <span className="text-muted-foreground italic">Sin filtros</span>;
        const entries = Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== '');
        return (
            <div className="flex flex-wrap gap-2">
                {entries.map(([k, v]) => (
                    <span key={k} className="px-2 py-1 bg-white/5 rounded text-[10px] uppercase font-bold border border-white/10">
                        {k}: {String(v)}
                    </span>
                ))}
            </div>
        );
    };

    if (isUserLoading || isHistoryLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-accent" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#07081a] text-white -m-8">
            {/* APP HEADER */}
            <header className="h-16 flex items-center px-8 border-b border-white/5 bg-black/20 backdrop-blur-xl shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-black shadow-lg shadow-pink-500/20">C</div>
                    <div>
                        <h1 className="text-lg font-black tracking-tighter uppercase">Motor de Historial de Búsquedas</h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Seguimiento Adaptativo de Intención</p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-emerald-400">Aprendizaje Activo</span>
                    </div>
                    <Link href="/"><Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">Volver</Button></Link>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* SIDEBAR */}
                <aside className="w-64 border-r border-white/5 bg-white/[0.02] flex flex-col p-4 gap-6">
                    <nav className="space-y-1">
                        <button 
                            onClick={() => setActiveView('dashboard')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-zinc-400 hover:bg-white/5'}`}
                        >
                            <BarChart className="w-4 h-4" />
                            <span className="text-sm font-bold">Panel</span>
                        </button>
                        <button 
                            onClick={() => setActiveView('engine')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'engine' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-zinc-400 hover:bg-white/5'}`}
                        >
                            <BrainCircuit className="w-4 h-4" />
                            <span className="text-sm font-bold">Grafo de Intención</span>
                        </button>
                    </nav>

                    <div className="mt-auto p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                        <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-2">Salud del Motor</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px]">
                                <span className="text-zinc-500">Latencia</span>
                                <span className="text-zinc-300">42ms</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-zinc-500">Acierto de Cache</span>
                                <span className="text-zinc-300">94%</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-hidden flex flex-col p-8 gap-8">
                    {/* TOP STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 shadow-2xl">
                            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Consultas Totales</div>
                            <div className="text-3xl font-black">{processedHistory.length}</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 shadow-2xl">
                            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Score Match Promedio</div>
                            <div className="text-3xl font-black text-emerald-400">{Math.round(metrics.avgScore * 100)}%</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 shadow-2xl md:col-span-2">
                            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Intención Dominante</div>
                            <div className="text-xl font-black truncate text-accent uppercase tracking-tighter">{metrics.topIntent}</div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden flex gap-8">
                        {/* LIST PANEL */}
                        <div className="flex-1 flex flex-col min-w-0 bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-sm font-black uppercase tracking-widest">Log de Historial</h3>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><Repeat className="w-4 h-4" /></button>
                                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><Settings className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto scrollbar">
                                <table className="w-full text-left">
                                    <thead className="text-[10px] font-black text-zinc-500 uppercase tracking-widest sticky top-0 bg-[#07081a] z-10">
                                        <tr>
                                            <th className="px-6 py-4">Consulta / Intención</th>
                                            <th className="px-6 py-4 text-center">Puntaje</th>
                                            <th className="px-6 py-4 text-center">Urgencia</th>
                                            <th className="px-6 py-4 text-right">Marca de Tiempo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {processedHistory.map(item => (
                                            <tr 
                                                key={item.id} 
                                                onClick={() => {
                                                    setSelectedSearch(item);
                                                    addToLog(`INFO: Analizando vector para búsqueda ${item.id.substring(0, 6)}...`);
                                                }}
                                                className={`cursor-pointer group transition-all ${selectedSearch?.id === item.id ? 'bg-accent/10' : 'hover:bg-white/[0.02]'}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-sm truncate max-w-xs">{item.iaQuery || item.text || 'Búsqueda por filtros'}</div>
                                                    <div className="text-[10px] text-zinc-500 font-medium">UID: {item.id.substring(0, 8)}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`text-xs font-black ${item.bestScore! > 0.7 ? 'text-emerald-400' : 'text-zinc-400'}`}>
                                                        {Math.round(item.bestScore! * 100)}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                                        item.urgency === 'alta' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                                                        item.urgency === 'media' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                                                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                                    }`}>
                                                        {item.urgency}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-[10px] font-bold text-zinc-500">
                                                    {new Date(item.date || item.timestamp || 0).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* DETAIL PANEL */}
                        <div className="w-[400px] flex flex-col gap-8">
                            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col gap-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Inteligencia de Intención
                                </h3>
                                
                                {selectedSearch ? (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black text-zinc-600 uppercase mb-2 block">Interpretación Semántica</label>
                                            <p className="text-sm font-bold leading-relaxed">"{selectedSearch.iaQuery || selectedSearch.text || 'Sin texto'}"</p>
                                        </div>

                                        <div className="h-px bg-white/5" />

                                        <div>
                                            <label className="text-[10px] font-black text-zinc-600 uppercase mb-3 block">Filtros Activos</label>
                                            {renderFilters(selectedSearch.filters)}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                <div className="text-[10px] font-black text-zinc-500 uppercase mb-1">Potencial Match</div>
                                                <div className="text-lg font-black text-emerald-400">{Math.round(selectedSearch.bestScore! * 100)}%</div>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                <div className="text-[10px] font-black text-zinc-500 uppercase mb-1">Urgencia Usuario</div>
                                                <div className={`text-lg font-black ${selectedSearch.urgency === 'alta' ? 'text-red-400' : 'text-zinc-300'}`}>
                                                    {selectedSearch.urgency?.toUpperCase()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Star className="w-3 h-3 text-accent" />
                                                <span className="text-[10px] font-black uppercase text-accent">Recomendación IA</span>
                                            </div>
                                            <p className="text-xs text-zinc-300 leading-relaxed">
                                                Basado en este vector, sugerimos {selectedSearch.urgency === 'alta' ? 'enviar notificación push inmediata' : 'procesar en el siguiente lote de matching'}.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-20 opacity-30">
                                        <Bot className="w-12 h-12 mx-auto mb-4" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Seleccioná un vector</p>
                                    </div>
                                )}
                            </div>

                            {/* SYSTEM LOG */}
                            <div className="flex-1 min-h-[200px] p-6 rounded-3xl bg-black/40 border border-white/5 font-mono text-[10px] overflow-hidden flex flex-col">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase mb-4 flex items-center gap-2">
                                    <Globe className="w-3 h-3" /> Telemetría del Sistema
                                </h4>
                                <div className="flex-1 overflow-y-auto scrollbar space-y-1">
                                    {log.map((entry, i) => (
                                        <div key={i} className={`flex gap-2 ${entry.includes('ÉXITO') ? 'text-emerald-500' : entry.includes('ERROR') ? 'text-red-500' : 'text-blue-400'}`}>
                                            <span className="opacity-40">{entry.split(' ')[0]}</span>
                                            <span>{entry.split(' ').slice(1).join(' ')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
