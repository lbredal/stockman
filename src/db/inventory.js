import { pool } from './pool.js'

export async function getInventoryByTenant(tenantId) {
  const { rows } = await pool.query(
    `SELECT
       p.id           AS product_id,
       p.name         AS product_name,
       p.description  AS product_description,
       p.image_url    AS image_url,
       c.name         AS category_name,
       b.id           AS batch_id,
       b.quantity,
       b.status,
       b.harvest_date,
       b.expiry_date,
       u.name         AS unit_name,
       u.abbreviation AS unit_abbreviation
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN batches b ON b.product_id = p.id
     LEFT JOIN units u ON u.id = b.unit_id
     WHERE p.tenant_id = $1
     ORDER BY p.name, b.harvest_date DESC`,
    [tenantId]
  )

  const productMap = new Map()
  for (const row of rows) {
    if (!productMap.has(row.product_id)) {
      productMap.set(row.product_id, {
        id: row.product_id,
        name: row.product_name,
        description: row.product_description,
        imageUrl: row.image_url,
        category: row.category_name,
        batches: [],
      })
    }
    if (row.batch_id) {
      productMap.get(row.product_id).batches.push({
        id: row.batch_id,
        quantity: Number(row.quantity),
        status: row.status,
        harvestDate: row.harvest_date,
        expiryDate: row.expiry_date,
        unit: row.unit_name,
        unitAbbreviation: row.unit_abbreviation,
      })
    }
  }

  return [...productMap.values()]
}

export async function getTenantById(tenantId) {
  const { rows } = await pool.query(
    'SELECT id, name FROM tenants WHERE id = $1',
    [tenantId]
  )
  return rows[0] ?? null
}

export async function getUnitsByTenant(tenantId) {
  const { rows } = await pool.query(
    'SELECT id, name, abbreviation FROM units WHERE tenant_id = $1 ORDER BY name',
    [tenantId]
  )
  return rows
}

export async function getCategoriesByTenant(tenantId) {
  const { rows } = await pool.query(
    'SELECT id, name FROM categories WHERE tenant_id = $1 ORDER BY name',
    [tenantId]
  )
  return rows
}

export async function createProduct(tenantId, { name, description, categoryId }) {
  const { rows } = await pool.query(
    `INSERT INTO products (tenant_id, category_id, name, description)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [tenantId, categoryId, name, description || null]
  )
  return rows[0]
}

export async function updateBatch(id, { quantity, status, harvestDate, expiryDate }) {
  const { rows } = await pool.query(
    `UPDATE batches
     SET quantity = $1, status = $2, harvest_date = $3, expiry_date = $4, updated_at = now()
     WHERE id = $5
     RETURNING *`,
    [quantity, status, harvestDate || null, expiryDate || null, id]
  )
  return rows[0] ?? null
}

export async function createBatch(productId, unitId, { quantity, status, harvestDate, expiryDate }) {
  const { rows } = await pool.query(
    `INSERT INTO batches (product_id, unit_id, quantity, status, harvest_date, expiry_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [productId, unitId, quantity, status, harvestDate || null, expiryDate || null]
  )
  return rows[0]
}
