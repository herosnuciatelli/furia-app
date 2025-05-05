import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'
import { env } from './src/env'

config({ path: '.env' })

export default defineConfig({
  schema: './src/infra/database/drizzle/schema/schema.ts',
  out: './src/infra/database/supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
