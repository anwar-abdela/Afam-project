-- Migration: Add categories table and update products table
-- Run this SQL in your PostgreSQL database (shop_db) to apply the schema changes

-- 1. Create the categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Add the category_id foreign key column to products (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'category_id'
    ) THEN
        ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE RESTRICT;
    END IF;
END $$;

-- 3. (Optional) Drop old category text column if it exists and is no longer needed
-- WARNING: Only run this if you have no important data in the old 'category' column
-- DO $$
-- BEGIN
--     IF EXISTS (
--         SELECT 1 FROM information_schema.columns
--         WHERE table_name = 'products' AND column_name = 'category'
--     ) THEN
--         ALTER TABLE products DROP COLUMN category;
--     END IF;
-- END $$;

SELECT 'Migration completed successfully!' AS status;
