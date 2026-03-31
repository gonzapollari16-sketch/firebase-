"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase/provider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCore } from '@/core/use-core';
import { useToast } from '@/hooks/use-toast';
import { DuplicateDetector } from '@/core/deduplication/detector';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Loader2, FileSpreadsheet, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react';
import type { Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function PropertyImportPage() {
  const { user } = useUser();
  const { tenant } = useCore();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [data, setData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; skipped: number; total: number } | null>(null);

  // Cargar propiedades existentes para el chequeo de duplicados
  const queries = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'properties');
  }, [db]);
  const { data: existingProperties } = useCollection<Property>(queries);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        toast({ title: "Archivo cargado", description: `Se detectaron ${results.data.length} filas.` });
      },
      error: (error) => {
        toast({ variant: "destructive", title: "Error al leer CSV", description: error.message });
      }
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false
  });

  const runImport = async () => {
    if (!user || !tenant?.id || !db) return;
    setIsProcessing(true);
    setProgress(0);
    
    let success = 0;
    let skipped = 0;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const propertyData: any = {
        titulo: row.titulo || 'Sin título',
        descripcion: row.descripcion || '',
        tipo: row.tipo || 'Departamento',
        operacion: row.operacion || 'Venta',
        precio: parseFloat(row.precio) || 0,
        moneda: row.moneda || 'USD',
        expensas: parseFloat(row.expensas) || 0,
        provincia: row.provincia || '',
        ciudad: row.ciudad || '',
        barrio: row.barrio || '',
        lat: parseFloat(row.lat) || 0,
        lng: parseFloat(row.lng) || 0,
        metros: parseFloat(row.supTotal) || 0,
        supTotal: parseFloat(row.supTotal) || 0,
        supCubierta: parseFloat(row.supCubierta) || 0,
        ambientes: parseInt(row.ambientes) || 1,
        dormitorios: parseInt(row.dormitorios) || 0,
        banos: row.banos || '1',
        cochera: row.cochera === 'true' || row.cochera === '1',
        aptoCredito: row.aptoCredito === 'true' || row.aptoCredito === '1',
        escritura: row.escritura !== 'false' && row.escritura !== '0',
        destacado: row.destacado === 'true' || row.destacado === '1',
      };

      // Validar duplicado
      const check = DuplicateDetector.analyze(propertyData, existingProperties || []);
      
      if (check.level === 'UNIQUE') {
        try {
          const colRef = collection(db, 'tenants', tenant.id, 'properties');
          await addDoc(colRef, {
            ...propertyData,
            imagen: PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)].id,
            userId: user.uid,
            tenantId: tenant.id,
            status: 'active',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          success++;
        } catch (e) {
          console.error("Error importando fila", i, e);
        }
      } else {
        skipped++;
      }

      setProgress(Math.round(((i + 1) / data.length) * 100));
    }

    setResults({ success, skipped, total: data.length });
    setIsProcessing(false);
    toast({ title: "Importación finalizada", description: `${success} subidas, ${skipped} omitidas.` });
  };

  return (
    <div className="container py-10 max-w-5xl space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter executive-gradient-text uppercase">Importador Masivo AI</h1>
          <p className="text-muted-foreground text-sm">Convertí tus bases de datos (CSV) en propiedades activas en segundos.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 bg-white/[0.03] border-white/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-accent" /> Subir Archivo
            </CardTitle>
            <CardDescription>Formatos soportados: CSV</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 ${
                isDragActive ? 'border-accent bg-accent/10' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <input {...getInputProps()} />
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Soltá tu archivo aquí o hacé click</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Máximo 10MB</p>
            </div>

            {data.length > 0 && (
              <div className="pt-4 space-y-4">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs font-bold text-emerald-400">ARCHIVO LISTO</p>
                  <p className="text-lg font-black">{data.length} Filas detectadas</p>
                </div>
                <Button 
                  onClick={runImport} 
                  disabled={isProcessing}
                  className="w-full bg-accent hover:bg-accent/90 h-12 text-white font-bold"
                >
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                  EJECUTAR IMPORTACIÓN
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-white/[0.03] border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Vista Previa / Resultados</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px] flex flex-col">
            {isProcessing && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <Progress value={progress} className="w-full h-2" />
                <p className="text-sm font-bold animate-pulse">PROCESANDO E INYECTANDO PROPIEDADES... {progress}%</p>
              </div>
            )}

            {!isProcessing && results && (
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-center">
                    <p className="text-3xl font-black text-accent">{results.total}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Total</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-center">
                    <p className="text-3xl font-black text-emerald-400">{results.success}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Importados</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-center">
                    <p className="text-3xl font-black text-amber-500">{results.skipped}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Duplicados</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setResults(null)}>Limpiar</Button>
              </div>
            )}

            {!isProcessing && !results && data.length > 0 && (
              <div className="flex-1 overflow-auto max-h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Ubicación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.slice(0, 10).map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{row.titulo}</TableCell>
                        <TableCell>{row.moneda} {row.precio}</TableCell>
                        <TableCell>{row.barrio}, {row.ciudad}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {data.length > 10 && <p className="text-center text-[10px] mt-4 text-muted-foreground">Mostrando primeras 10 filas...</p>}
              </div>
            )}

            {!isProcessing && !results && data.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground space-y-2 opacity-30">
                <AlertCircle className="h-10 w-10" />
                <p>No hay datos cargados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
