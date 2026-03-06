'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase/provider';
import { collection, query, DocumentData, CollectionReference } from 'firebase/firestore';
import type { Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Pencil, Trash2, Eye } from 'lucide-react';
import { useCore } from '@/core/use-core';

function PropertyCard({ property }: { property: Property }) {
  const imageUrl = PlaceHolderImages.find(p => p.id === property.imagen)?.imageUrl || `https://picsum.photos/seed/${property.id}/600/400`;
  const status = property.operacion || 'Venta';
  
  const getStatusVariant = () => {
    switch (status.toLowerCase()) {
      case 'vendida': return 'destructive';
      case 'alquilada': return 'destructive';
      case 'reservada': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={property.titulo}
            fill
            className="object-cover rounded-t-lg"
            data-ai-hint={property.imageHint}
          />
           <Badge variant={getStatusVariant()} className="absolute top-2 right-2">{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1">{property.titulo}</CardTitle>
        <CardDescription>{property.barrio}, {property.ciudad}</CardDescription>
        <p className="text-xl font-bold text-primary mt-2">
          {new Intl.NumberFormat('es-AR', { style: 'currency', currency: property.moneda || 'USD', minimumFractionDigits: 0 }).format(property.precio)}
        </p>
        <div className="text-sm text-muted-foreground mt-2">
            {property.ambientes} amb. &bull; {property.banos} {parseInt(property.banos || '1') > 1 ? 'baños' : 'baño'} &bull; {property.metros} m²
        </div>
      </CardContent>
      <CardFooter className="p-4 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Pencil className="mr-2 h-4 w-4" /> Editar
        </Button>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function MyPropertiesPage() {
  const { user, isUserLoading } = useUser();
  const { tenant } = useCore();
  const firestore = useFirestore();

  // Consulta Scoped - Targetea el tenant del usuario
  const propertiesRef = useMemoFirebase(() => {
    if (user && firestore && tenant?.id) {
      return collection(firestore, 'tenants', tenant.id, 'properties');
    }
    return null;
  }, [user, firestore, tenant?.id]);

  const { data: properties, isLoading: arePropertiesLoading } = useCollection<Property>(propertiesRef as CollectionReference<DocumentData> | null);

  const isLoading = isUserLoading || arePropertiesLoading;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mis Propiedades</h1>
          <p className="text-muted-foreground">Gestioná el inventario de tu organización.</p>
        </div>
        <div className="flex gap-2">
             <Link href="/" passHref>
                <Button variant="outline">Volver al Dashboard</Button>
            </Link>
            <Link href="/property/add" passHref>
                <Button>+ Nueva Propiedad</Button>
            </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg border border-dashed">
          <h2 className="text-xl font-semibold">No hay inventario cargado</h2>
          <p className="text-muted-foreground mt-2 mb-4">Empezá a cargar propiedades para tu tenant.</p>
          <Link href="/property/add" passHref>
            <Button>Cargar Propiedad</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
