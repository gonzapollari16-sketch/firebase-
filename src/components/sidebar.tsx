'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  PlusCircle, 
  Users, 
  Megaphone, 
  Globe, 
  Bell, 
  MessageSquare, 
  Target, 
  Calculator, 
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const sidebarConfig = [
  {
    section: "EXPLORACIÓN & IA",
    items: [
      { label: 'Inicio', href: '/', icon: Home },
    ]
  },
  {
    section: "OPERACIONES",
    items: [
      { label: '1. Carga Propiedades', href: '/property/add', icon: PlusCircle },
    ]
  },
  {
    section: "ECOSISTEMA",
    items: [
      { label: '5. Comunidad (ICP)', href: '/community', icon: Users },
      { label: '6. Anunciantes Hub', href: '/advertisers', icon: Megaphone },
      { label: '7. Difusión Sindicada', href: '/syndication', icon: Globe },
      { label: '8. Feed & Notificaciones', href: '/notifications', icon: Bell },
      { label: '13. WhatsApp Kernel', href: '/whatsapp', icon: MessageSquare },
      { label: '14. Ads Meta Engine', href: '/ads', icon: Target },
      { label: '15. Motor de Precio (ACM)', href: '/pricing-engine', icon: Calculator },
    ]
  },
  {
    section: "ADMINISTRACIÓN",
    items: [
      { label: '9. Soporte & Reportes', href: '/reports', icon: BarChart3 },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 z-40 transition-all duration-500 ease-in-out border-r border-white/5",
        collapsed ? "w-20" : "w-72",
        "bg-[#050614]" // Color ultra oscuro como se ve en la imagen
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 h-20">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <span className="text-sm font-black tracking-[0.3em] text-white/90">CRUSHOME</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        {sidebarConfig.map((section, idx) => (
          <div key={idx} className="mb-10">
            {!collapsed && (
              <h3 className="px-4 mb-4 text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                      isActive 
                        ? "bg-accent/10 text-accent border border-accent/20" 
                        : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <Icon 
                      size={20} 
                      className={cn(
                        "shrink-0",
                        isActive ? "text-accent" : "text-white/40 group-hover:text-white"
                      )} 
                    />
                    {!collapsed && (
                      <span className="text-[13px] font-bold tracking-tight whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                    {isActive && !collapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(255,79,216,0.8)]"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Status */}
      {!collapsed && (
        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-4 rounded-3xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
            </div>
            <div>
              <p className="text-[10px] font-black text-white px-1">RED NEURAL</p>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-1">Activa v5.0</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
