import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1771759964105 implements MigrationInterface {
    name = 'Migration1771759964105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "house_manifests" ADD "attachments" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "house_manifests" DROP COLUMN "attachments"`);
    }

}
