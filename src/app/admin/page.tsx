
'use client';

import React, { useState } from 'react';
import { useCore } from '@/core/use-core';
import { 
  Shield, 
  Zap, 
  Users, 
  Settings, 
  Activity, 
  Lock, 
  Unlock, 
  Server, 
  Database,
  Search,
  Fingerprint,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

/**
 * @fileOverview Admin Master Hub — CRUSHOME Security & Orchestration
 * Punto 10 y 20 del Master Plan: Automatizaciones y Gestión de Permisos.
 */
export default function AdminPage() {
  const { systemStatus, cognitive, experienceLogs, user, role } = useCore();
  const [searchTerm, setSearchTerm] = useState('');

  const usersMock = [
    { id: '1', email: 'gonza@test.com', role: 'CEO', plan: 'ENTERPRISE', status: 'active' },
    { id: '2', email: 'agente.alpha@test.com', role: 'AGENT', plan: 'PRO', status: 'active' },
    { id: '3', email: 'dev.test@test.com', role: 'DEVELOPER', plan: 'BUSINESS', status: 'warning' },
    { id: '4', email: 'invitadi@test.com', role: 'USER', plan: 'FREE', status: 'inactive' },
  ];

  const automationTasks = [
    { name: 'Watermark Auto-Apply', trigger: 'On Upload', action: 'Canvas Inject', active: true },
    { name: 'Duplicate Detection', trigger: 'Pre-Commit', action: 'Hash Collision Check', active: true },
    { name: 'Meta Ads Auto-Boost', trigger: 'Lead Search Match', action: 'API Dispatch', active: false },
    { name: 'WhatsApp Intent Sync', trigger: 'Incoming Msg', action: 'Neural Extraction', active: true },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-1000">
      
      {/* HEADER DE ADMINISTRACIÓN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic executive-gradient-text uppercase">Admin Master Hub</h1>
          </div>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
            System Orchestration • RBAC • Automations • Punto 10/20
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 rounded-xl bg-white/5">
            <RefreshCw className="mr-2 h-4 w-4" /> RECARGAR NÚCLEO
          </Button>
          <Button className="bg-emerald-600 text-white font-black rounded-xl shadow-lg border-none px-8">
            NUEVA REGLA
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricTile label="Active Nodes" value="22/22" sub="ALL OPERATIONAL" icon={Server} color="text-emerald-400" />
        <MetricTile label="Security Score" value="99.8" sub="MASTER SYNC" icon={Lock} color="text-pink-400" />
        <MetricTile label="Automations" value="14" sub="ACTIVE LOOPS" icon={Zap} color="text-violet-400" />
        <MetricTile label="Sys Health" value="Stable" sub="NEURAL BUFFER" icon={Activity} color="text-accent" />
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 rounded-[2rem] p-1.5 h-16 w-full md:w-auto mb-10">
          <TabsTrigger value="users" className="rounded-full px-8 h-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-black uppercase text-[11px] tracking-widest">Gestión de Usuarios</TabsTrigger>
          <TabsTrigger value="automations" className="rounded-full px-8 h-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-black uppercase text-[11px] tracking-widest">Automatizaciones</TabsTrigger>
          <TabsTrigger value="infra" className="rounded-full px-8 h-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-black uppercase text-[11px] tracking-widest">Infraestructura</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-0 space-y-8">
           <Card className="bg-[#151737]/40 border-white/5 rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight italic">Directorio de Accesos</CardTitle>
                            <CardDescription className="text-white/20 text-[10px] font-black uppercase tracking-widest">Control de Roles y Planes Multi-tenant</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            <Input 
                                placeholder="Buscar usuario o tenant..." 
                                className="bg-black/40 border-white/10 rounded-2xl pl-12 h-11 text-xs"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="px-8 text-white/40 text-[10px] font-black uppercase tracking-widest">Usuario</TableHead>
                                <TableHead className="text-white/40 text-[10px] font-black uppercase tracking-widest text-center">Rol (RBAC)</TableHead>
                                <TableHead className="text-white/40 text-[10px] font-black uppercase tracking-widest text-center">Plan (Quota)</TableHead>
                                <TableHead className="text-white/40 text-[10px] font-black uppercase tracking-widest text-center">Estado</TableHead>
                                <TableHead className="px-8 text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usersMock.map(user => (
                                <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02] transition-all group">
                                    <TableCell className="px-8 py-6">
                                        <p className="font-bold text-sm">{user.email}</p>
                                        <p className="text-[10px] text-white/20 font-black uppercase tracking-tighter mt-1">UUID: {user.id.padStart(8, '0')}</p>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="border-white/10 text-white/60 group-hover:text-white transition-colors">{user.role}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center text-sm font-black text-accent">{user.plan}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full animate-pulse",
                                                user.status === 'active' ? "bg-emerald-500" : user.status === 'warning' ? "bg-amber-500" : "bg-red-500"
                                            )} />
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{user.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-[#151737] border-white/10 rounded-[1.5rem] p-2 text-white">
                                                <DropdownMenuItem className="rounded-xl p-3 focus:bg-white/5 cursor-pointer flex gap-3">
                                                    <Fingerprint className="h-4 w-4 text-accent" /> Gestionar Claims
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl p-3 focus:bg-white/5 cursor-pointer flex gap-3">
                                                    <Lock className="h-4 w-4 text-amber-500" /> Reset Password
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-white/5" />
                                                <DropdownMenuItem className="rounded-xl p-3 focus:bg-red-500/10 text-red-500 cursor-pointer flex gap-3 font-bold">
                                                    SUSPENDER
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="automations" className="mt-0">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {automationTasks.map((task, i) => (
                    <Card key={i} className="bg-[#151737]/40 border-white/5 rounded-[2.5rem] p-8 flex justify-between items-center group hover:bg-[#151737]/60 transition-all">
                        <div className="flex gap-6">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                                task.active ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/20"
                            )}>
                                <Zap className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl tracking-tight mb-1">{task.name}</h4>
                                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Trigger: {task.trigger} • Action: {task.action}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             <Button variant="outline" className={cn(
                                 "text-[10px] font-black rounded-full h-8 px-4",
                                 task.active ? "border-emerald-500/30 text-emerald-400" : "border-white/10 text-white/20"
                             )}>
                                 {task.active ? 'OPERATIONAL' : 'PAUSED'}
                             </Button>
                             <span className="text-[9px] text-white/10 font-bold">COMMIT_ID: ABX-98</span>
                        </div>
                    </Card>
                ))}
             </div>
        </TabsContent>

        <TabsContent value="infra" className="mt-0">
             <Card className="bg-black border-white/10 rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent" />
                <Server className="h-24 w-24 text-emerald-500 animate-pulse opacity-20" />
                <div>
                    <h3 className="text-3xl font-black italic tracking-tighter mb-4">Neural Cluster Status</h3>
                    <p className="text-white/30 max-w-xl mx-auto leading-relaxed">
                        El sistema está operando sobre 22 nodos activos con una convergencia del 98.4%. Todos los microservicios de IA, Watermarking y CRM están sincronizados.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button className="bg-white text-black font-black rounded-xl px-10">REBOTAR CLUSTER</Button>
                    <Button variant="outline" className="border-white/10 text-white/60">AUDITORÍA FULL</Button>
                </div>
             </Card>
        </TabsContent>
      </Tabs>

      {/* FOOTER DE ADMIN */}
      <div className="p-8 rounded-[2.5rem] bg-black border border-white/5 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-600/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.6em] mb-2 opacity-50">
          SYSTEM MASTER COMMAND CENTER — INFRAESTRUCTURA PROTEGIDA © 2026
        </p>
      </div>

    </div>
  );
}

function MetricTile({ label, value, sub, icon: Icon, color }: any) {
    return (
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center group hover:bg-white/[0.04] transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-all" />
            <div className={cn("p-4 rounded-2xl bg-white/5 mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.05)]", color)}>
                <Icon className="h-8 w-8" />
            </div>
            <div className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">{label}</div>
            <div className="text-5xl font-black text-white tracking-tighter">{value}</div>
            <div className="text-[10px] font-bold text-white/20 mt-3 uppercase tracking-tighter">{sub}</div>
        </div>
    );
}
