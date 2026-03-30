'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase/provider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { DuplicateDetector } from '@/core/deduplication/detector';
import { DuplicatePropertyWarning } from '@/components/duplicate-property-warning';
import { DuplicateResult } from '@/core/deduplication/types';
import IntelligentLocationFilter from '@/components/intelligent-location-filter';
import { cn } from '@/lib/utils';
import { Loader2, ArrowLeft, Building, DollarSign, MapPin, AlertCircle } from 'lucide-react';
import { useCore } from '@/core/use-core';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Property, PropertyStatus } from '@/lib/types';

interface PropertyFormValues {
  titulo: string;
  descripcion: string;
  tipo: string;
  operacion: string;
  precio: string;
  moneda: string;
  expensas: string;
  provincia: string;
  ciudad: string;
  barrio: string;
  calle: string;
  numero: string;
  piso: string;
  unidad: string;
  lat: number | null;
  lng: number | null;
  supTotal: string;
  supCubierta: string;
  ambientes: string;
  dormitorios: string;
  banos: string;
  cochera: boolean;
  aptoCredito: boolean;
  escritura: boolean;
  pozo: boolean;
  aEstrenar: boolean;
  destacado: boolean;
}

export default function PropertyAddPage() {
  const router = useRouter();
  const { user } = useUser();
  const { tenant, eventBus } = useCore();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateResult | null>(null);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [selectedPlaceholder, setSelectedPlaceholder] = useState(PlaceHolderImages[0].id);

  const methods = useForm<PropertyFormValues>({
    defaultValues: {
      titulo: '',
      descripcion: '',
      tipo: 'Departamento',
      operacion: 'Venta',
      precio: '',
      moneda: 'USD',
      expensas: '',
      provincia: '',
      ciudad: '',
      barrio: '',
      calle: '',
      numero: '',
      piso: '',
      unidad: '',
      lat: null, 
      lng: null,
      supTotal: '',
      supCubierta: '',
      ambientes: '1',
      dormitorios: '0',
      banos: '1',
      cochera: false,
      aptoCredito: false,
      escritura: true,
      pozo: false,
      aEstrenar: false,
      destacado: false
    }
  });

  const globalPropertiesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'properties'); // Colección global para detección de duplicados
  }, [db]);
  const { data: existingProperties } = useCollection<Property>(globalPropertiesQuery);

  const onSubmit = async (data: PropertyFormValues) => {
    if (!user || !tenant?.id) {
      toast({ variant: "destructive", title: "Error de Contexto", description: "Debes estar autenticado en una organización para publicar." });
      return;
    }

    if (data.lat === null || data.lng === null || isNaN(data.lat) || isNaN(data.lng)) {
      toast({ 
        variant: "destructive", 
        title: "Ubicación Requerida", 
        description: "Por favor, selecciona la ubicación exacta en el mapa para continuar." 
      });
      return;
    }

    setLoading(true);

    const checkResult = DuplicateDetector.analyze(data, existingProperties || []);
    
    if (checkResult.level !== 'UNIQUE') {
      setDuplicateCheck(checkResult);
      setIsWarningOpen(true);
      setLoading(false);
      return;
    }

    await saveProperty(data);
  };

  const saveProperty = async (data: PropertyFormValues, resolution?: string) => {
    setLoading(true);
    try {
      if (!db || !tenant?.id) throw new Error("No hay conexión con la base de datos.");

      const payload: Omit<Property, 'id'> = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        tipo: data.tipo,
        operacion: data.operacion,
        precio: parseFloat(data.precio),
        moneda: data.moneda,
        expensas: data.expensas ? parseFloat(data.expensas) : 0,
        provincia: data.provincia,
        ciudad: data.ciudad,
        barrio: data.barrio,
        calle: data.calle,
        numero: data.numero,
        piso: data.piso,
        unidad: data.unidad,
        lat: Number(data.lat!),
        lng: Number(data.lng!),
        metros: parseFloat(data.supTotal),
        supTotal: parseFloat(data.supTotal),
        supCubierta: data.supCubierta ? parseFloat(data.supCubierta) : 0,
        ambientes: parseInt(data.ambientes),
        dormitorios: parseInt(data.dormitorios),
        banos: data.banos,
        cochera: data.cochera,
        aptoCredito: data.aptoCredito,
        escritura: data.escritura,
        pozo: data.pozo,
        aEstrenar: data.aEstrenar,
        destacado: data.destacado,
        imagen: selectedPlaceholder,
        userId: user?.uid || 'anonymous',
        tenantId: tenant.id,
        status: (resolution ? 'pending_review' : 'active') as PropertyStatus,
        deduplicationResolution: resolution || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const colRef = collection(db, 'tenants', tenant.id, 'properties');
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      eventBus.emit('property.created', { id: docRef.id, ...payload });

      toast({
        title: resolution ? "Carga en revisión" : "Propiedad publicada",
        description: resolution 
          ? "Un administrador validará el posible conflicto de duplicidad."
          : "Tu propiedad ya está disponible en la red CRUSHOME.",
      });

      router.push('/my-properties');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicateResolution = (resolution: string) => {
    const data = methods.getValues();
    saveProperty(data, resolution);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 pb-20">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/my-properties">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tighter executive-gradient-text">Nueva Propiedad</h1>
            <p className="text-muted-foreground text-sm">Cargá los datos técnicos para activar el Matching IA.</p>
          </div>
        </div>
      </header>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white/[0.03] border-white/10 overflow-hidden">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building className="h-4 w-4 text-accent" /> Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label>Título del anuncio</Label>
                  <Input {...methods.register('titulo', { required: true })} placeholder="Ej: Depto 3 amb con balcón en Palermo Soho" className="bg-black/40 border-white/10 h-12" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Tipo de Propiedad</Label>
                    <Select onValueChange={(v) => methods.setValue('tipo', v)} defaultValue="Departamento">
                      <SelectTrigger className="bg-black/40 border-white/10 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Departamento">Departamento</SelectItem>
                        <SelectItem value="Casa">Casa</SelectItem>
                        <SelectItem value="PH">PH</SelectItem>
                        <SelectItem value="Oficina">Oficina</SelectItem>
                        <SelectItem value="Terreno">Terreno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Operación</Label>
                    <Select onValueChange={(v) => methods.setValue('operacion', v)} defaultValue="Venta">
                      <SelectTrigger className="bg-black/40 border-white/10 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Venta">Venta</SelectItem>
                        <SelectItem value="Alquiler">Alquiler</SelectItem>
                        <SelectItem value="Temporal">Alquiler Temporal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building className="h-4 w-4 text-accent" /> Detalles Técnicos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label>Sup. Total (m²)</Label>
                  <Input type="number" {...methods.register('supTotal', { required: true })} className="bg-black/40 border-white/10 h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Sup. Cubierta (m²)</Label>
                  <Input type="number" {...methods.register('supCubierta')} className="bg-black/40 border-white/10 h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Ambientes</Label>
                  <Input type="number" {...methods.register('ambientes')} className="bg-black/40 border-white/10 h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Dormitorios</Label>
                  <Input type="number" {...methods.register('dormitorios')} className="bg-black/40 border-white/10 h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Baños</Label>
                  <Input type="number" {...methods.register('banos')} className="bg-black/40 border-white/10 h-10" />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/[0.03] border-white/10">
                <CardHeader className="bg-white/5 border-b border-white/5">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-accent" /> Valores
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-2">
                    <Select onValueChange={(v) => methods.setValue('moneda', v)} defaultValue="USD">
                      <SelectTrigger className="w-24 bg-black/40 border-white/10 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="ARS">ARS</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" {...methods.register('precio', { required: true })} placeholder="Precio" className="flex-1 bg-black/40 border-white/10 h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Expensas (opcional)</Label>
                    <Input type="number" {...methods.register('expensas')} placeholder="Monto mensual" className="bg-black/40 border-white/10 h-11" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.03] border-white/10">
                <CardHeader className="bg-white/5 border-b border-white/5">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" /> Ubicación
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <IntelligentLocationFilter />
                  {!methods.watch('lat') && (
                    <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-2 items-center text-red-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
                      <AlertCircle className="h-4 w-4" /> Ubicación obligatoria en el mapa
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <CardTitle className="text-sm">Características y Atributos</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: 'cochera', label: 'Cochera' },
                  { id: 'aptoCredito', label: 'Apto Crédito' },
                  { id: 'escritura', label: 'Escritura' },
                  { id: 'pozo', label: 'Venta en Pozo' },
                  { id: 'aEstrenar', label: 'A Estrenar' },
                  { id: 'destacado', label: 'Propiedad Destacada' },
                ].map((attr) => (
                  <div key={attr.id} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={attr.id}
                      {...methods.register(attr.id as any)}
                      className="w-5 h-5 rounded border-white/10 bg-black/40 accent-accent"
                    />
                    <Label htmlFor={attr.id} className="text-xs cursor-pointer">{attr.label}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-white/[0.03] border-white/10">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <CardTitle className="text-sm">Imagen Destacada</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-2">
                  {PlaceHolderImages.map((img) => (
                    <div 
                      key={img.id}
                      onClick={() => setSelectedPlaceholder(img.id)}
                      className={cn(
                        "relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all",
                        selectedPlaceholder === img.id ? "border-accent scale-95" : "border-transparent opacity-50 grayscale hover:opacity-100 hover:grayscale-0"
                      )}
                    >
                      <img src={img.imageUrl} alt="Placeholder" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-900/20 to-black/40 border-white/10 sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Publicación</CardTitle>
                <CardDescription>Configurá la visibilidad de tu aviso.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button type="submit" disabled={loading || !methods.watch('lat')} className="w-full h-14 bg-gradient-to-r from-pink-500 to-violet-600 font-black text-lg shadow-xl shadow-pink-500/20 rounded-2xl group disabled:opacity-50">
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">PUBLICAR AHORA</span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

        </form>
      </FormProvider>

      {duplicateCheck && (
        <DuplicatePropertyWarning 
          isOpen={isWarningOpen}
          onOpenChange={setIsWarningOpen}
          matchScore={duplicateCheck.score}
          onConfirm={handleDuplicateResolution}
        />
      )}
    </div>
  );
}
