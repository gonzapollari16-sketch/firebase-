/**
 * @fileOverview Definición de tipos global para CRUSHOME.
 * Centraliza el contrato de datos para evitar dependencias circulares y fallos de compilación.
 */

export type UserRole = 'ADMIN' | 'CEO' | 'OWNER' | 'AGENT' | 'MARKETING' | 'USER' | 'DEV';
export type SubscriptionPlan = 'FREE' | 'STARTER' | 'PRO' | 'PREMIUM' | 'ENTERPRISE';
export type UserType = 'normal' | 'shadow' | 'pool';
export type PropertyStatus = 'active' | 'pending_review' | 'reservada' | 'vendida' | 'alquilada';

export interface Property {
  id: string;
  titulo: string;
  descripcion?: string;
  precio: number;
  moneda: string;
  expensas?: number;
  tipo: string;
  operacion: string;
  ambientes: number;
  dormitorios: number;
  banos: string;
  metros: number; 
  supTotal: number;
  supCubierta: number;
  calle: string;
  numero: string;
  piso: string;
  unidad: string;
  barrio: string;
  ciudad: string;
  provincia: string;
  zona?: string;
  lat: number;
  lng: number;
  cochera: boolean;
  aptoCredito: boolean;
  escritura: boolean;
  pozo: boolean;
  aEstrenar: boolean;
  destacado: boolean;
  imagen: string;
  imageHint?: string;
  userId: string;
  tenantId: string;
  status: PropertyStatus;
  matchPercentage?: number;
  deduplicationResolution?: string | null;
  createdAt: any;
  updatedAt: any;
}

export interface Filters {
  operacion?: string;
  tipo?: string;
  precioMin?: number;
  precioMax?: number;
  moneda?: string;
  provincia?: string;
  ciudad?: string;
  barrio?: string;
  ambientes?: number;
  banos?: string;
  aEstrenar?: boolean;
  aptoCredito?: boolean;
  escritura?: boolean;
  pozo?: boolean;
  lat?: number;
  lng?: number;
}

export interface SearchHistoryItem {
  id: string;
  userId: string;
  text?: string;
  iaQuery?: string;
  filters?: Filters;
  bestScore?: number;
  urgency?: 'baja' | 'media' | 'alta';
  userName?: string;
  timestamp?: any;
  date?: any;
}

export interface AdCampaign {
  id: string;
  name: string;
  tenantId: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  platform: ('facebook' | 'instagram' | 'google' | 'whatsapp')[];
  dailyBudget: number;
  spend: number;
  leads: number;
  ctr: number;
  roas: number;
  createdAt: string;
  updatedAt?: string;
}

export type AdPlacement = {
  id: string;
  name: string;
  description?: string;
  allowedFormats: ('image' | 'video' | 'text' | 'carousel')[];
  dimensions: {
    width: number;
    height: number;
  };
  location: 'feed' | 'story' | 'sidebar' | 'search' | 'interstitial';
};

export type Advertiser = {
  id: string;
  name: string;
  industry: string;
  contactEmail: string;
  activeCampaigns: string[];
};

export type Ad = {
  id: string;
  campaignId: string;
  placementId: string;
  creativeId: string;
  status: 'active' | 'paused' | 'pending' | 'rejected';
  targeting: any;
  analytics: {
    impressions: number;
    clicks: number;
    conversions: number;
  };
};

export type AdCreative = {
  id: string;
  type: 'image' | 'video' | 'text' | 'carousel';
  assetUrl: string;
  title: string;
  body: string;
  callToAction: string;
};
