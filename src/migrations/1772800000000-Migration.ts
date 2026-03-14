import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1772800000000 implements MigrationInterface {
  name = 'Migration1772800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "shipping_lines" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(100) NOT NULL UNIQUE,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        "deletedAt" timestamp,
        "createdBy" varchar,
        "updatedBy" varchar
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_shipping_lines_name" ON "shipping_lines" ("name")`,
    );

    // Migrate existing shippingLine string values into the new table
    await queryRunner.query(`
      INSERT INTO "shipping_lines" ("name")
      SELECT DISTINCT UPPER(TRIM("shippingLine"))
      FROM "master_manifests"
      WHERE "shippingLine" IS NOT NULL AND TRIM("shippingLine") <> ''
      ON CONFLICT ("name") DO NOTHING
    `);

    await queryRunner.query(
      `ALTER TABLE "master_manifests" ADD COLUMN IF NOT EXISTS "shippingLineId" uuid`,
    );

    await queryRunner.query(`
      UPDATE "master_manifests" mm
      SET "shippingLineId" = sl.id
      FROM "shipping_lines" sl
      WHERE UPPER(TRIM(mm."shippingLine")) = sl."name"
        AND mm."shippingLine" IS NOT NULL
    `);

    await queryRunner.query(
      `ALTER TABLE "master_manifests" DROP COLUMN IF EXISTS "shippingLine"`,
    );

    await queryRunner.query(`
      ALTER TABLE "master_manifests"
      ADD CONSTRAINT "fk_master_manifests_shippingLineId"
      FOREIGN KEY ("shippingLineId") REFERENCES "shipping_lines"("id") ON DELETE SET NULL
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_master_manifests_shippingLineId" ON "master_manifests" ("shippingLineId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_master_manifests_shippingLineId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_manifests" DROP CONSTRAINT IF EXISTS "fk_master_manifests_shippingLineId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_manifests" ADD COLUMN IF NOT EXISTS "shippingLine" varchar(50)`,
    );
    await queryRunner.query(`
      UPDATE "master_manifests" mm
      SET "shippingLine" = sl."name"
      FROM "shipping_lines" sl
      WHERE mm."shippingLineId" = sl."id"
    `);
    await queryRunner.query(
      `ALTER TABLE "master_manifests" DROP COLUMN IF EXISTS "shippingLineId"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_shipping_lines_name"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "shipping_lines"`);
  }
}
