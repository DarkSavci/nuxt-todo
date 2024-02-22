import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
// const client = dev ? postgres(DATABASE_URL) : postgres(DATABASE_URL, { ssl: 'require' });
const client = postgres(process.env.DATABASE_URL as string);
export const db = drizzle(client, { schema });
export const adapter = new DrizzlePostgreSQLAdapter(db, schema.sessions, schema.users);