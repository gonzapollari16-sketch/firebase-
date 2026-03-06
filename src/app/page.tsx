'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCore } from '@/core/use-core';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { collection, query, orderBy, limit, type CollectionReference, type DocumentData } from 'firebase/firestore';
import { 
  Search, 
  Sparkles,
  Loader2,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthForm from '@/components/auth-form';
import PropertyCard from '@/components/property-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import type { Property } from '@/lib/types';

/**
 * @fileOverview Executive Dashboard - Principal Entry Point.
 * Renderizado Híbrido: Protegido por Auth y optimizado para multi-tenancy.
 */
export default function ExecutiveDashboard() {
  const router = useRouter();
  const { user, tenant, systemStatus } = useCore();
  const { isUserLoading } = useUser();
  const firestore = useFirestore();

  // Scoped query for the tenant's properties - Memoized to prevent SSR mismatches
  const propertiesRef = useMemoFirebase(() => {
    if (!user || !firestore || !tenant?.id) return null;
    return query(
      collection(firestore, 'tenants', tenant.id, 'properties'), 
      orderBy('createdAt', 'desc'),
      limit(10)
    ) as unknown as CollectionReference<DocumentData>;
  }, [user, firestore, tenant?.id]);

  const { data: properties, isLoading: propsLoading } = useCollection<Property>(propertiesRef as any);

  const getImageUrl = (property: Property) => {
    const placeholder = PlaceHolderImages.find(img => img.id === property.imagen);
    return placeholder?.imageUrl || `https://picsum.photos/seed/${property.id}/800/600`;
  };

  const featuredProperties = (properties || []).filter(p => p.destacado);

  if (isUserLoading || systemStatus === 'maintenance') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07081a] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Sincronizando Cerebro Neural</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#07081a]">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      
      {/* SECCIÓN DE BÚSQUEDA COGNITIVA */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-violet-600 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
        <div className="relative bg-[#151737] border border-white/10 rounded-[2rem] p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-accent/20 text-accent">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black italic tracking-tight uppercase">CRUSHIA SEARCH</h2>
              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30">Motor de Intención Semántica v5.0</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
              <input 
                placeholder="Describí el hogar de tus sueños (ej: 'Busco un loft luminoso con terraza en Palermo')..." 
                className="w-full h-14 pl-12 pr-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-accent/50 transition-all text-sm font-medium text-white"
                onKeyDown={(e) => e.key === 'Enter' && router.push('/property/search')}
              />
            </div>
            <div className="flex gap-3">
              <Button className="h-14 px-8 bg-accent text-white font-black rounded-2xl hover:scale-105 transition-transform" asChild>
                <Link href="/property/search">ANALIZAR DESEO</Link>
              </Button>
              <Button variant="outline" className="h-14 px-6 border-white/10 rounded-2xl hover:bg-white/5" asChild>
                <Link href="/property/advanced-search"><Filter className="mr-2 h-5 w-5" /> FILTROS</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CARRUSEL DE DESTACADOS */}
      <section className="space-y-6">
        <div className="flex justify-between items-end px-2">
          <div>
            <h2 className="text-3xl font-black italic tracking-tight uppercase">CRUSHES DESTACADOS</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-white/20">Propiedades con alto score de liquidez en {tenant?.name}</p>
          </div>
        </div>

        {propsLoading ? (
          <div className="h-64 flex flex-col items-center justify-center bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/10 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-white/20" />
            <p className="text-[9px] font-black uppercase text-white/10 tracking-widest">Recuperando Inventario</p>
          </div>
        ) : (
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {featuredProperties.length > 0 ? featuredProperties.map(property => (
                <CarouselItem key={property.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <PropertyCard property={property} imageUrl={getImageUrl(property)} />
                </CarouselItem>
              )) : (
                <div className="w-full flex flex-col items-center justify-center py-20 bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/10 opacity-30 italic">
                  <p>No hay propiedades destacadas para esta organización.</p>
                  <Link href="/property/add" className="mt-4 text-accent not-italic font-black text-xs uppercase tracking-widest hover:underline">Cargar mi primera propiedad</Link>
                </div>
              )}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        )}
      </section>
    </div>
  );
}
