/**
 * Seed script: pushes test data for debit note feature into a tenant schema.
 * Usage: npx ts-node src/seed-debit-note.ts <subdomain>
 *
 * Example: npx ts-node src/seed-debit-note.ts des
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const subdomain = process.argv[2];
if (!subdomain) {
  console.error('Usage: npx ts-node src/seed-debit-note.ts <subdomain>');
  process.exit(1);
}

const schema = `tenant_${subdomain}`;

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  await ds.initialize();
  const q = ds.createQueryRunner();
  await q.connect();
  await q.startTransaction();

  try {
    await q.query(`SET LOCAL search_path TO "${schema}"`);

    // 1. Transaction Purpose
    await q.query(`
      INSERT INTO transaction_purposes ("purposeCode", "purposeName")
      VALUES ('CUSTOMS', 'Customs Charges')
      ON CONFLICT ("purposeCode") DO NOTHING
    `);

    // 2. Transaction Purpose Details
    await q.query(`
      INSERT INTO transaction_purpose_details ("purposeCode", "purposeDetails")
      VALUES
        ('CUSTOMS', 'CUSTOMS DUTY'),
        ('CUSTOMS', 'EXAMINATION FEE'),
        ('CUSTOMS', 'PROCESSING FEE')
      ON CONFLICT DO NOTHING
    `);

    // 3. Job
    await q.query(`
      INSERT INTO jobs (
        "jobNo", "ie", "custRefNo", "vesselName", "invoiceNo",
        "agencyFee", "vatPer", "nhilPer", "gfdPer", "covidPer",
        "jobFinanceeName", "jobFinanceeAmount", "blNo", "fileDate",
        "vatNhilStatus", "jobStatus"
      ) VALUES (
        'TEST-JOB-001', 'ACME IMPORTS LTD', 'REF-2025-001', 'MV ATLANTIC',
        'INV-2025-001', 500.00, 15.00, 2.50, 0.00, 0.00,
        'ACME IMPORTS LTD', 15000.00, 'BL2025001', '2025-01-15',
        true, 'Active'
      )
      ON CONFLICT ("jobNo") DO NOTHING
    `);

    // 4. Job Tracking rows (debit note line items)
    await q.query(`
      INSERT INTO job_tracking (
        "jobNo", "purposeCode", "detailCode",
        "transAmount", "vatAmount", "vatStatus",
        "transBy", "transactionDate"
      ) VALUES
        ('TEST-JOB-001', 'CUSTOMS', 'CUSTOMS DUTY',    8500.00, 1275.00, true,  'admin', '2025-01-15'),
        ('TEST-JOB-001', 'CUSTOMS', 'EXAMINATION FEE',  350.00,   52.50, true,  'admin', '2025-01-15'),
        ('TEST-JOB-001', 'CUSTOMS', 'PROCESSING FEE',   200.00,   30.00, false, 'admin', '2025-01-15')
      ON CONFLICT DO NOTHING
    `);

    await q.commitTransaction();
    console.log(`✅ Seed complete for schema: ${schema}`);
    console.log(`   Job: TEST-JOB-001`);
    console.log(`   3 tracking rows inserted`);
    console.log(`\nTest the endpoint:`);
    console.log(`  GET http://localhost:5000/jobs/debit-note/TEST-JOB-001`);
    console.log(
      `  Headers: x-org-name: ${subdomain}, Authorization: Bearer <token>`,
    );
  } catch (err) {
    await q.rollbackTransaction();
    console.error('❌ Seed failed:', err);
  } finally {
    await q.release();
    await ds.destroy();
  }
}

void seed();
