'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { label: 'Inicio', href: '/', icon: 'H' },
  { label: 'Buscador IA', href: '/property/search', icon: 'S' },
  { label: 'CrushIA', href: '/intelligence/crm', icon: 'AI' },
  { label: 'Mi Dashboard', href: '/dashboard', icon: 'D' },
  { label: 'Mis Propiedades', href: '/my-properties', icon: 'P' },
  { label: 'Mis Busquedas', href: '/my-searches', icon: 'Q' },
  { label: 'Asistente IA', href: '/ai-assistant', icon: 'A' },
  { label: 'Avatares IA', href: '/ai-avatars', icon: 'V' },
  { label: 'Inteligencia', href: '/intelligence', icon: 'I' },
  { label: 'Precios', href: '/pricing', icon: '$' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? '60px' : '220px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0f0f1a 0%, #1a0a2e 100%)',
        borderRight: '1px solid rgba(139, 92, 246, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 0',
        transition: 'width 0.3s ease',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: '0 16px 20px',
          borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
        }}
      >
        {!collapsed && (
          <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '16px', letterSpacing: '0.05em' }}>
            CRUSHOME
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '6px',
            color: '#a78bfa',
            cursor: 'pointer',
            padding: '4px 8px',
            fontSize: '14px',
          }}
        >
          {collapsed ? '->' : '<-'}
        </button>
      </div>

      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                background: isActive ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                borderLeft: isActive ? '3px solid #8b5cf6' : '3px solid transparent',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
