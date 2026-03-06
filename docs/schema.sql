
-- ============================================================
-- CRUSHOME ENTERPRISE DATABASE SCHEMA (POSTGRESQL 15+)
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Agencies / Tenants
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    plan TEXT NOT NULL CHECK (plan IN ('FREE', 'STARTER', 'PRO', 'PREMIUM', 'ENTERPRISE')),
    stripe_customer_id TEXT,
    agent_limit INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('ADMIN', 'OWNER', 'AGENT', 'USER')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id),
    title TEXT NOT NULL,
    price NUMERIC(15,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    geohash TEXT,
    fingerprint TEXT UNIQUE, -- Detección de duplicados
    status TEXT DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Leads
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id),
    name TEXT,
    phone TEXT,
    email TEXT,
    intent_vector JSONB, -- Almacena intención IA
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. WhatsApp Infrastructure
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id),
    wa_chat_id TEXT UNIQUE,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id),
    direction TEXT CHECK (direction IN ('inbound', 'outbound')),
    body TEXT,
    status TEXT, -- sent, delivered, read, failed
    meta_id TEXT, -- ID oficial de Meta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CRUSHOME Match Engine
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    lead_id UUID REFERENCES leads(id),
    score FLOAT CHECK (score >= 0 AND score <= 1),
    status TEXT DEFAULT 'suggested',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Audit & Logs
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID,
    event_type TEXT NOT NULL,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices
CREATE INDEX idx_prop_geo ON properties(lat, lng);
CREATE INDEX idx_lead_phone ON leads(phone);
CREATE INDEX idx_match_score ON matches(score DESC);
