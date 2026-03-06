'use client';

import React, { useState, useEffect } from 'react';
import { useCore } from '@/core/use-core';
import { 
  Globe, 
  Zap, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  ArrowRight,
  RefreshCw,
  Plus,
  CloudLightning,
  Settings,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { getPortalStatus, runSyndication, type PortalConnection } from './actions';

/**
 * @fileOverview Syndication Hub - Client Component.
 * Orquesta la visualización de la red de difusión con feedback en tiempo real.
 */
export default function SyndicationHubPage() {
  const { tenant, plan, hasFeature } = useCore();
  const [portals, setPortals] = useState<PortalConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (tenant?.id) {
      loadData();
    }
  }, [tenant?.id]);

  const loadData = async () => {
    if (!tenant?.id) return;
    setLoading(true);
    const status = await getPortalStatus(tenant.id);
    setPortals(status);
    setLoading(false);
  };

  const handleGlobalSync = async () => {
    if (!hasFeature('syndication:portals')) {
      toast({
        variant: "destructive",
        title: "Plan insuficiente",
        description: "La sincronización masiva requiere plan PREMIUM o superior."
      });
      return;
    }

    setSyncing(true);
    toast({ title: "Sincronizando...", description: "Conectando con todos los canales activos." });
    
    const result = await runSyndication(tenant?.id || 'default');
    
    if (result.success) {
      toast({ title: "Sincronización en curso", description: "El proceso se está ejecutando en segundo plano." });
    } else {
      toast({ variant: 'destructive', title: "Falla de red", description: result.error });
    }
    
    setSyncing(false);
    loadData();
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-white/20">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Inicializando Red de Difusión</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Globe className="text-accent w-10 h-10" />
            DIFUSIÓN & SINDICACIÓN
          </h1>
          <p className="text-muted-foreground mt-1">Gestión omnicanal de inventario y presencia en portales.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/"><Button variant="outline" className="border-white/10">Dashboard</Button></Link>
          <Button onClick={handleGlobalSync} disabled={syncing} className="bg-accent text-white font-bold shadow-xl shadow-accent/20">
            <RefreshCw className={`mr-2 w-4 h-4 ${syncing ? 'animate-spin' : ''}`} /> Sincronización Masiva
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-4 space-y-8">
          <Card className="bg-white/[0.03] border-white/10 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-pink-500" />
            <CardHeader>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estado de la Red</span>
                <Badge variant="outline" className="border-green-500/50 text-green-400">ONLINE</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-6xl font-black tracking-tighter text-white">98<span className="text-2xl text-accent">%</span></span>
                <span className="text-sm font-bold text-accent">HEALTH SCORE</span>
              </div>
              <div className="space-y-2">
                <Progress value={98} className="h-1 bg-white/5" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
              <CloudLightning className="w-4 h-4" /> Inteligencia de Salida
            </h3>
            <Card className="bg-white/[0.02] border-white/5 hover:bg-white/[0.05] transition-colors cursor-pointer group">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">WhatsApp Business</h4>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Smart Feed Activo</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-accent" />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portals.map(portal => (
              <Card key={portal.id} className={`bg-white/[0.03] border-white/10 hover:border-accent/30 transition-all group ${portal.status === 'error' ? 'border-red-500/30' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-white leading-tight">{portal.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${portal.status === 'connected' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 animate-pulse'}`} />
                        <span className="text-[10px] font-black uppercase text-white/40">{portal.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-white">{portal.properties}</div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold">Propiedades</p>
                    </div>
                  </div>
                  
                  {portal.error && (
                    <div className="mb-4 p-2 rounded bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-bold flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3" /> {portal.error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-muted-foreground">Integridad de Datos</span>
                      <span className={portal.health > 0.9 ? 'text-green-400' : 'text-yellow-400'}>{Math.round(portal.health * 100)}%</span>
                    </div>
                    <Progress value={portal.health * 100} className="h-1 bg-white/5" />
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Button size="sm" variant="ghost" className="h-8 flex-1 text-[10px] font-black uppercase text-muted-foreground hover:text-white border border-white/5">
                      <BarChart3 className="w-3 h-3 mr-1.5" /> Métricas
                    </Button>
                    <Button size="sm" className="h-8 flex-1 text-[10px] font-black uppercase px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white">
                      <RefreshCw className="w-3 h-3 mr-1.5" /> Re-sync
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
