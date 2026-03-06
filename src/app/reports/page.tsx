'use client';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase/provider';
import { doc, DocumentData, DocumentReference } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { UserRole } from '@/lib/types';

interface UserProfile {
  role?: UserRole;
}

const ReportsContent = () => (
    <>
        <style jsx>{`
            h1, h2, h3 {
              color: #ffffff;
              margin-bottom: 10px;
            }
            h1 {
                font-size: 2.25rem;
            }
            h2 {
                font-size: 1.5rem;
            }
             p {
              color: #9ca3af;
              line-height: 1.6;
            }

            .section {
              margin-bottom: 60px;
            }

            .card-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
              gap: 20px;
              margin-top: 20px;
            }

            .card {
              background: #11131c;
              border-radius: 14px;
              padding: 22px;
              border: 1px solid #1f2937;
            }

            .badge {
              display: inline-block;
              background: #1f2937;
              color: #38bdf8;
              padding: 4px 10px;
              border-radius: 999px;
              font-size: 12px;
              margin-bottom: 10px;
            }

            .plan-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 30px;
            }

            .plan-table th,
            .plan-table td {
              border: 1px solid #1f2937;
              padding: 14px;
              text-align: center;
              font-size: 14px;
            }

            .plan-table th {
              background: #11131c;
              color: #ffffff;
            }

            .yes {
              color: #22c55e;
              font-weight: 600;
            }

            .no {
              color: #ef4444;
              font-weight: 600;
            }

            .note {
              margin-top: 20px;
              font-size: 13px;
              color: #9ca3af;
            }
        `}</style>
        <div className="max-w-6xl mx-auto">
            <section className="section">
              <h1>Soporte y Reportes</h1>
              <p>
                Cada plan incluye distintos niveles de soporte técnico y acceso a reportes,
                diseñados para acompañar el crecimiento de tu operación y la toma de decisiones.
              </p>
            </section>

            <section className="section">
              <h2>Tipos de Soporte</h2>

              <div className="card-grid">
                <div className="card">
                  <span className="badge">Soporte Básico</span>
                  <h3>Soporte Autogestionado</h3>
                  <p>
                    Acceso a centro de ayuda, documentación, guías paso a paso
                    y resolución de problemas comunes.
                  </p>
                </div>

                <div className="card">
                  <span className="badge">Soporte Estándar</span>
                  <h3>Soporte por Ticket</h3>
                  <p>
                    Atención mediante sistema de tickets con tiempos de respuesta definidos
                    y seguimiento del caso.
                  </p>
                </div>

                <div className="card">
                  <span className="badge">Soporte Avanzado</span>
                  <h3>Soporte Prioritario</h3>
                  <p>
                    Prioridad en la cola de atención, resolución acelerada
                    y soporte técnico especializado.
                  </p>
                </div>

                <div className="card">
                  <span className="badge">Soporte Premium</span>
                  <h3>Soporte Dedicado</h3>
                  <p>
                    Ejecutivo asignado, canal directo de contacto
                    y acompañamiento estratégico continuo.
                  </p>
                </div>
              </div>
            </section>

            <section className="section">
              <h2>Tipos de Reportes</h2>

              <div className="card-grid">
                <div className="card">
                  <span className="badge">Reportes Básicos</span>
                  <h3>Datos Generales</h3>
                  <p>
                    Métricas esenciales de uso, actividad general
                    y resúmenes automáticos.
                  </p>
                </div>

                <div className="card">
                  <span className="badge">Reportes Intermedios</span>
                  <h3>Análisis Operativo</h3>
                  <p>
                    Reportes detallados por período, filtros
                    y exportación de datos.
                  </p>
                </div>

                <div className="card">
                  <span className="badge">Reportes Avanzados</span>
                  <h3>Inteligencia de Negocio</h3>
                  <p>
                    Insights, tendencias, comparativas
                    y visualizaciones avanzadas.
                  </p>
                </div>

                <div className="card">
                  <span className="badge">Reportes Personalizados</span>
                  <h3>Reportes a Medida</h3>
                  <p>
                    Reportes diseñados según objetivos específicos
                    del cliente y su operación.
                  </p>
                </div>
              </div>
            </section>

            <section className="section">
              <h2>Comparativa por Plan</h2>

              <table className="plan-table">
                <thead>
                  <tr>
                    <th>Funcionalidad</th>
                    <th>Free</th>
                    <th>Pro</th>
                    <th>Business</th>
                    <th>Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Soporte Autogestionado</td>
                    <td className="yes">Sí</td>
                    <td className="yes">Sí</td>
                    <td className="yes">Sí</td>
                    <td className="yes">Sí</td>
                  </tr>
                  <tr>
                    <td>Soporte por Ticket</td>
                    <td className="no">No</td>
                    <td className="yes">Sí</td>
                    <td className="yes">Sí</td>
                    <td className="yes">Sí</td>
                  </tr>
                  <tr>
                    <td>Soporte Prioritario</td>
                    <td className="no">No</td>
                    <td className="no">No</td>
                    <td className="yes">Sí</td>
                    <td className="yes">Sí</td>
                  </tr>
                  <tr>
                    <td>Soporte Dedicado</td>
                    <td className="no">No</td>
                    <td className="no">No</td>
                    <td className="no">No</td>
                    <td className="yes">Sí</td>
                  </tr>
                  <tr>
                    <td>Reportes Básicos</td>
                    <td className="yes">Sí</td>
                    <td className="yes">Sí</td>
                    <td className="yes">Sí</td>
                    <td className="yes">Sí</td>
                  </tr>
                  <tr>
                    <td>Reportes Avanzados</td>
                    <td className="no">No</td>
                    <td className="yes">Sí</td>
                    <td className="yes">Sí</td>
                    <td className="yes">Sí</td>
                  </tr>
                  <tr>
                    <td>Reportes Personalizados</td>
                    <td className="no">No</td>
                    <td className="no">No</td>
                    <td className="no">No</td>
                    <td className="yes">Sí</td>
                  </tr>
                </tbody>
              </table>

              <p className="note">
                * Los tiempos de respuesta y niveles de personalización pueden variar según el acuerdo comercial.
              </p>
            </section>
        </div>
    </>
);

export default function ReportsPage() {
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

    useEffect(() => {
        if (!isUserLoading && !isProfileLoading) {
            if (!user) {
                router.push('/');
            } else if (userProfile?.role !== 'CEO' && userProfile?.role !== 'ADMIN' && userProfile?.role !== 'DEV') {
                router.push('/');
            }
        }
    }, [user, isUserLoading, userProfile, isProfileLoading, router]);


    if (isUserLoading || isProfileLoading) {
        return (
          <div className="flex h-full items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
    }

    const hasAccess = userProfile?.role === 'CEO' || userProfile?.role === 'ADMIN' || userProfile?.role === 'DEV';

    if (!hasAccess) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-8">
                <Card className="w-full max-w-md text-center border-destructive bg-destructive/10">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2 text-destructive">
                            <Ban className="h-6 w-6"/> Access Denied
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>You do not have permission to view this page.</p>
                        <p className="text-sm text-muted-foreground mt-2">Redirecting to dashboard...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-end mb-4">
                <Link href="/" passHref>
                    <Button variant="outline">
                        Volver al Dashboard
                    </Button>
                </Link>
            </div>
            <ReportsContent />
        </div>
    );
}
