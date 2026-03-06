import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Shield className="h-8 w-8 text-accent" />
            Blindaje de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Esta sección está en construcción.</p>
          <p className="mt-2">Aquí podrás configurar el blindaje de seguridad de tu cuenta.</p>
          <Link href="/" className="mt-4 inline-block">
              <Button>Volver al Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
