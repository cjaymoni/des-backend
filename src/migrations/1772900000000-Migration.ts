import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1772900000000 implements MigrationInterface {
  name = 'Migration1772900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "jobs"
      ALTER COLUMN "vatNhilStatus" TYPE boolean
      USING ("vatNhilStatus" != '0')
    `);
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "vatNhilStatus" SET DEFAULT false`,
    );

    await queryRunner.query(`
      ALTER TABLE "income_expenditures"
      ALTER COLUMN "vatNhilStatus" TYPE boolean
      USING ("vatNhilStatus" != '0')
    `);
    await queryRunner.query(
      `ALTER TABLE "income_expenditures" ALTER COLUMN "vatNhilStatus" SET DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "vatNhilStatus" TYPE varchar(10) USING (CASE WHEN "vatNhilStatus" THEN '1' ELSE '0' END)`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ALTER COLUMN "vatNhilStatus" SET DEFAULT '0'`,
    );

    await queryRunner.query(
      `ALTER TABLE "income_expenditures" ALTER COLUMN "vatNhilStatus" TYPE varchar(10) USING (CASE WHEN "vatNhilStatus" THEN '1' ELSE '0' END)`,
    );
    await queryRunner.query(
      `ALTER TABLE "income_expenditures" ALTER COLUMN "vatNhilStatus" SET DEFAULT '0'`,
    );
  }
}
