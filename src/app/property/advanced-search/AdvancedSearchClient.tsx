'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Filters from '@/components/filters';
import PropertyCard from '@/components/property-card';
import { properties as mockProperties } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, SlidersHorizontal, MapPin } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * @fileOverview Componente Cliente para Búsqueda Avanzada.
 * Contiene la lógica de filtros y resultados que dependen de hooks de cliente.
 */
export default function AdvancedSearchClient() {
  const [results, setResults] = useState(mockProperties);
  const methods = useForm({
    defaultValues: {
      operacion: 'Venta',
      tipo: 'Departamento',
      provincia: '',
      ciudad: '',
      barrio: '',
      precioMin: '',
      precioMax: '',
      moneda: 'USD'
    }
  });

  const getImageUrl = (property: any) => {
    const placeholder = PlaceHolderImages.find(img => img.id === property.imagen);
    return placeholder?.imageUrl || `https://picsum.photos/seed/${property.id}/800/600`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic">BÚSQUEDA AVANZADA</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-white/20">Filtros técnicos y ubicación precisa</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PANEL DE FILTROS Y MINI MAPA */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-[#151737]/40 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-black uppercase tracking-widest">Filtros de Búsqueda</h3>
            </div>
            
            <FormProvider {...methods}>
              <div className="space-y-6">
                <Filters />
                <Button className="w-full bg-accent text-white font-black rounded-xl h-12 shadow-lg shadow-accent/20">
                  APLICAR FILTROS
                </Button>
              </div>
            </FormProvider>
          </div>

          <div className="p-6 rounded-[2rem] bg-accent/5 border border-accent/10">
            <div className="flex items-center gap-3 mb-2 text-accent">
              <MapPin className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Inteligencia de Zona</span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed italic">
              El mini mapa utiliza el Geographic Engine para normalizar barrios y detectar hotspots de demanda en tiempo real.
            </p>
          </div>
        </aside>

        {/* RESULTADOS */}
        <main className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center px-4">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
              Mostrando {results.length} propiedades encontradas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property as any} 
                imageUrl={getImageUrl(property)} 
              />
            ))}
          </div>

          {results.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/10 text-white/20">
              <Search className="h-12 w-12 mb-4 opacity-20" />
              <p className="italic font-medium">No se encontraron propiedades con estos filtros.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}