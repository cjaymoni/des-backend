/**
 * Seed script: pushes test data for the warehouse module into a tenant schema.
 * Usage: npx ts-node src/seed-warehouse.ts <subdomain>
 *
 * Example: npx ts-node src/seed-warehouse.ts des
 *
 * What it creates:
 *   - 3 rent charge brackets (Day 1-7 free, Day 8-14 @ 11.64, Day 15-1000 @ 23.27)
 *   - 1 master manifest (BL: WH-BL-2024-001)
 *   - 2 house manifests (HBL-WH-001, HBL-WH-002) — both available for warehouse
 *   - 1 warehouse job for HBL-WH-001 (42 days → GHC 733.04 rent)
 *   - HBL-WH-002 left available to test the create flow
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { TENANT_SCHEMA_SQL } from './config/tenant-schema.sql';
dotenv.config();

const subdomain = process.argv[2];
if (!subdomain) {
  console.error('Usage: npx ts-node src/seed-warehouse.ts <subdomain>');
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

    // ── 0. Apply schema DDL (idempotent — safe to run on existing tenants) ───
    await q.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
    await q.query(`SET LOCAL search_path TO "${schema}"`);
    await q.query(TENANT_SCHEMA_SQL);
    console.log('✅ Schema DDL applied');

    // ── 1. Rent Charge Brackets ──────────────────────────────────────────────
    await q.query(`
      INSERT INTO rent_charges ("dayFrom", "dayTo", "unitCharge", "createdBy")
      VALUES
        (1,   7,    0.00,  'seed'),
        (8,   14,  11.64,  'seed'),
        (15,  1000, 23.27, 'seed')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Rent charge brackets inserted');

    // ── 2. Master Manifest ───────────────────────────────────────────────────
    const masterResult = await q.query(`
      INSERT INTO master_manifests (
        "blNo", "containerNo", "vessel", "voyage",
        "arrivalDate", "destination", "portLoad", "createdBy"
      ) VALUES (
        'WH-BL-2024-001', 'CONT-WH-001', 'MV ATLANTIC STAR', 'V-2024-11',
        '2024-11-20', 'TEMA', 'SHANGHAI', 'seed'
      )
      ON CONFLICT DO NOTHING
      RETURNING id
    `);

    let masterId: string;
    if (masterResult.length > 0) {
      masterId = masterResult[0].id;
    } else {
      const existing = await q.query(
        `SELECT id FROM master_manifests WHERE "blNo" = 'WH-BL-2024-001'`,
      );
      masterId = existing[0].id;
    }
    console.log(`✅ Master manifest: WH-BL-2024-001 (${masterId})`);

    // ── 3. House Manifests ───────────────────────────────────────────────────
    const house1Result = await q.query(`
      INSERT INTO house_manifests (
        "masterManifestId", "hblNo", "shipper", "consignee",
        "description", "noPkg", "weight", "totalCBM",
        "marksNum", "handCharge", "fileDate",
        "readStatusW", "releaseStatus", "createdBy"
      ) VALUES (
        '${masterId}', 'HBL-WH-001', 'SHANGHAI EXPORTS CO.',
        'ACCRA IMPORTS LTD',
        'ELECTRONICS AND HOUSEHOLD APPLIANCES',
        25, 1250.50, 12.75,
        'AS ADDRESSED', 0, '2024-11-22',
        true, false, 'seed'
      )
      ON CONFLICT DO NOTHING
      RETURNING id
    `);

    let house1Id: string;
    if (house1Result.length > 0) {
      house1Id = house1Result[0].id;
    } else {
      const existing = await q.query(
        `SELECT id FROM house_manifests WHERE "hblNo" = 'HBL-WH-001'`,
      );
      house1Id = existing[0].id;
    }

    const house2Result = await q.query(`
      INSERT INTO house_manifests (
        "masterManifestId", "hblNo", "shipper", "consignee",
        "description", "noPkg", "weight", "totalCBM",
        "marksNum", "handCharge", "fileDate",
        "readStatusW", "releaseStatus", "createdBy"
      ) VALUES (
        '${masterId}', 'HBL-WH-002', 'GUANGZHOU TRADING LTD',
        'KUMASI WHOLESALE DEPOT',
        'TEXTILE FABRICS AND GARMENTS',
        40, 850.00, 8.20,
        'KWD-2024-002', 0, '2024-11-22',
        true, false, 'seed'
      )
      ON CONFLICT DO NOTHING
      RETURNING id
    `);

    let house2Id: string;
    if (house2Result.length > 0) {
      house2Id = house2Result[0].id;
    } else {
      const existing = await q.query(
        `SELECT id FROM house_manifests WHERE "hblNo" = 'HBL-WH-002'`,
      );
      house2Id = existing[0].id;
    }
    console.log(`✅ House manifests: HBL-WH-001 (${house1Id}), HBL-WH-002 (${house2Id})`);

    // ── 4. Warehouse Job for HBL-WH-001 ─────────────────────────────────────
    // unstuffDate=2024-11-22, deliveryDate=2025-01-02 → 42 days
    // Day 1-7:   7  × 0.00  =   0.00
    // Day 8-14:  7  × 11.64 =  81.48
    // Day 15+:  28  × 23.27 = 651.56
    // rentCharge = 733.04
    // vatAmt  = 733.04 × 15%   = 109.96
    // nhilAmt = 733.04 × 2.5%  =  18.33
    // gfdAmt  = 733.04 × 0.5%  =   3.67
    // covidAmt= 733.04 × 1%    =   7.33
    // grandTotal = 733.04 + 109.96 + 18.33 + 3.67 + 7.33 = 872.33
    await q.query(`
      INSERT INTO warehouse_jobs (
        "jobNo", "hblNo", "houseManifestId", "consigneeDetails",
        "noPkg", "weight", "totalCBM", "marksNum",
        "containerNo", "vessel", "blNo",
        "description", "agentName",
        "period", "unitCharge", "rentCharge", "netRentCharge",
        "vatPer", "vatAmt",
        "nhilPer", "nhilAmt",
        "gfdPer", "gfdAmt",
        "covidPer", "covidAmt",
        "grandTotal",
        "cargoType", "cargoTypeLevel", "cargoTypeAmt",
        "fileDate", "unstuffDate", "deliveryDate", "arrivalDate",
        "paidStatus", "calcStatus", "incvatStatus",
        "createdBy"
      ) VALUES (
        'WH-2024-001', 'HBL-WH-001', '${house1Id}', 'ACCRA IMPORTS LTD',
        25, 1250.50, 12.75, 'AS ADDRESSED',
        'CONT-WH-001', 'MV ATLANTIC STAR', 'WH-BL-2024-001',
        'ELECTRONICS AND HOUSEHOLD APPLIANCES', 'DES FREIGHT AGENTS',
        42, 23.27, 733.04, 733.04,
        15.00, 109.96,
        2.50,  18.33,
        0.50,   3.67,
        1.00,   7.33,
        872.33,
        'GENERAL', 1, 0.00,
        '2024-11-22', '2024-11-22', '2025-01-02', '2024-11-20',
        false, true, false,
        'seed'
      )
      ON CONFLICT ("jobNo") DO NOTHING
    `);

    // Mark HBL-WH-001 as processed
    await q.query(`
      UPDATE house_manifests SET "readStatusW" = false
      WHERE "hblNo" = 'HBL-WH-001'
    `);
    console.log('✅ Warehouse job WH-2024-001 inserted (HBL-WH-001 marked processed)');

    await q.commitTransaction();

    console.log('\n─────────────────────────────────────────────');
    console.log(`✅ Warehouse seed complete for schema: ${schema}`);
    console.log('─────────────────────────────────────────────');
    console.log('\nTest endpoints (x-org-name:', subdomain, '):\n');
    console.log('  # List rent charge brackets');
    console.log('  GET  /warehouse/rent-charges\n');
    console.log('  # List available HBLs (should return HBL-WH-002 only)');
    console.log('  GET  /warehouse/jobs/available-hbls\n');
    console.log('  # Preview rent for 42-day stay');
    console.log('  GET  /warehouse/jobs/preview-rent?unstuffDate=2024-11-22&deliveryDate=2025-01-02\n');
    console.log('  # List warehouse jobs (should return WH-2024-001)');
    console.log('  GET  /warehouse/jobs\n');
    console.log('  # Create a new job using HBL-WH-002:');
    console.log(`  houseManifestId: ${house2Id}`);
    console.log('  POST /warehouse/jobs');
  } catch (err) {
    await q.rollbackTransaction();
    console.error('❌ Seed failed:', err);
  } finally {
    await q.release();
    await ds.destroy();
  }
}

seed();
