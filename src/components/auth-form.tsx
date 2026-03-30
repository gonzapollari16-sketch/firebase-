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

        <div className="relative my-8">
          <Separator className="bg-white/10" />
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white dark:bg-[#07081a] px-4 text-[9px] uppercase font-bold text-muted-foreground tracking-[0.3em]">o continuar con</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button 
            variant="outline" 
            className="h-12 border-white/10 bg-white/5 hover:bg-white/10 rounded-xl font-bold flex items-center gap-2"
            onClick={async () => {
              if (!auth) return;
              setIsLoading(true);
              try {
                const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                await result.user.getIdToken(true);
                toast({ title: 'Éxito', description: `Bienvenido, ${result.user.displayName}` });
              } catch (error: any) {
                toast({ variant: 'destructive', title: 'Error Google', description: error.message });
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18c-.77 1.56-1.21 3.29-1.21 5.1s.44 3.54 1.21 5.1l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            GOOGLE
          </Button>
          <Button 
            variant="outline" 
            className="h-12 border-white/10 bg-white/5 hover:bg-white/10 rounded-xl font-bold flex items-center gap-2"
            onClick={() => {
              toast({ title: 'Próximamente', description: 'La conexión con WhatsApp Kernel se activará en la próxima actualización cognitiva.' });
            }}
          >
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WSP OS
          </Button>
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
