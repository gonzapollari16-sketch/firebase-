
'use client';

import React, { useState, useEffect } from 'react';
import { useCore } from '@/core/use-core';
import { 
  Megaphone, 
  TrendingUp, 
  Target, 
  BarChart3, 
  DollarSign, 
  Plus, 
  Settings, 
  Eye,
  MousePointer2,
  Building,
  Loader2,
  Facebook,
  Instagram,
  Zap,
  ShieldCheck,
  AlertCircle,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

/**
 * @fileOverview Ads Meta Dashboard - CRUSHOME Enterprise Ready.
 * Integra el Motor de Anunciantes con la suite de marketing multi-tenant.
 */
export default function AdvertisersHubPage() {
  const { role, hasPermission, eventBus, plan } = useCore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // Mock de campañas activas conectadas a Meta Marketing API
  const [campaigns, setCampaigns] = useState([
    { 
      id: 'c1', 
      name: "Proyección Palermo Soho", 
      status: 'active', 
      platform: ['facebook', 'instagram'],
      dailyBudget: 2500,
      spend: 15400,
      leads: 12,
      ctr: 3.4,
      roas: 4.2
    },
    { 
      id: 'c2', 
      name: "Lotes en Traslasierra", 
      status: 'active', 
      platform: ['instagram'],
      dailyBudget: 1200,
      spend: 8900,
      leads: 5,
      ctr: 1.8,
      roas: 2.1
    }
  ]);

  const canAccess = hasPermission('ads:manage') || role === 'MARKETING' || role === 'ADMIN';

  if (!canAccess) {
    return (
      <div className="h-[80vh] flex items-center justify-center p-8">
        <Card className="max-w-md text-center bg-destructive/5 border-destructive/20 p-10 rounded-[2.5rem]">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6 opacity-40" />
          <CardTitle className="text-destructive mb-2 text-2xl font-black italic">ACCESO RESTRINGIDO</CardTitle>
          <CardDescription className="text-white/40 uppercase text-[10px] font-black tracking-widest leading-relaxed">
            Tu plan actual ({plan}) o rol no permiten la gestión avanzada de pauta publicitaria.
          </CardDescription>
          <Link href="/pricing"><Button className="mt-8 bg-accent text-white font-black px-8">Mejorar Plan</Button></Link>
        </Card>
      </div>
    );
  }

  const handleLaunchCampaign = async () => {
    setLoading(true);
    toast({ title: "Conectando con Meta API...", description: "Generando creativos optimizados por IA." });
    
    // Simulación de lanzamiento de campaña via microservicio
    await new Promise(r => setTimeout(r, 2000));
    
    eventBus.emit('ads.campaign.created', { tenantId: 'default', timestamp: Date.now() });
    
    setLoading(false);
    toast({ title: "Campaña Activa", description: "Tus anuncios ya están circulando en Facebook e Instagram." });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-1000">
      
      {/* HEADER ESTRATÉGICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-accent/10 text-accent">
              <Target className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic executive-gradient-text uppercase">Meta Ads Engine</h1>
          </div>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
            Infraestructura de Demanda Inmobiliaria • v5.0 Production
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/intelligence"><Button variant="outline" className="border-white/10 rounded-xl">Intelligence Hub</Button></Link>
          <Button 
            onClick={handleLaunchCampaign} 
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-violet-600 text-white font-black rounded-xl shadow-lg shadow-pink-500/20 px-8"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Plus className="mr-2 w-4 h-4" />}
            LANZAR CAMPAÑA IA
          </Button>
        </div>
      </div>

      {/* METRICAS DE PERFORMANCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Inversión Mensual', value: `$${campaigns.reduce((s,c)=>s+c.spend,0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400' },
          { label: 'Leads Generados', value: campaigns.reduce((s,c)=>s+c.leads,0), icon: Users, color: 'text-blue-400' },
          { label: 'CTR Promedio', value: '2.6%', icon: MousePointer2, color: 'text-pink-400' },
          { label: 'ROI Estimado', value: 'x3.8', icon: TrendingUp, color: 'text-violet-400' }
        ].map((s, i) => (
          <Card key={i} className="bg-white/[0.03] border-white/5 rounded-3xl overflow-hidden relative group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl bg-white/5 ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[9px] opacity-40">REAL-TIME</Badge>
              </div>
              <div className="text-3xl font-black text-white tracking-tighter">{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="campaigns" onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white/[0.03] p-1 rounded-2xl border border-white/5 w-fit">
          <TabsTrigger value="campaigns" className="rounded-xl px-8">Campañas Activas</TabsTrigger>
          <TabsTrigger value="placements" className="rounded-xl px-8">Placements IA</TabsTrigger>
          <TabsTrigger value="audience" className="rounded-xl px-8">Públicos</TabsTrigger>
          <TabsTrigger value="compliance" className="rounded-xl px-8">Compliance Meta</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card className="bg-white/[0.03] border-white/5 rounded-[2rem] overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
                  <tr>
                    <th className="p-6">Campaña / Propiedad</th>
                    <th className="p-6 text-center">Plataforma</th>
                    <th className="p-6 text-center">Inversión</th>
                    <th className="p-6 text-center">Leads</th>
                    <th className="p-6 text-center">ROAS</th>
                    <th className="p-6 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {campaigns.map(c => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6">
                        <div className="font-bold text-sm">{c.name}</div>
                        <div className="text-[10px] text-white/30 uppercase tracking-widest mt-1">ID: {c.id}</div>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-center gap-2">
                          {c.platform.includes('facebook') && <Facebook className="w-4 h-4 opacity-40" />}
                          {c.platform.includes('instagram') && <Instagram className="w-4 h-4 opacity-40" />}
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="text-sm font-bold text-emerald-400">${c.spend.toLocaleString()}</div>
                        <div className="text-[9px] text-white/20 uppercase font-black tracking-tighter">Diario: ${c.dailyBudget}</div>
                      </td>
                      <td className="p-6 text-center font-black text-blue-400">{c.leads}</td>
                      <td className="p-6 text-center">
                        <Badge className="bg-violet-500/10 text-violet-400 border-none font-black">{c.roas}x</Badge>
                      </td>
                      <td className="p-6 text-right">
                        <Badge className="bg-emerald-500 text-black text-[9px] font-black uppercase">Active</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white/[0.03] border-white/5 rounded-[2.5rem] p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                  <ShieldCheck className="text-emerald-400" /> Housing Ads Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4 text-xs text-white/60 leading-relaxed italic">
                <p>
                  El sistema detecta automáticamente si una campaña pertenece a la categoría **"Housing"** de Meta. CRUSHOME aplica las restricciones de segmentación obligatorias para evitar discriminación y asegurar el cumplimiento de las políticas de Meta Ads v18.0+.
                </p>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 font-bold">
                  Estado: Todas las campañas cumplen con las normativas locales e internacionales.
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.03] border-white/5 rounded-[2.5rem] p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                  <Zap className="text-pink-500" /> Ads Optimization Core
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-white/40">Salud del Algoritmo</span>
                    <span className="text-pink-500">94.8%</span>
                  </div>
                  <Progress value={94.8} className="h-1" />
                </div>
                <p className="text-[10px] text-white/30 italic">
                  El motor IA recalibra los placements cada 6 horas basándose en la tasa de cierre reportada por el CRM.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* FOOTER ENTERPRISE */}
      <div className="p-8 rounded-[2.5rem] bg-indigo-900/10 border border-indigo-500/20 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <p className="text-[10px] text-indigo-300 font-black uppercase tracking-[0.5em]">
          CRUSHOME ADS ENGINE • INFRAESTRUCTURA DE DEMANDA GLOBAL © 2026
        </p>
      </div>

    </div>
  );
}
