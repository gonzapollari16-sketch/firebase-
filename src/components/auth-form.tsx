'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase/provider';
import { authenticateOrRegister } from '@/firebase/auth-utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import CrushomeLogo from './crushome-logo';
import { Loader2 } from 'lucide-react';
import { executeOnboarding } from '@/app/actions';

/**
 * @fileOverview Formulario de Autenticación Unificado con protección contra colisiones de email.
 */
export default function AuthForm() {
  const auth = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [activeTab, setActiveTab] = useState<'particular' | 'professional' | 'developer'>('particular');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setIsLoading(true);
    try {
      const result = await authenticateOrRegister(auth, email, password, isLogin);

      if (result.error) {
        toast({ variant: 'destructive', title: 'Error de Acceso', description: result.error });
        setIsLoading(false);
        return;
      }

      if (!result.user) {
        toast({ variant: 'destructive', title: 'Error Inesperado', description: 'No se pudo obtener el usuario. Intente de nuevo.' });
        setIsLoading(false);
        return;
      }

      // Si el usuario es nuevo, disparamos onboarding automático
      if (result.isNewUser) {
        const idToken = await result.user.getIdToken();
        const onboardingResult = await executeOnboarding({
          idToken,
          orgName: orgName || `Org-${result.user.uid.substring(0, 5)}`
        });

        if (onboardingResult.error) {
          toast({ variant: 'destructive', title: 'Aviso de Configuración', description: 'Tu cuenta se creó pero hubo un problema configurando tu organización. El sistema intentará auto-repararse al ingresar.' });
        } else {
          await result.user.getIdToken(true); // Forzar refresh para obtener los claims
          toast({ title: '¡Bienvenido!', description: 'Tu cuenta y organización han sido configuradas.' });
        }
      } else if (!isLogin) {
        toast({ title: 'Cuenta existente', description: 'Ya tenías una cuenta creada. Hemos iniciado sesión por vos.' });
      }

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Falla Crítica',
        description: 'No pudimos procesar tu solicitud. Verificá tu conexión.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl w-full border-0 shadow-2xl overflow-hidden bg-card/80 backdrop-blur-md grid md:grid-cols-2">
      
      <div className="bg-gradient-to-br from-[#0E1026] to-[#3A2F7D] p-12 text-white flex flex-col justify-center">
        <CrushomeLogo className="text-4xl text-white mb-6 scale-125" />
        <h1 className="text-3xl font-black mb-4 tracking-tighter">Bienvenido a CRUSHOME</h1>
        <p className="text-white/60 italic leading-relaxed text-sm">
          El primer ecosistema inmobiliario con matching inteligente y validación real de actores comerciales.
        </p>
        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 text-[10px] uppercase font-black tracking-widest text-accent">
          Registro Seguro · Validación Profesional
        </div>
      </div>

      <CardContent className="p-10 bg-white dark:bg-[#07081a]">
        <div className="mb-8">
          <h2 className="text-2xl font-black tracking-tighter">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
          <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest mt-1">Elegí tu perfil de usuario</p>
        </div>

        {!isLogin && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {(['particular', 'professional', 'developer'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`p-3 rounded-xl border text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-accent border-accent text-black shadow-lg shadow-accent/20' : 'bg-transparent border-white/10 text-white/40'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {activeTab !== 'particular' && (
              <div className="space-y-2 mb-5">
                <Label className="text-[10px] uppercase font-black text-muted-foreground">Nombre de la Organización</Label>
                <Input
                  placeholder="Ej: Inmobiliaria Central"
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  className="w-full bg-black/5 dark:bg-black/40 border-white/10 h-11"
                  required
                />
              </div>
            )}
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black text-muted-foreground">Email Corporativo</Label>
            <Input
              type="email"
              placeholder="nombre@empresa.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/5 dark:bg-black/40 border-white/10 h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black text-muted-foreground">Contraseña</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/5 dark:bg-black/40 border-white/10 h-11"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#FF4FD8] to-[#7B4DFF] h-12 rounded-xl font-black text-white shadow-xl hover:scale-[1.02] transition-all"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isLogin ? 'INGRESAR' : 'REGISTRARME')}
          </Button>
        </form>

        <div className="relative my-10">
          <Separator className="bg-white/10" />
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white dark:bg-[#07081a] px-4 text-[9px] uppercase font-bold text-muted-foreground tracking-[0.3em]">o continuar con</span>
        </div>

        <p className="text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[10px] font-black text-accent hover:text-white transition-colors uppercase tracking-widest"
          >
            {isLogin ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciar Sesión'}
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
