import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772358307342 implements MigrationInterface {
    name = 'Migration1772358307342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "house_manifests" ADD "version" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "manifest_jobs" ADD "version" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD "version" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "version" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "manifest_jobs" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "house_manifests" DROP COLUMN "version"`);
    }

}
