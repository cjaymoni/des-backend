/**
 * Runs the full TENANT_SCHEMA_SQL against all existing tenant schemas.
 * Safe to re-run — all statements use IF NOT EXISTS / IF EXISTS guards.
 * Run with: npx ts-node -r tsconfig-paths/register src/migrations/add-email-logs.ts
 */
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { TENANT_SCHEMA_SQL } from '../config/tenant-schema.sql';
dotenv.config();

async function run() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const { rows } = await client.query<{ schema_name: string }>(`
    SELECT schema_name FROM information_schema.schemata
    WHERE schema_name LIKE 'tenant_%'
    ORDER BY schema_name
  `);

  if (!rows.length) {
    console.log('No tenant schemas found.');
    await client.end();
    return;
  }

  console.log(`Found ${rows.length} tenant schema(s). Running migrations...\n`);

  for (const { schema_name } of rows) {
    try {
      await client.query(`SET search_path TO "${schema_name}"`);
      await client.query(TENANT_SCHEMA_SQL);
      console.log(`✓ ${schema_name}`);
    } catch (err) {
      console.error(`✗ ${schema_name}:`, (err as Error).message);
    }
  }

  await client.end();
  console.log('\nDone.');
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
