#!/usr/bin/env node
require('dotenv').config();
const { DataSource } = require('typeorm');

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await ds.initialize();
  const companies = await ds.query('SELECT "appSubdomain" FROM public.company');
  console.log(
    `Found ${companies.length} tenant(s):`,
    companies.map((c) => c.appSubdomain),
  );

  for (const c of companies) {
    const schema = `tenant_${c.appSubdomain}`;
    console.log(`\nMigrating schema: ${schema}`);
    const qr = ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      await qr.query(`SET LOCAL search_path TO "${schema}"`);
      await qr.query(
        `ALTER TABLE IF EXISTS "jobs" ADD COLUMN IF NOT EXISTS "version" int NOT NULL DEFAULT 1`,
      );
      await qr.query(
        `ALTER TABLE IF EXISTS "bank_accounts" ADD COLUMN IF NOT EXISTS "version" int NOT NULL DEFAULT 1`,
      );
      await qr.query(
        `ALTER TABLE IF EXISTS "house_manifests" ADD COLUMN IF NOT EXISTS "version" int NOT NULL DEFAULT 1`,
      );
      await qr.query(
        `ALTER TABLE IF EXISTS "manifest_jobs" ADD COLUMN IF NOT EXISTS "version" int NOT NULL DEFAULT 1`,
      );
      await qr.commitTransaction();
      console.log(`  ✓ Done: ${schema}`);
    } catch (err) {
      await qr.rollbackTransaction();
      console.error(`  ✗ Failed: ${schema}`, err.message);
    } finally {
      await qr.release();
    }
  }

  await ds.destroy();
  console.log('\nAll tenant schemas migrated.');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
