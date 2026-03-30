'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronLeft,
  ChevronRight,
  Activity,
  Zap,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { CRUSHOME_MODULES } from '@/core/module-registry';

const categoryLabels: Record<string, string> = {
  search: "Exploración & IA",
  inventory: "Operaciones",
  intelligence: "Ecosistema",
  communication: "Ecosistema",
  marketing: "Ecosistema",
  admin: "Administración",
  cognitive: "Núcleos Cognitivos",
  billing: "Ecosistema",
};

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const groupedModules = useMemo(() => {
    const groups: Record<string, typeof CRUSHOME_MODULES> = {};
    CRUSHOME_MODULES.forEach(module => {
      const label = categoryLabels[module.category] || "Otros";
      if (!groups[label]) groups[label] = [];
      groups[label].push(module);
    });
    return groups;
  }, []);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 z-40 transition-all duration-500 ease-in-out border-r border-white/5",
        collapsed ? "w-20" : "w-72",
        "bg-[#050614]" 
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 h-20">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-indigo-600 flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
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
      <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-white/5">
        {Object.entries(groupedModules).map(([category, items]) => (
          <div key={category} className="mb-8">
            {!collapsed && (
              <h3 className="px-4 mb-4 text-[10px] font-black tracking-[0.4em] text-white/20 uppercase transition-opacity duration-300">
                {category}
              </h3>
            )}
            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.route;
                
                return (
                  <Link
                    key={item.id}
                    href={item.route}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                      isActive 
                        ? "bg-accent/10 text-accent border border-accent/20" 
                        : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <Icon 
                      size={18} 
                      className={cn(
                        "shrink-0 transition-transform duration-300 group-hover:scale-110",
                        isActive ? "text-accent" : "text-white/40 group-hover:text-white"
                      )} 
                    />
                    {!collapsed && (
                      <span className="text-[12px] font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.name}
                      </span>
                    )}
                    {isActive && !collapsed && (
                      <div className="ml-auto w-1 h-1 rounded-full bg-accent shadow-[0_0_8px_rgba(255,79,216,0.8)]"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Neural Core / Self-Feeding Status */}
      {!collapsed ? (
        <div className="p-6 mt-auto border-t border-white/5 bg-accent/5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-white/40 tracking-widest">NEURAL CORE v5.0</span>
              <Activity size={12} className="text-accent animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase tracking-tighter">
                <span>Auto-Feedback</span>
                <span className="text-accent">98.4%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent animate-[width_2s_ease-in-out_infinite]" style={{ width: '98%' }}></div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 group cursor-help transition-all hover:bg-white/10">
              <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                <Zap size={14} className="text-accent" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] font-black text-white leading-none mb-1">PROCESANDO</p>
                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest truncate">Sincronizando 22 Nodos...</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 flex justify-center border-t border-white/5">
          <Activity size={18} className="text-accent animate-pulse" />
        </div>
      )}
    </aside>
  );
}
