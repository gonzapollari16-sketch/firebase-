"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth, useUser } from "@/firebase/provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LogOut, 
  Eye,
  Settings,
  Bell,
  XCircle
} from "lucide-react";
import { useCore } from '@/core/use-core';
import { Badge } from './ui/badge';

export default function Header({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const { user } = useUser();
  const { profile, role, _store, experienceLogs } = useCore();
  const impersonatingUser = _store(s => s.impersonatingUser);

  if (!user) return <div className="bg-[#07081a] min-h-screen">{children}</div>;

  return (
    <div className="bg-[#07081a] text-white min-h-screen flex flex-col font-sans selection:bg-accent/30 selection:text-white">
      
      {impersonatingUser && (
        <div className="bg-amber-600 p-2 text-center text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 border-b border-white/10 relative z-[70]">
          <div className="flex items-center gap-2">
            <Eye className="w-3 h-3" /> NAVEGANDO COMO: {impersonatingUser.email} ({impersonatingUser.role})
          </div>
          <button onClick={() => _store.getState().setImpersonation(null)} className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full hover:bg-black/40 transition-colors">
            <XCircle className="w-3 h-3" /> SALIR
          </button>
        </div>
      )}

      <header className="sticky top-0 z-50 flex h-20 items-center justify-between gap-4 px-6 md:px-10 bg-[#07081a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="hidden lg:block">
            <h1 className="text-xl font-black italic tracking-tighter opacity-40 uppercase tracking-[0.2em]">Consola de Operaciones</h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
              {experienceLogs[0]?.action || "SISTEMA SINCRONIZADO"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white/40 hover:text-white rounded-xl">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-2xl border border-white/5 p-0 bg-white/5 hover:bg-white/10 transition-all overflow-hidden">
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={user.photoURL || `https://avatar.vercel.sh/${user.email}.png`} />
                    <AvatarFallback className="bg-accent text-white font-black rounded-none">U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-[#151737] border-white/10 rounded-[2rem] p-4 shadow-2xl text-white" align="end">
                <DropdownMenuLabel className="mb-4">
                  <p className="text-lg font-black italic tracking-tight">{profile?.name || user.email?.split("@")[0]}</p>
                  <Badge className="w-fit mt-2 bg-accent text-white font-black text-[9px] tracking-[0.2em] uppercase border-none">{role}</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem asChild className="rounded-xl p-3 focus:bg-white/5 cursor-pointer mt-4 group">
                   <Link href="/settings" className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-white/40 group-hover:text-accent transition-colors" />
                    <span className="text-xs font-bold uppercase tracking-widest">Configuración</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5 mt-4" />
                <DropdownMenuItem onClick={() => auth?.signOut()} className="rounded-xl p-3 focus:bg-red-500/10 text-red-400 cursor-pointer font-black text-xs uppercase tracking-[0.2em] mt-2">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#07081a] via-[#0c0e26] to-[#07081a]">
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
