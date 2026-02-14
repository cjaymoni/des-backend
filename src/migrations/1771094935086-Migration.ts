import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1771094935086 implements MigrationInterface {
    name = 'Migration1771094935086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")`);
    }

}
