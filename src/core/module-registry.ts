
'use client';

/**
 * @fileOverview Registro de Módulos CRUSHOME v5.0 - Ecosistema Consolidado.
 * Sincronizado con los 22 puntos del Master Plan y la arquitectura CDOS.
 */

import { 
  PlusCircle, Sparkles, History, Map as MapIcon, Users, 
  Megaphone, Globe, Bell, BarChart3, Settings, Zap, 
  Cpu, Smartphone, LayoutTemplate, CreditCard, Target, 
  Activity, Briefcase, LogIn, Shield, PackageCheck,
  Calculator
} from 'lucide-react';

export interface ModuleDefinition {
  id: string;
  name: string;
  route: string;
  category: 'inventory' | 'search' | 'intelligence' | 'communication' | 'marketing' | 'admin' | 'cognitive' | 'billing';
  featureKey: string;
  icon: any;
  order: number;
}

export const CRUSHOME_MODULES: ModuleDefinition[] = [
  { id: '1', name: '1. Carga Propiedades', route: '/property/add', category: 'inventory', featureKey: 'properties:manage', icon: PlusCircle, order: 1 },
  { id: '2', name: '2. CrushIA Master', route: '/property/search', category: 'search', featureKey: 'search:ai', icon: Sparkles, order: 2 },
  { id: '3', name: '3. Historial Intención', route: '/my-searches', category: 'search', featureKey: 'search:ai', icon: History, order: 3 },
  { id: '4', name: '4. Mapa Inteligente', route: '/intelligence/map', category: 'intelligence', featureKey: 'map:intelligent', icon: MapIcon, order: 4 },
  { id: '5', name: '5. Comunidad (ICP)', route: '/intelligence/community', category: 'communication', featureKey: 'community:private-network', icon: Users, order: 5 },
  { id: '6', name: '6. Anunciantes Hub', route: '/intelligence/advertisers', category: 'marketing', featureKey: 'ads:manage', icon: Megaphone, order: 6 },
  { id: '7', name: '7. Difusión Sindicada', route: '/intelligence/syndication', category: 'marketing', featureKey: 'syndication:portals', icon: Globe, order: 7 },
  { id: '8', name: '8. Feed & Notificaciones', route: '/communication-hub', category: 'communication', featureKey: 'properties:view', icon: Bell, order: 8 },
  { id: '9', name: '9. Soporte & Reportes', route: '/reports', category: 'admin', featureKey: 'audit:view', icon: BarChart3, order: 9 },
  { id: '10', name: '10. Automatizaciones', route: '/admin', category: 'admin', featureKey: 'admin:access', icon: Zap, order: 10 },
  { id: '11', name: '11. Mejoras UX', route: '/', category: 'admin', featureKey: 'admin:access', icon: Settings, order: 11 },
  { id: '12', name: '12. Neural Assistant', route: '/ai-assistant', category: 'cognitive', featureKey: 'search:ai', icon: Cpu, order: 12 },
  { id: '13', name: '13. WhatsApp Kernel', route: '/intelligence/whatsapp', category: 'communication', featureKey: 'whatsapp:api', icon: Smartphone, order: 13 },
  { id: '14', name: '14. Ads Meta Engine', route: '/intelligence/advertisers', category: 'marketing', featureKey: 'ads:advanced', icon: Target, order: 14 },
  { id: '15', name: '15. Motor de Precio (ACM)', route: '/dashboard/pricing-engine', category: 'billing', featureKey: 'billing:manage', icon: Calculator, order: 15 },
  { id: '16', name: '16. Master Plan (Blueprint)', route: '/engineering-blueprint', category: 'cognitive', featureKey: 'admin:access', icon: PackageCheck, order: 16 },
  { id: '17', name: '17. Modo Procesamiento', route: '/processing-mode', category: 'cognitive', featureKey: 'admin:access', icon: Activity, order: 17 },
  { id: '18', name: '18. CRM CrushMatch', route: '/intelligence/crm', category: 'admin', featureKey: 'leads:manage', icon: Briefcase, order: 18 },
  { id: '19', name: '19. Panel Ingreso', route: '/', category: 'admin', featureKey: 'admin:access', icon: LogIn, order: 19 },
  { id: '20', name: '20. Admin Master', route: '/admin', category: 'admin', featureKey: 'admin:access', icon: Shield, order: 20 },
  { id: '21', name: '21. Análisis y Fusión 1 y 2', route: '/data-fusion', category: 'cognitive', featureKey: 'admin:access', icon: LayoutTemplate, order: 21 },
  { id: '22', name: '22. Security Kernel', route: '/security', category: 'admin', featureKey: 'admin:access', icon: Shield, order: 22 },
];

export const moduleRegistry = {
  getAll: () => [...CRUSHOME_MODULES].sort((a, b) => a.order - b.order),
  getByCategory: (category: string) => CRUSHOME_MODULES.filter(m => m.category === category),
  getById: (id: string) => CRUSHOME_MODULES.find(m => m.id === id),
};
