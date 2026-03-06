
-- CRUSHOME ENTERPRISE DATABASE SCHEMA
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Core: Tenants & Plans
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free', -- free, starter, pro, premium, enterprise
    icp_score INTEGER DEFAULT 75,
    ghost_mode BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core: Users & RBAC
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL, -- admin, manager, agent, developer, particular
    name TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory: Properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(15,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    property_type TEXT NOT NULL, -- casa, departamento, ph, terreno, etc.
    operation_type TEXT NOT NULL, -- venta, alquiler
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    surface_total NUMERIC(10,2),
    surface_covered NUMERIC(10,2),
    address TEXT,
    zone TEXT,
    geom GEOGRAPHY(Point, 4326),
    status TEXT DEFAULT 'active',
    quality_score FLOAT DEFAULT 0.5,
    liquidity_score FLOAT DEFAULT 0.5,
    opportunity_score FLOAT DEFAULT 0.5,
    meta JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Intelligence: Market Metrics
CREATE TABLE market_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone TEXT NOT NULL,
    demand_index FLOAT,
    supply_index FLOAT,
    absorption_speed FLOAT,
    avg_price_sqm NUMERIC(10,2),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration: MLS & ICP
CREATE TABLE cooperation_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    event_type TEXT NOT NULL, -- SHARED_PROPERTY, LEAD_GIVEN, COLLAB_SALE
    related_tenant_id UUID REFERENCES tenants(id),
    property_id UUID REFERENCES properties(id),
    weight FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Infrastructure: Audit & Telemetry
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices
CREATE INDEX idx_properties_geom ON properties USING GIST (geom);
CREATE INDEX idx_properties_tenant ON properties(tenant_id);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id);
