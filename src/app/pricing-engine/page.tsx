'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PricingEnginePage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function predict() {
    setLoading(true);
    setResult('');
    try {
      // Since the Python backend is not actually running,
      // we'll simulate the API call and response.
      const sqm = (document.getElementById('sqm') as HTMLInputElement)?.value;
      const rooms = (document.getElementById('rooms') as HTMLInputElement)?.value;
      
      // Simulate some logic based on input
      const basePrice = 150000;
      const sqmBonus = (parseInt(sqm) || 0) * 1200;
      const roomBonus = (parseInt(rooms) || 0) * 15000;
      const predicted_price = basePrice + sqmBonus + roomBonus;

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // const res = await fetch('/price/predict', {
      //   method: 'POST',
      //   headers: {'Content-Type':'application/json'},
      //   body: JSON.stringify({
      //     sqm: sqm,
      //     rooms: rooms,
      //     location: (document.getElementById('location') as HTMLInputElement)?.value
      //   })
      // });
      // const data = await res.json();
      
      const data = { predicted_price: new Intl.NumberFormat('es-AR').format(predicted_price) };
      setResult("Precio óptimo: USD " + data.predicted_price);
    } catch (error) {
      console.error(error);
      setResult('Error al predecir el precio.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-end mb-4">
          <Link href="/" passHref><Button variant="outline">Volver al Dashboard</Button></Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>True Market Pricing Engine™</CardTitle>
          <CardDescription>Estima el precio de mercado óptimo para una propiedad usando IA.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sqm">Metros cuadrados</Label>
            <Input id="sqm" placeholder="Ej: 85" type="number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rooms">Ambientes</Label>
            <Input id="rooms" placeholder="Ej: 3" type="number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Zona</Label>
            <Input id="location" placeholder="Ej: Palermo, Belgrano" />
          </div>
          <Button onClick={predict} disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? 'Prediciendo...' : 'Predecir Precio'}
          </Button>
          {result && (
            <div id="result" className="text-center pt-4 text-lg font-bold text-success">
              {result}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
