'use client';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase/provider';
import { doc, DocumentData, DocumentReference } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Map, BookUser, Sparkles, Smartphone, Users, Megaphone, ShieldCheck } from 'lucide-react';
import type { UserRole } from '@/lib/types';

interface UserProfile {
  role?: UserRole;
  plan?: string;
}

export default function IntelligencePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (firestore && user) {
      return doc(firestore, 'users', user.uid);
    }
    return null;
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef as DocumentReference<DocumentData> | null | undefined);

  if (isUserLoading || isProfileLoading) {
      return (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  const FeatureCard = ({ title, description, icon, href, roleRequired }: { title: string, description: string, icon: React.ReactNode, href: string, roleRequired?: UserRole[] }) => {
    const hasRole = !roleRequired || (userProfile?.role && roleRequired.includes(userProfile.role));
    
    // Bypass for root roles
    const isSpecialRole = userProfile?.role === 'CEO' || userProfile?.role === 'DEV' || userProfile?.role === 'ADMIN';
    
    if (!hasRole && !isSpecialRole) return null;

    return (
      <Card className="flex flex-col bg-white/[0.03] border-white/10 hover:bg-white/[0.06] transition-colors group">
        <CardHeader className="flex-row items-center gap-4">
          <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex items-end">
          <Button asChild className="w-full">
            <Link href={href}>Acceder</Link>
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex justify-end mb-8">
          <Link href="/"><Button variant="outline" className="border-white/10">Volver al Dashboard</Button></Link>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black flex items-center justify-center gap-4 tracking-tighter">
          <Sparkles className="h-10 w-10 text-accent" />
          NÚCLEO DE INTELIGENCIA
        </h1>
        <p className="text-lg text-muted-foreground mt-3 font-medium">
          Herramientas avanzadas de monetización, análisis y automatización.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard 
          title="Mapa Interactivo"
          description="Exploración geoespacial con heatmaps de demanda y liquidez."
          icon={<Map className="h-10 w-10" />}
          href="/intelligence/map"
        />
        <FeatureCard 
          title="CRM Inmobiliario"
          description="Gestión inteligente de leads y embudo de conversión IA."
          icon={<BookUser className="h-10 w-10" />}
          href="/intelligence/crm"
        />
        <FeatureCard 
          title="Comunidad Crushome"
          description="Red colaborativa con motor de reciprocidad ICP activo."
          icon={<Users className="h-10 w-10" />}
          href="/intelligence/community"
        />
        <FeatureCard 
          title="Ads Engine"
          description="Gestión de anunciantes, campañas y placements patrocinados."
          icon={<Megaphone className="h-10 w-10" />}
          href="/intelligence/advertisers"
          roleRequired={['MARKETING', 'CEO', 'DEV', 'ADMIN']}
        />
        <FeatureCard 
          title="Integración WhatsApp"
          description="Motor conversacional Business API para atención automática."
          icon={<Smartphone className="h-10 w-10" />}
          href="/intelligence/whatsapp"
        />
         <FeatureCard 
          title="Protección de Imagen"
          description="Sistema de Watermarking y rastreo forense de activos."
          icon={<ShieldCheck className="h-10 w-10" />}
          href="/intelligence/image-protection"
        />
      </div>
    </div>
  );
}
