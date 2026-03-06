'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GeographicEngine } from '@/core/geo/geographic-engine';
import { Search, MapPin, Loader2 } from 'lucide-react';
import type { Filters } from '@/lib/types';

declare const L: any;

type Suggestion = {
    display_name: string;
    lat: string;
    lon: string;
    address: any;
};

interface IntelligentLocationFilterProps {
    onFilterChange?: (filterName: keyof Filters, value: unknown) => void;
}

export default function IntelligentLocationFilter({ onFilterChange }: IntelligentLocationFilterProps) {
    const formContext = useFormContext();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerInstanceRef = useRef<any>(null);
    
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isSearching, setIsRecording] = useState(false);
    const [localGeo, setLocalGeo] = useState({ provincia: '', ciudad: '', barrio: '' });

    const updateFields = useCallback((data: { provincia: string, ciudad: string, barrio: string, lat?: number, lng?: number }) => {
        const normalized = GeographicEngine.normalize(data);
        setLocalGeo(normalized);

        if (formContext) {
            formContext.setValue('provincia', normalized.provincia);
            formContext.setValue('ciudad', normalized.ciudad);
            formContext.setValue('barrio', normalized.barrio);
            if (data.lat) formContext.setValue('lat', data.lat);
            if (data.lng) formContext.setValue('lng', data.lng);
        }

        if (onFilterChange) {
            onFilterChange('provincia', normalized.provincia);
            onFilterChange('ciudad', normalized.ciudad);
            onFilterChange('barrio', normalized.barrio);
        }
    }, [formContext, onFilterChange]);

    useEffect(() => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      
      const initializeMap = () => {
        if (mapInstanceRef.current) return;
        const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([-34.61, -58.38], 12);
        mapInstanceRef.current = map;
        const marker = L.marker([-34.61, -58.38], { draggable: true }).addTo(map);
        markerInstanceRef.current = marker;
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OSM" }).addTo(map);
        
        marker.on('dragend', async (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          reverseGeocode(lat, lng);
        });

        map.on("click", async (e: any) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          reverseGeocode(lat, lng);
        });
      };

      const reverseGeocode = async (lat: number, lng: number) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=es`);
          const data = await res.json();
          const addr = data.address || {};
          updateFields({
            provincia: addr.state || '',
            ciudad: addr.city || addr.town || addr.village || '',
            barrio: addr.neighbourhood || addr.suburb || addr.quarter || '',
            lat,
            lng
          });
        } catch (e) {
          console.error("Reverse geocoding failed", e);
        }
      };

      const leafletInterval = setInterval(() => {
        if (typeof L !== 'undefined' && L) {
          clearInterval(leafletInterval);
          initializeMap();
        }
      }, 100);
      
      return () => {
        clearInterval(leafletInterval);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, [updateFields]);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value;
        if (q.length < 3) {
            setSuggestions([]);
            return;
        }
        setIsRecording(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(q + ", Argentina")}&accept-language=es&addressdetails=1`);
          const data = await res.json();
          setSuggestions(data);
        } finally {
          setIsRecording(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Buscar Ubicación</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input 
                      ref={searchInputRef} 
                      placeholder="Ej: Av. Libertador 1500, CABA" 
                      onChange={handleSearch}
                      className="pl-10 bg-black/40 border-white/10 h-11"
                  />
                  {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-accent" />}
                </div>
                
                {suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-[#151737] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {suggestions.map((s, i) => (
                            <div 
                                key={i} 
                                className="p-3 text-xs hover:bg-accent/20 cursor-pointer flex items-center gap-3 border-b border-white/5 last:border-0"
                                onClick={() => {
                                    setSuggestions([]);
                                    const lat = parseFloat(s.lat);
                                    const lng = parseFloat(s.lon);
                                    mapInstanceRef.current?.setView([lat, lng], 16);
                                    markerInstanceRef.current?.setLatLng([lat, lng]);
                                    updateFields({
                                        provincia: s.address?.state || '',
                                        ciudad: s.address?.city || s.address?.town || s.address?.village || '',
                                        barrio: s.address?.neighbourhood || s.address?.suburb || s.address?.quarter || '',
                                        lat,
                                        lng
                                    });
                                    if(searchInputRef.current) searchInputRef.current.value = s.display_name;
                                }}
                            >
                                <MapPin className="h-3 w-3 text-accent" />
                                <span className="truncate">{s.display_name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="text-[9px] uppercase font-black text-accent mb-1 tracking-widest">Zona Detectada</div>
                    <div className="text-xs font-bold text-white">
                        {localGeo.barrio ? `${localGeo.barrio}, ` : ''}
                        {localGeo.ciudad ? `${localGeo.ciudad}, ` : ''}
                        {localGeo.provincia || 'Esperando ubicación...'}
                    </div>
                </div>
            </div>

            <div ref={mapContainerRef} className="h-48 w-full rounded-xl border border-white/10 grayscale brightness-75 hover:grayscale-0 transition-all duration-500" />
            <div className="text-[10px] text-muted-foreground italic leading-tight">
                * Hacé clic en el mapa o arrastrá el pin para ajustar la ubicación exacta.
            </div>
        </div>
    );
}
