import './src/config.js'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { config } from './src/config.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

// routes registered here as entities are added
// app.use('/api/products', productRoutes)
// app.use('/api/batches', batchRoutes)
// app.use('/api/categories', categoryRoutes)
// app.use('/api/units', unitRoutes)

app.use((err, req, res, next) => {
  const status = err.statusCode || 500
  const message = err.statusCode ? err.message : 'Internal server error'
  if (!err.statusCode) console.error(err)
  res.status(status).json({ error: message })
})

app.listen(config.port, () => {
  console.log(`Stockman API running on port ${config.port}`)
})

export { app }
