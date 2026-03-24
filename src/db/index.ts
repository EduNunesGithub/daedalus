import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

console.debug('[START: db-connect]');

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

console.debug('[END: db-connect]');
