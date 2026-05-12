-- up

ALTER TABLE products ADD COLUMN image_url TEXT;

-- down

ALTER TABLE products DROP COLUMN image_url;
