-- Seed data for Bredal Sennep (dev tenant)
-- Fixed UUIDs so re-running this file is idempotent

INSERT INTO tenants (id, name) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Bredal Sennep')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, tenant_id, email) VALUES
  ('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'lars.martin.bredal@cloudberries.no')
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, tenant_id, name) VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sennep')
ON CONFLICT (id) DO NOTHING;

INSERT INTO units (id, tenant_id, name, abbreviation) VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'glass', 'gl')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, tenant_id, category_id, name, description) VALUES
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Bredal Vanilje', 'Mild sennep med vanilje'),
  ('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Bredal Dijon', 'Klassisk dijon-stil sennep'),
  ('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Bredal Hawt', 'Sterk sennep for den modige')
ON CONFLICT (id) DO NOTHING;

UPDATE products SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Colmans_mustard_jar.jpg/200px-Colmans_mustard_jar.jpg' WHERE id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
UPDATE products SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Dijon_mustard.jpg/200px-Dijon_mustard.jpg'            WHERE id = 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
UPDATE products SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Mustard_sauce_1.jpg/200px-Mustard_sauce_1.jpg'        WHERE id = 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

INSERT INTO batches (id, product_id, unit_id, quantity, status, harvest_date, expiry_date) VALUES
  -- Bredal Vanilje
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 48, 'available', '2026-04-01', '2026-10-01'),
  ('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 12, 'reserved',  '2026-03-15', '2026-09-15'),
  -- Bredal Dijon
  ('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 36, 'available', '2026-04-15', '2026-10-15'),
  ('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 24, 'sold',      '2026-02-01', '2026-08-01'),
  -- Bredal Hawt
  ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 24, 'available', '2026-05-01', '2026-11-01'),
  ('e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',  6, 'reserved',  '2026-05-01', '2026-11-01')
ON CONFLICT (id) DO NOTHING;
