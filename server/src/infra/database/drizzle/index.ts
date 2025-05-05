import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../../../env'

import * as schema from './schema/schema'

config({ path: '.env' }) // or .env.local

const client = postgres(env.DATABASE_URL)
export const db = drizzle({ client, schema })
