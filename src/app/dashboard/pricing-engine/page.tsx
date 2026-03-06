'use client';

import React, { useState } from 'react';
import { useCore } from '@/core/use-core';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { collection, query, orderBy } from 'firebase/firestore';
import { 
  Calculator, 
  Target, 
  History, 
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

/**
 * @fileOverview Dashboard de Pricing Consolidado.
 * Punto de entrada único para la gestión de valores mediante Ridge Regression.
 */
export default function PricingEnginePage() {
  const { user, tenant, plan } = useCore();
  const firestore = useFirestore();
  const [calculatingId, setCalculatingId] = useState<string | null>(null);

  const propertiesRef = useMemoFirebase(() => {
    if (!user || !firestore || !tenant?.id) return null;
    return query(collection(firestore, 'tenants', tenant.id, 'properties'), orderBy('createdAt', 'desc'));
  }, [user, firestore, tenant?.id]);

  const { data: properties, isLoading: propsLoading } = useCollection(propertiesRef as any);

  const handleRunModel = async (prop: any) => {
    setCalculatingId(prop.id);
    try {
      const res = await fetch('/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: prop.id,
          tenantId: tenant?.id,
          userId: user?.uid,
          metros: prop.supTotal || 50,
          barrio: prop.barrio,
          tipo: prop.tipo,
          ambientes: prop.ambientes
        })
      });

      const result = await res.json();
      if (result.error) throw new Error(result.error);

      toast({
        title: "Inferencia Completada",
        description: `Modelo ${result.algorithmVersion} estima USD ${result.recommendedPrice.toLocaleString()}`,
      });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error de Modelo', description: err.message });
    } finally {
      setCalculatingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic executive-gradient-text uppercase">Ridge Pricing Engine</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">ML Infrastructure • Versioned Inference</p>
        </div>
        <Button variant="outline" className="border-white/10" asChild><Link href="/">Dashboard</Link></Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricTile label="Precisión R²" value="88%" icon={Target} color="text-emerald-400" />
        <MetricTile label="Regularización" value="α=0.8" icon={ShieldCheck} color="text-pink-400" />
        <MetricTile label="Modelo Activo" value="Ridge-v1" icon={History} color="text-violet-400" />
      </div>

      <Card className="bg-[#151737]/40 border-white/5 rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5">
          <CardTitle className="text-xl font-bold italic">Inventario para Valuación</CardTitle>
          <CardDescription className="text-xs uppercase font-black text-white/20">Ejecutar inferencia estadística sobre activos del tenant</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-white/5">
            {properties?.map((prop: any) => (
              <div key={prop.id} className="p-6 flex justify-between items-center group hover:bg-white/[0.02] transition-all">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{prop.titulo}</h4>
                    <p className="text-[10px] text-white/30 uppercase">{prop.barrio} • {prop.tipo}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleRunModel(prop)}
                  disabled={calculatingId === prop.id}
                  className="bg-white/5 hover:bg-accent hover:text-black font-black uppercase text-[10px] rounded-xl h-10 px-6"
                >
                  {calculatingId === prop.id ? <RefreshCw className="animate-spin h-4 w-4" /> : "Ejecutar Ridge"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricTile({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl flex items-center gap-4">
      <div className={`p-3 rounded-2xl bg-white/5 ${color}`}><Icon className="h-5 w-5" /></div>
      <div>
        <div className="text-2xl font-black">{value}</div>
        <div className="text-[10px] font-black uppercase text-white/20">{label}</div>
      </div>
    </div>
  );
}
