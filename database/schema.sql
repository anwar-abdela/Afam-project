-- ============================================================
-- SHOP MANAGEMENT SYSTEM - PostgreSQL Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    TEXT NOT NULL,       -- bcrypt hashed
    role        VARCHAR(20) NOT NULL DEFAULT 'viewer'
                    CHECK (role IN ('admin', 'member', 'viewer')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(200) NOT NULL,
    sku             VARCHAR(100) NOT NULL UNIQUE,
    category        VARCHAR(100),
    quantity        INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    purchase_price  NUMERIC(12,2) NOT NULL CHECK (purchase_price >= 0),
    selling_price   NUMERIC(12,2) NOT NULL CHECK (selling_price >= 0),
    is_archived     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_sku        ON products(sku);
CREATE INDEX idx_products_category   ON products(category);
CREATE INDEX idx_products_is_archived ON products(is_archived);

-- auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SALES TABLE
-- ============================================================
CREATE TABLE sales (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity    INTEGER NOT NULL CHECK (quantity > 0),
    unit_price  NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(14,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    profit      NUMERIC(14,2) NOT NULL,   -- (selling_price - purchase_price) * quantity
    sale_date   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sales_product_id ON sales(product_id);
CREATE INDEX idx_sales_sale_date  ON sales(sale_date);

-- ============================================================
-- SAVINGS MEMBERS TABLE
-- ============================================================
CREATE TABLE savings_members (
    id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name      VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_savings_members_active ON savings_members(is_active);

-- ============================================================
-- SAVINGS CONTRIBUTIONS TABLE
-- ============================================================
CREATE TABLE savings_contributions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id   UUID NOT NULL REFERENCES savings_members(id) ON DELETE RESTRICT,
    amount      NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    date        DATE NOT NULL DEFAULT CURRENT_DATE,
    is_missed   BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_savings_contrib_member_id ON savings_contributions(member_id);
CREATE INDEX idx_savings_contrib_date      ON savings_contributions(date);
CREATE INDEX idx_savings_contrib_is_missed ON savings_contributions(is_missed);
