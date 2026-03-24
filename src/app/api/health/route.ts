import { db } from '@/db/index';
import { sql } from 'drizzle-orm';

export async function GET() {
  console.debug('[START: health-check]');

  try {
    await db.execute(sql`SELECT 1`);

    console.debug('[END: health-check]', { status: 'ok' });

    return Response.json({ status: 'ok' });
  } catch (error) {
    console.debug('[END: health-check]', { status: 'error', error });

    return Response.json({ status: 'error' }, { status: 500 });
  }
}
