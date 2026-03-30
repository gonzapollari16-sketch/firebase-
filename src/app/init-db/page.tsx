'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase/provider';
import { useCore } from '@/core/use-core';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { tenant } = useCore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleInitialize = async () => {
    const tenantId = tenant?.id;
    if (!firestore || !user || !tenantId) {
      toast({ 
        variant: 'destructive', 
        title: 'Error de Contexto', 
        description: 'No se detectó una organización activa. Por favor, asegúrese de haber completado el registro.' 
      });
      return;
    }

    setLoading(true);
    setProgress(10);

    try {
      const propertiesRef = collection(firestore, 'tenants', tenantId, 'properties');

      const demoProperties = [
        {
          titulo: "Penthouse de Lujo en Puerto Madero",
          descripcion: "Vista panorámica al río, 4 suites, acabados de mármol.",
          precio: 2500000,
          ubicacion: "Puerto Madero, CABA",
          tipo: "Venta",
          destacado: true,
          imagen: "1",
          createdAt: serverTimestamp()
        },
        {
          titulo: "Loft Industrial en Palermo Soho",
          descripcion: "Ideal para estudio creativo, techos altos, mucha luz.",
          precio: 450000,
          ubicacion: "Palermo, CABA",
          tipo: "Venta",
          destacado: true,
          imagen: "2",
          createdAt: serverTimestamp()
        },
        {
          titulo: "Residencia Moderna en Nordelta",
          descripcion: "Seguridad 24hs, piscina, salida al lago.",
          precio: 1200000,
          ubicacion: "Tigre, Buenos Aires",
          tipo: "Venta",
          destacado: false,
          imagen: "3",
          createdAt: serverTimestamp()
        }
      ];

      setProgress(40);
      for (const prop of demoProperties) {
        await addDoc(propertiesRef, prop);
      }

      setProgress(100);
      toast({ title: 'Éxito', description: 'Base de datos inicializada con propiedades de prueba.' });
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#07081a] p-4 text-white">
      <div className="max-w-md w-full text-center p-10 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
          Sincronizar Datos
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-8 leading-relaxed">
          Inyectar infraestructura demo en el Motor de Intención Semántica
        </p>
        
        <Button 
          onClick={handleInitialize}
          disabled={loading}
          className="w-full h-14 bg-gradient-to-r from-accent to-indigo-600 rounded-2xl font-black text-white hover:scale-[1.02] transition-all shadow-lg shadow-accent/20"
        >
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'INICIALIZAR INSTANCIA'}
        </Button>

        {loading && (
          <div className="mt-8 space-y-2">
            <Progress value={progress} className="h-1 bg-white/10" />
            <p className="text-[10px] font-black uppercase text-accent tracking-widest animate-pulse">
              Procesando Nodos Bio-Digitales... {progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

