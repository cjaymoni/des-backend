import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772649460117 implements MigrationInterface {
    name = 'Migration1772649460117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manifest_jobs" DROP COLUMN "calcStatus"`);
        await queryRunner.query(`ALTER TABLE "manifest_jobs" ADD "calcStatus" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "manifest_jobs" DROP COLUMN "incvatStatus"`);
        await queryRunner.query(`ALTER TABLE "manifest_jobs" ADD "incvatStatus" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manifest_jobs" DROP COLUMN "incvatStatus"`);
        await queryRunner.query(`ALTER TABLE "manifest_jobs" ADD "incvatStatus" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "manifest_jobs" DROP COLUMN "calcStatus"`);
        await queryRunner.query(`ALTER TABLE "manifest_jobs" ADD "calcStatus" character varying(10)`);
    }

}
