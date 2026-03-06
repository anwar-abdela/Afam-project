-- Drop old text category column from products (replaced by category_id FK)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'category'
    ) THEN
        ALTER TABLE products DROP COLUMN category;
        RAISE NOTICE 'Dropped old category column';
    ELSE
        RAISE NOTICE 'Old category column does not exist, nothing to do';
    END IF;
END $$;

SELECT column_name, data_type FROM information_schema.columns WHERE table_name='products' ORDER BY ordinal_position;
