import { Router } from 'express'
import {
  getDevInventory,
  getDevUnits,
  getDevCategories,
  updateDevBatch,
  createDevBatch,
  createDevProduct,
} from '../controllers/inventoryController.js'

const router = Router()
const w = fn => (req, res, next) => fn(req, res).catch(next)

router.get('/inventory',       w(getDevInventory))
router.get('/units',           w(getDevUnits))
router.get('/categories',      w(getDevCategories))
router.put('/batches/:id',     w(updateDevBatch))
router.post('/batches',        w(createDevBatch))
router.post('/products',       w(createDevProduct))

export default router
