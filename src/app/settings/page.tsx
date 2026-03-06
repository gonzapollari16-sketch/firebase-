'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function ParticularForm() {
  return (
    <form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nombre-p">Nombre</Label>
          <Input id="nombre-p" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellido-p">Apellido</Label>
          <Input id="apellido-p" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-p">Email</Label>
          <Input id="email-p" type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono-p">Teléfono</Label>
          <Input id="telefono-p" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="provincia-p">Provincia</Label>
          <Input id="provincia-p" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ciudad-p">Ciudad</Label>
          <Input id="ciudad-p" />
        </div>
        <div className="space-y-2">
          <Label>Interés principal</Label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Seleccionar interés..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="comprar">Comprar</SelectItem>
              <SelectItem value="alquilar">Alquilar</SelectItem>
              <SelectItem value="invertir">Invertir</SelectItem>
              <SelectItem value="vender">Vender</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Presupuesto estimado</Label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="50k">Hasta USD 50k</SelectItem>
              <SelectItem value="100k">USD 50k–100k</SelectItem>
              <SelectItem value="100k+">USD 100k+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button className="w-full mt-6" size="lg">Guardar perfil</Button>
    </form>
  )
}

function InmobiliariaForm() {
  return (
    <form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="nombre-comercial-i">Nombre comercial</Label>
          <Input id="nombre-comercial-i" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="responsable-i">Responsable</Label>
          <Input id="responsable-i" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-corp-i">Email corporativo</Label>
          <Input id="email-corp-i" type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono-i">Teléfono</Label>
          <Input id="telefono-i" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="provincia-i">Provincia</Label>
          <Input id="provincia-i" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zona-i">Zona principal</Label>
          <Input id="zona-i" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="matricula-i">Matrícula habilitante</Label>
          <Input id="matricula-i" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="colegio-i">Colegio profesional</Label>
          <Input id="colegio-i" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo-i">Logo</Label>
          <Input id="logo-i" type="file" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agentes-i">Cantidad de agentes</Label>
          <Input id="agentes-i" type="number" />
        </div>
      </div>
      <Button className="w-full mt-6" size="lg">Guardar perfil profesional</Button>
    </form>
  )
}

function DesarrollistaForm() {
  return (
    <form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="razon-social-d">Razón social</Label>
          <Input id="razon-social-d" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nombre-comercial-d">Nombre comercial</Label>
          <Input id="nombre-comercial-d" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cuit-d">CUIT</Label>
          <Input id="cuit-d" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-corp-d">Email corporativo</Label>
          <Input id="email-corp-d" type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono-d">Teléfono</Label>
          <Input id="telefono-d" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="provincia-d">Provincia</Label>
          <Input id="provincia-d" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zona-d">Zona principal</Label>
          <Input id="zona-d" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="responsable-d">Responsable</Label>
          <Input id="responsable-d" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cargo-d">Cargo</Label>
          <Input id="cargo-d" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo-d">Logo</Label>
          <Input id="logo-d" type="file" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experiencia-d">Años experiencia</Label>
          <Input id="experiencia-d" type="number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proyectos-d">Proyectos activos</Label>
          <Input id="proyectos-d" type="number" />
        </div>
      </div>
      <Button className="w-full mt-6" size="lg">Guardar perfil empresa</Button>
    </form>
  )
}


export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-none bg-transparent">
            <CardHeader>
                <CardTitle className="text-3xl">Perfil de cuenta</CardTitle>
                <CardDescription>
                    Completá tu información para desbloquear todas las funciones de CRUSHOME.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="particular" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6 h-auto">
                        <TabsTrigger value="particular" className="h-12">Usuario Particular</TabsTrigger>
                        <TabsTrigger value="inmobiliaria" className="h-12">Inmobiliaria / Agente</TabsTrigger>
                        <TabsTrigger value="desarrollista" className="h-12">Desarrollista</TabsTrigger>
                    </TabsList>
                    <TabsContent value="particular">
                        <ParticularForm />
                    </TabsContent>
                    <TabsContent value="inmobiliaria">
                        <InmobiliariaForm />
                    </TabsContent>
                    <TabsContent value="desarrollista">
                        <DesarrollistaForm />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
