import 'dotenv/config'

const REQUIRED = ['DATABASE_URL']

for (const key of REQUIRED) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`)
    process.exit(1)
  }
}

export const config = {
  databaseUrl: process.env.DATABASE_URL,
  port: parseInt(process.env.PORT) || 3000,
}
