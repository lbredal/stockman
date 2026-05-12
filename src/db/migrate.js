import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { pool } from './pool.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const migrationsDir = join(__dirname, 'migrations')

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id         SERIAL PRIMARY KEY,
      filename   TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)

  const applied = await pool.query('SELECT filename FROM migrations')
  const appliedSet = new Set(applied.rows.map(r => r.filename))

  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    if (appliedSet.has(file)) continue

    const sql = readFileSync(join(migrationsDir, file), 'utf8')
    const up = sql.split('-- down')[0].replace('-- up', '').trim()

    console.log(`Applying migration: ${file}`)
    await pool.query(up)
    await pool.query('INSERT INTO migrations (filename) VALUES ($1)', [file])
  }

  console.log('Migrations complete.')
  await pool.end()
}

migrate().catch(err => {
  console.error(err)
  process.exit(1)
})
