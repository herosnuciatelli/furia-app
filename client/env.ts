import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  NEXT_PUBLIC_DOMAIN: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
