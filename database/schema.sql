
-- CRUSHOME ENTERPRISE SCHEMA v2.0 (PostgreSQL 15+)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Aislamiento Multi-tenant
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    cuit TEXT UNIQUE, -- Validar CUIT Argentina
    billing_email TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    plan TEXT DEFAULT 'free',
    seats_extra INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RBAC (Role Based Access Control)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('owner', 'admin', 'agent', 'marketing')),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Motor de Suscripciones (Stripe + MP + AFIP)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    provider TEXT CHECK (provider IN ('stripe', 'mercadopago')),
    external_id TEXT UNIQUE, -- stripe_sub_id o mp_preapproval_id
    customer_id TEXT,
    plan_id TEXT NOT NULL,
    status TEXT NOT NULL,
    billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual')),
    base_price NUMERIC(15,2) NOT NULL,
    current_price NUMERIC(15,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    last_ipc_update TIMESTAMP WITH TIME ZONE,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE
);

-- 4. Fiscalidad Argentina (AFIP WSFEv1)
CREATE TABLE fiscal_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    subscription_id UUID REFERENCES subscriptions(id),
    cae TEXT,
    cae_vencimiento DATE,
    tipo_cbte INT, -- 01 (Factura A), 06 (Factura B), 11 (Factura C)
    punto_venta INT,
    nro_cbte BIGINT,
    imp_total NUMERIC(15,2),
    xml_request TEXT, -- Forensic logging
    xml_response TEXT,
    status TEXT CHECK (status IN ('pending', 'emitted', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Legal Compliance (Audit Trail)
CREATE TABLE legal_acceptances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    terms_version TEXT NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Usage & Feature Gating
CREATE TABLE usage_tracking (
    organization_id UUID PRIMARY KEY REFERENCES organizations(id),
    property_count INT DEFAULT 0,
    featured_count INT DEFAULT 0,
    ai_matches_count INT DEFAULT 0,
    api_calls_count BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices de Performance
CREATE INDEX idx_user_org ON users(organization_id);
CREATE INDEX idx_sub_org ON subscriptions(organization_id);
CREATE INDEX idx_invoice_org ON fiscal_invoices(organization_id);
CREATE INDEX idx_usage_org ON usage_tracking(organization_id);
