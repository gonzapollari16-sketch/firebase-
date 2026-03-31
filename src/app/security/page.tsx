
'use client';

import React, { useState } from 'react';
import { useCore } from '@/core/use-core';
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  Activity,
  Fingerprint,
  RefreshCw,
  Zap,
  Globe,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

/**
 * @fileOverview Security Kernel Dashboard - CRUSHOME Enterprise.
 * Centro de control para blindaje de datos, encriptación y auditoría neural.
 */
export default function SecurityKernelPage() {
  const { systemStatus, tenant } = useCore();
  const [isHardened, setIsHardened] = useState(true);
  const [mfaActive, setMfaActive] = useState(true);

  const securityLogs = [
    { id: 1, event: 'Acceso desde IP reconocida', status: 'success', time: 'hace 12 min', location: 'Buenos Aires, AR' },
    { id: 2, event: 'Auditoría de Encriptación Firestore', status: 'success', time: 'hace 45 min', location: 'Auto-Kernel' },
    { id: 3, event: 'Intento de fuerza bruta bloqueado', status: 'warning', time: 'hace 2 horas', location: 'Lagos, NG' },
    { id: 4, event: 'Rotación automática de llaves API', status: 'success', time: 'hace 5 horas', location: 'System' },
  ];

  const handleRecalibrate = () => {
    toast({
      title: "Recalibrando Blindaje...",
      description: "Sincronizando firewalls de capa 7 con el Neural Core.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-1000">
      
      {/* HEADER ESTRATÉGICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic executive-gradient-text uppercase text-white">Security Kernel</h1>
          </div>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
            Blindaje de Datos de Grado Militar • Multi-Tenant Isolation • v5.0
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/"><Button variant="outline" className="border-white/10 rounded-xl text-white/60 hover:text-white">Dashboard</Button></Link>
          <Button 
            onClick={handleRecalibrate}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-emerald-500/20 px-8"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> RECALIBRAR FIREWALL
          </Button>
        </div>
      </div>

      {/* ESTADO GLOBAL DE SEGURIDAD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-[#151737]/40 border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Activity className="h-4 w-4" /> Security Score
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col items-center text-center">
            <div className="text-7xl font-black text-white tracking-tighter mb-2">99<span className="text-2xl text-emerald-500">.8</span></div>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-6">Máximo Nivel de Blindaje</p>
            <Progress value={99.8} className="h-1.5 w-full bg-white/5 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
          </CardContent>
        </Card>

        <Card className="bg-[#151737]/40 border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group col-span-2">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white/40">Sincronización Neural de Amenazas</CardTitle>
          </CardHeader>
          <CardContent className="p-0 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase text-white/20">
                <span>Tráfico Malicioso Bloqueado</span>
                <span className="text-accent">1,245 attempts</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase text-white/20">
                <span>Latencia de Firewall Neural</span>
                <span className="text-white">12ms</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase text-white/20">
                <span>Integridad de Base de Datos</span>
                <span className="text-emerald-400">Verified</span>
              </div>
            </div>
            <div className="flex items-center justify-center border-l border-white/5 pl-8">
                <div className="p-6 rounded-full bg-accent/10 relative">
                    <Globe className="h-12 w-12 text-accent animate-pulse" />
                    <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL DE CONFIGURACIÓN */}
        <div className="lg:col-span-12 lg:col-start-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white/[0.03] border-white/5 rounded-[2rem] p-8 space-y-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-3">
                    <Settings className="w-4 h-4" /> Controles de Acceso
                </h3>
                
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-white">Autenticación de Dos Factores (MFA)</p>
                            <p className="text-[10px] text-white/30 uppercase font-bold">Obligatorio por política de organización</p>
                        </div>
                        <Switch checked={mfaActive} onCheckedChange={setMfaActive} />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-white">Blindaje en Tiempo Real</p>
                            <p className="text-[10px] text-white/30 uppercase font-bold">Inhibe ejecuciones sospechosas por IA</p>
                        </div>
                        <Switch checked={isHardened} onCheckedChange={setIsHardened} />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-white">Restricción de IP Geográfica</p>
                            <p className="text-[10px] text-white/30 uppercase font-bold">Permitir solo accesos desde Argentina</p>
                        </div>
                        <Switch checked={true} />
                    </div>
                </div>
            </Card>

            <Card className="bg-black/40 border-white/5 rounded-[2rem] h-full flex flex-col">
                <CardHeader className="p-8 border-b border-white/5">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-accent" /> Registros de Auditoría Viva
                </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0 font-mono text-[11px]">
                    <div className="divide-y divide-white/5">
                        {securityLogs.map((log) => (
                            <div key={log.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-4">
                                    {log.status === 'success' ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-pink-500 animate-pulse" />}
                                    <div>
                                        <p className="font-bold text-white/80">{log.event}</p>
                                        <p className="text-[9px] text-white/20 uppercase tracking-widest">{log.location}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-white/20">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>

        {/* BOTTOM SECTION - ENCRYPTION KEYS */}
        <div className="lg:col-span-12">
            <Card className="bg-gradient-to-br from-[#1A1D3A] to-[#07081a] border-white/10 rounded-[2.5rem] p-10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <Key className="h-64 w-64 text-emerald-400 -rotate-12" />
                </div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-[9px] uppercase tracking-widest">
                            <Lock className="w-3 h-3" /> Hardware Security Modules Active
                        </div>
                        <h2 className="text-3xl font-black italic tracking-tight uppercase text-white leading-tight">Master Key Infrastructure</h2>
                        <p className="text-white/40 leading-relaxed text-sm italic">
                            Tus datos personales y de propiedades están cifrados con **AES-256-GCM** y llaves rotativas administradas por el sistema. Ni siquiera CRUSHOME tiene acceso a las llaves maestras en texto plano.
                        </p>
                        <div className="flex gap-4">
                            <Button className="bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] rounded-xl hover:bg-white/10 h-10 px-6">Rotar Llaves API</Button>
                            <Button className="bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] rounded-xl hover:bg-white/10 h-10 px-6">Exportar Logs Audit</Button>
                        </div>
                    </div>
                    <div className="p-8 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-3xl space-y-6">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Digital Fingerprint</div>
                        <div className="font-mono text-[10px] break-all text-emerald-400/60 leading-relaxed opacity-80">
                            SH256: 8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a
                            SIGNATURE_VERSION: 5.0.0_PRODUCTION
                            OWNER: {tenant?.name || 'CRUSHOME_TENANT_ID'}
                        </div>
                        <Button className="w-full bg-emerald-600 text-white font-black uppercase rounded-xl h-12 text-xs tracking-[0.2em] shadow-xl shadow-emerald-600/10">Verificar Integridad</Button>
                    </div>
                </div>
            </Card>
        </div>

      </div>

      {/* FOOTER SECURITY */}
      <div className="p-8 rounded-[2.5rem] bg-black/40 border border-white/5 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.5em]">
          CRUSHOME SECURITY OVERLAY • DATA ISOLATION KERNEL © 2026
        </p>
      </div>

    </div>
  );
}
