'use client';
import Image from 'next/image';
import PropertyCard from './property-card';
import type { Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Sliders, Shuffle } from 'lucide-react';
import { Button } from './ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type Props = {
  properties: Property[];
};


export default function Dashboard({ properties }: Props) {

  const getImageUrl = (property: any) => {
    const placeholder = PlaceHolderImages.find(img => img.id === property.imagen);
    return placeholder?.imageUrl || `https://picsum.photos/seed/${property.id}/800/600`;
  };

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-1');

  const featuredProperties = properties.filter(p => p.destacado);
  const suggestedProperties = properties.filter(p => !p.destacado);

  return (
    <div className="p-4 sm:p-6">
        <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6">
            {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h1 className="text-5xl font-black text-white">Tu Crush Inmobiliario</h1>
            </div>
        </div>

        <section className="properties-section mb-12">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Crushes Destacados</h2>
              <p className="text-muted-foreground">Seleccionados especialmente para vos</p>
            </div>
            <div className="flex gap-2">
              <Button variant='secondary'><Sliders className="mr-2"/> Ajustar</Button>
              <Button variant='secondary'><Shuffle className="mr-2"/> Reordenar</Button>
            </div>
          </div>

          {featuredProperties.length > 0 ? (
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {featuredProperties.map(property => (
                  <CarouselItem key={property.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <PropertyCard 
                        property={property} 
                        imageUrl={getImageUrl(property)}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="text-center py-10 bg-card rounded-lg">
                <p className="text-muted-foreground">No se encontraron propiedades destacadas.</p>
            </div>
          )}
        </section>

        <section className="properties-section">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Propiedades sugeridas para vos</h2>
            <p className="text-muted-foreground">Basado en tus últimas búsquedas y perfil</p>
          </div>

          {suggestedProperties.length > 0 ? (
             <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {suggestedProperties.map(property => (
                  <CarouselItem key={property.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <PropertyCard 
                        key={property.id} 
                        property={property} 
                        imageUrl={getImageUrl(property)}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="text-center py-10 bg-card rounded-lg">
                <p className="text-muted-foreground">No hay sugerencias por el momento.</p>
            </div>
          )}
        </section>
      </div>
  );
}
