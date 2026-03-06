'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { LayoutTemplate } from 'lucide-react';
import Link from 'next/link';

interface FlyerData {
  title: string;
  price: string;
  neighborhood: string;
  bedrooms: string;
  type: string;
  image: string;
}

const FlyerPreview = ({ flyerData }: { flyerData: FlyerData | null }) => {
  if (!flyerData) return null;

  const { title, price, neighborhood, bedrooms, type, image } = flyerData;

  const flyerStyle: React.CSSProperties = {
    width: '350px',
    height: '500px',
    background: `url('${image}') center/cover`,
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,.3)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    margin: '20px auto'
  };
  
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: '0',
    background: 'linear-gradient(180deg, transparent 40%, rgba(2,6,23,.95))',
  };

  const watermarkStyle: React.CSSProperties = {
    position: 'absolute',
    inset: '0',
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-size="28" font-family="Arial" transform="rotate(-30 150 150)">CRUSHOME</text></svg>')`,
    backgroundRepeat: 'repeat',
    pointerEvents: 'none',
    zIndex: 1,
  }

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    padding: '20px',
  };

  return (
    <div style={flyerStyle}>
      <div style={overlayStyle}></div>
      <div style={watermarkStyle}></div>
      <div style={contentStyle}>
        <div style={{ fontSize: '13px', background: 'rgba(0,0,0,.5)', display: 'inline-block', padding: '4px 8px', borderRadius: '999px' }}>{type} en {neighborhood}</div>
        <h2 style={{ fontSize: '26px', margin: '8px 0' }}>{title}</h2>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#22C55E', marginTop: '5px' }}>USD {price}</div>
        <hr style={{ border: 'none', height: '1px', background: 'rgba(255,255,255,.2)', margin: '12px 0' }} />
        <div style={{ fontSize: '14px' }}><strong>{bedrooms}</strong> Dorms | Contacto: <strong>Salvador</strong></div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '10px', background: 'linear-gradient(135deg,#22C55E,#38BDF8)', WebkitBackgroundClip: 'text', color: 'transparent' }}>CRUSHOME</div>
      </div>
    </div>
  );
}


export default function FlyerGeneratorPage() {
  const { toast } = useToast();
  const [flyerData, setFlyerData] = useState<FlyerData | null>(null);
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [bedrooms, setBedrooms] = useState('1');
  const [type, setType] = useState('Casa');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerateFlyer = () => {
    if(!title || !price || !neighborhood) {
        toast({
            variant: "destructive",
            title: "Faltan datos",
            description: "Por favor completá título, precio y barrio.",
        });
        return;
    }

    const data: FlyerData = {
      title,
      price,
      neighborhood,
      bedrooms,
      type,
      image: imagePreview || 'https://images.unsplash.com/photo-1588880331179-b1b0ba0381ce?auto=format&fit=crop&w=900&q=80',
    };

    setFlyerData(data);

    toast({
        title: "Flyer Generado",
        description: "El preview de tu flyer está listo.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-end mb-4">
          <Link href="/" passHref><Button variant="outline">Volver al Dashboard</Button></Link>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Generador de Flyers</h1>
        <p className="text-muted-foreground mt-2">Creá flyers profesionales para tus propiedades en segundos.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Datos de la Propiedad</CardTitle>
            <CardDescription>Carga con generación automática de flyer + watermark</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="pub-title">Título</Label>
                <Input id="pub-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="pub-price">Precio USD</Label>
                <Input id="pub-price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Precio USD" type="number"/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="pub-neighborhood">Barrio / Zona</Label>
                <Input id="pub-neighborhood" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Barrio / Zona" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="pub-bedrooms">Dormitorios</Label>
                <Input id="pub-bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} placeholder="Dormitorios" type="number" />
            </div>
            <div className="space-y-2">
                <Label>Tipo de Propiedad</Label>
                <Select onValueChange={setType} defaultValue={type}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Casa">Casa</SelectItem>
                        <SelectItem value="Departamento">Departamento</SelectItem>
                        <SelectItem value="PH">PH</SelectItem>
                        <SelectItem value="Terreno">Terreno</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="pub-image">Imagen</Label>
                <Input id="pub-image" type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <Button className="w-full" onClick={handleGenerateFlyer}>
                <LayoutTemplate className="mr-2 h-4 w-4" />
                Generar Flyer
            </Button>
          </CardContent>
        </Card>

        <div>
            <h3 className="text-xl font-bold mb-4 text-center">Preview del Flyer</h3>
            <FlyerPreview flyerData={flyerData} />
             { !flyerData && <div className="text-center text-muted-foreground p-8 bg-card rounded-lg border border-dashed">El preview aparecerá aquí.</div> }
        </div>
      </div>
    </div>
  );
}
