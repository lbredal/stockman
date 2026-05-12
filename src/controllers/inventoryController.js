import {
  getInventoryByTenant,
  getTenantById,
  getUnitsByTenant,
  getCategoriesByTenant,
  updateBatch,
  createBatch,
  createProduct,
} from '../db/inventory.js'
import { NotFoundError } from '../errors.js'

const DEV_TENANT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

export async function getDevInventory(req, res) {
  const tenant = await getTenantById(DEV_TENANT_ID)
  if (!tenant) throw new NotFoundError('Dev tenant not found — run the seed file first')
  const products = await getInventoryByTenant(DEV_TENANT_ID)
  res.json({ tenant, products })
}

export async function getDevUnits(req, res) {
  const units = await getUnitsByTenant(DEV_TENANT_ID)
  res.json(units)
}

export async function getDevCategories(req, res) {
  const categories = await getCategoriesByTenant(DEV_TENANT_ID)
  res.json(categories)
}

export async function createDevProduct(req, res) {
  const { name, description, categoryId } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'Navn er påkrevd' })
  if (!categoryId) return res.status(400).json({ error: 'Kategori er påkrevd' })
  const product = await createProduct(DEV_TENANT_ID, { name: name.trim(), description, categoryId })
  res.status(201).json(product)
}

export async function updateDevBatch(req, res) {
  const { id } = req.params
  const { quantity, status, harvestDate, expiryDate } = req.body
  const batch = await updateBatch(id, { quantity, status, harvestDate, expiryDate })
  if (!batch) throw new NotFoundError('Batch not found')
  res.json(batch)
}

export async function createDevBatch(req, res) {
  const { productId, unitId, quantity, status, harvestDate, expiryDate } = req.body
  const batch = await createBatch(productId, unitId, { quantity, status, harvestDate, expiryDate })
  res.status(201).json(batch)
}
