/**
 * One-off migration: adds email_logs table to all existing tenant schemas.
 * Run with: npx ts-node -r tsconfig-paths/register src/migrations/add-email-logs.ts
 */
import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const EMAIL_LOGS_SQL = `
  CREATE TABLE IF NOT EXISTS "email_logs" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "recipient" varchar NOT NULL,
    "subject" varchar NOT NULL,
    "body" text NOT NULL,
    "module" varchar NOT NULL,
    "userId" varchar,
    "status" varchar NOT NULL DEFAULT 'pending',
    "error" text,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    "createdBy" varchar,
    "updatedBy" varchar
  );
  CREATE INDEX IF NOT EXISTS "idx_email_logs_userId" ON "email_logs" ("userId");
  CREATE INDEX IF NOT EXISTS "idx_email_logs_module" ON "email_logs" ("module");
`;

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
  `);

  if (!rows.length) {
    console.log('No tenant schemas found.');
    await client.end();
    return;
  }

  for (const { schema_name } of rows) {
    try {
      await client.query(`SET search_path TO "${schema_name}"`);
      await client.query(EMAIL_LOGS_SQL);
      console.log(`✓ ${schema_name}`);
    } catch (err) {
      console.error(`✗ ${schema_name}:`, (err as Error).message);
    }
  }

  await client.end();
  console.log('Done.');
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
