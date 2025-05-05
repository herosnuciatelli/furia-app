import { z } from 'zod'

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(3333),

  // Database
  DATABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_URL: z.string(),
})

export const env = envSchema.parse(process.env)
