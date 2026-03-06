
'use client';

import React, { useState } from 'react';
import { useCore } from '@/core/use-core';
import { 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Star, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Lock,
  CreditCard,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Página de Planes y Precios CRUSHOME ENTERPRISE.
 * Implementación de grado producción con calculadora de ROI.
 */
export default function PricingPage() {
  const { plan: currentPlan, role } = useCore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'FREE',
      name: 'Free Starter',
      price: 0,
      description: 'Ideal para agentes independientes que están empezando.',
      features: ['5 Propiedades activas', 'Búsqueda semántica básica', 'Marca de agua CRUSHOME', 'Soporte autogestionado'],
      color: 'border-white/10'
    },
    {
      id: 'PRO',
      name: 'Broker Pro',
      price: 49,
      recommended: true,
      description: 'Potencia tu inmobiliaria con automatización e IA.',
      features: ['Propiedades ilimitadas', 'WhatsApp Business API', 'CRM Avanzado', 'Filtro Geo inteligente', 'Reportes operativos'],
      color: 'border-accent shadow-accent/20'
    },
    {
      id: 'BUSINESS',
      name: 'Business Network',
      price: 129,
      description: 'Para equipos que necesitan dominar su zona.',
      features: ['Todo en Pro', 'Red Colaborativa (ICP)', 'Sindicación masiva', 'Ads Meta automáticos', 'Soporte prioritario'],
      color: 'border-pink-500/50 shadow-pink-500/10'
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise Core',
      price: 299,
      description: 'Acceso total al Kernel Cognitivo y APIs.',
      features: ['Todo en Business', 'White Label', 'Digital Twin del mercado', 'API Pública', 'Gobernanza de Datos'],
      color: 'border-violet-500 shadow-violet-500/20'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      
      {/* HEADER DE PRECIOS */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge className="bg-accent/20 text-accent font-black tracking-widest px-4 py-1 rounded-full text-[10px] uppercase">Modelos de Suscripción 2026</Badge>
        <h1 className="text-5xl font-black tracking-tighter italic executive-gradient-text uppercase">Planes y Precios</h1>
        <p className="text-white/40 text-lg leading-relaxed">
          Elegí la infraestructura necesaria para escalar tu operación inmobiliaria con la potencia del **Neural Core**.
        </p>
      </div>

      {/* SELECTOR DE CICLO */}
      <div className="flex justify-center">
        <div className="bg-white/5 p-1 rounded-2xl border border-white/5 flex gap-1">
          <Button 
            variant={billingCycle === 'monthly' ? 'default' : 'ghost'} 
            onClick={() => setBillingCycle('monthly')}
            className="rounded-xl px-8"
          >
            Mensual
          </Button>
          <Button 
            variant={billingCycle === 'yearly' ? 'default' : 'ghost'} 
            onClick={() => setBillingCycle('yearly')}
            className="rounded-xl px-8 relative"
          >
            Anual
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full">DTO 20%</span>
          </Button>
        </div>
      </div>

      {/* GRILLA DE PLANES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => (
          <Card key={p.id} className={cn(
            "bg-white/[0.03] border-2 flex flex-col transition-all duration-500 hover:scale-[1.02]",
            p.color,
            p.recommended && "bg-gradient-to-b from-accent/5 to-transparent"
          )}>
            <CardHeader className="space-y-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-black italic">{p.name}</CardTitle>
                {p.recommended && <Badge className="bg-accent text-white text-[8px] font-black uppercase">Recomendado</Badge>}
              </div>
              <CardDescription className="text-xs min-h-[40px] leading-relaxed">{p.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter">USD {billingCycle === 'monthly' ? p.price : Math.round(p.price * 0.8)}</span>
                <span className="text-white/20 text-xs font-bold uppercase">/ mes</span>
              </div>
              <ul className="space-y-3">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-medium text-white/60">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button 
                className={cn(
                  "w-full rounded-xl font-black uppercase text-xs h-12 tracking-widest",
                  p.id === currentPlan ? "bg-white/10 text-white/40 cursor-default" : 
                  p.recommended ? "bg-accent text-white shadow-xl shadow-accent/20" : "bg-white/5 text-white border border-white/10"
                )}
                disabled={p.id === currentPlan}
              >
                {p.id === currentPlan ? 'Tu Plan Actual' : 'Seleccionar Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* CALCULADORA DE ROI (Concepto Master Plan) */}
      <section className="bg-[#151737] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <TrendingUp className="h-64 w-64 text-accent" />
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tight italic uppercase">Calculadora de ROI Estratégico</h2>
            <p className="text-white/40 leading-relaxed">
              No es un gasto, es una inversión en infraestructura. Descubrí cuánto tiempo y dinero ahorrás utilizando la automatización neural de CRUSHOME.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-black/20 border border-white/5">
                <span className="text-xs font-bold uppercase text-white/60">Ahorro en Carga (Horas/Mes)</span>
                <span className="text-emerald-400 font-black">12.5 h</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-black/20 border border-white/5">
                <span className="text-xs font-bold uppercase text-white/60">Incremento en Conversión IA</span>
                <span className="text-accent font-black">+24%</span>
              </div>
            </div>
          </div>
          <Card className="bg-black/40 border-white/10 rounded-3xl p-8 text-center space-y-6">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Impacto Económico Estimado</div>
            <div className="text-6xl font-black tracking-tighter text-white">USD 1.450</div>
            <p className="text-xs italic text-white/40">Basado en una operación promedio de 10 listings/mes.</p>
            <Button className="w-full bg-white text-black font-black uppercase rounded-xl h-14">Optimizar mi Inversión</Button>
          </Card>
        </div>
      </section>

      {/* FAQ / SECURITY FOOTER */}
      <div className="p-8 rounded-[2.5rem] bg-indigo-900/10 border border-indigo-500/20 text-center">
        <div className="flex justify-center gap-8 mb-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Transacciones Cifradas
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40">
            <Zap className="h-4 w-4 text-accent" /> Activación Instantánea
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40">
            <Lock className="h-4 w-4 text-violet-400" /> Sin Contratos Forzados
          </div>
        </div>
        <p className="text-[10px] text-indigo-300 font-black uppercase tracking-[0.5em]">
          CRUSHOME OPERATING SYSTEM • BILLING KERNEL © 2026
        </p>
      </div>

    </div>
  );
}
