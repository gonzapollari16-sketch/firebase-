'use client';
import { useState, useEffect } from "react";
import Image from 'next/image';
import type { Property } from "@/lib/types";

type Props = {
  property: Property;
  imageUrl: string;
};

const getValidCurrencyCode = (code?: string): string => {
  if (!code) return 'USD';
  const upperCode = code.toUpperCase();
  if (upperCode.includes('U$S') || upperCode.includes('USD')) {
    return 'USD';
  }
  if (upperCode.includes('ARS') || upperCode.includes('$')) {
    return 'ARS';
  }
  return 'USD';
}

export default function PropertyCard({ property, imageUrl }: Props) {
  const [formattedPrice, setFormattedPrice] = useState<string | number>(property.precio);

  useEffect(() => {
    try {
      const currencyCode = getValidCurrencyCode(property.moneda);
      const prefix = currencyCode === 'USD' ? 'U$S ' : '$ ';
      
      const formatted = new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(property.precio);

      setFormattedPrice(prefix + formatted);

    } catch (e) {
      setFormattedPrice(property.precio);
      console.error("Failed to format currency:", e);
    }
  }, [property.precio, property.moneda]);

  return (
    <div className="card bg-white/[0.03] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-accent/30 transition-all shadow-xl">
        <div className="relative h-56 bg-white/5 overflow-hidden">
            <Image 
                src={imageUrl} 
                alt={property.titulo} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                data-ai-hint={property.imageHint}
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
                {property.matchPercentage && (
                  <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-accent">
                    Match {property.matchPercentage}%
                  </span>
                )}
                {property.destacado && (
                  <span className="bg-accent text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-accent">
                    Oportunidad
                  </span>
                )}
            </div>
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl text-xl font-black text-white border border-white/10">
              {formattedPrice}
            </div>
        </div>
        <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold truncate group-hover:text-accent transition-colors">{property.titulo}</h3>
              <p className="text-xs text-white/40 font-medium uppercase tracking-widest mt-1">
                {property.tipo} en {property.barrio}
              </p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-sm font-black">{property.ambientes}</div>
                      <div className="text-[9px] uppercase font-bold text-white/30">Amb</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-black">{property.supTotal}</div>
                      <div className="text-[9px] uppercase font-bold text-white/30">m²</div>
                    </div>
                    {property.dormitorios > 0 && (
                      <div className="text-center">
                        <div className="text-sm font-black">{property.dormitorios}</div>
                        <div className="text-[9px] uppercase font-bold text-white/30">Dorm</div>
                      </div>
                    )}
                </div>
                <div className="text-[10px] font-black text-emerald-400 uppercase bg-emerald-400/10 px-2 py-1 rounded">
                  {property.operacion}
                </div>
            </div>
        </div>
    </div>
  );
}
