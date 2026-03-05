import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772699660472 implements MigrationInterface {
    name = 'Migration1772699660472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "master_manifests" DROP CONSTRAINT "fk_master_manifests_shippingLineId"`);
        await queryRunner.query(`DROP INDEX "public"."idx_shipping_lines_name"`);
        await queryRunner.query(`DROP INDEX "public"."idx_master_manifests_shippingLineId"`);
        await queryRunner.query(`ALTER TABLE "master_manifests" RENAME COLUMN "shipper" TO "shipperId"`);
        await queryRunner.query(`CREATE TABLE "shippers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "name" character varying(100) NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_c1c26abb9b684324dbb0751b2b7" UNIQUE ("name"), CONSTRAINT "PK_8010d7e1a3c4e14fe35fcd4a597" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c1c26abb9b684324dbb0751b2b" ON "shippers" ("name") `);
        await queryRunner.query(`ALTER TABLE "master_manifests" DROP COLUMN "shipperId"`);
        await queryRunner.query(`ALTER TABLE "master_manifests" ADD "shipperId" uuid`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3a00e52bf867126d8899fb72dc" ON "shipping_lines" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_11bd02fdf7532457b456c23068" ON "master_manifests" ("shipperId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5aac31b5cf67ac5be19dda559c" ON "master_manifests" ("shippingLineId") `);
        await queryRunner.query(`ALTER TABLE "master_manifests" ADD CONSTRAINT "FK_5aac31b5cf67ac5be19dda559c1" FOREIGN KEY ("shippingLineId") REFERENCES "shipping_lines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "master_manifests" ADD CONSTRAINT "FK_11bd02fdf7532457b456c230683" FOREIGN KEY ("shipperId") REFERENCES "shippers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "master_manifests" DROP CONSTRAINT "FK_11bd02fdf7532457b456c230683"`);
        await queryRunner.query(`ALTER TABLE "master_manifests" DROP CONSTRAINT "FK_5aac31b5cf67ac5be19dda559c1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5aac31b5cf67ac5be19dda559c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11bd02fdf7532457b456c23068"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3a00e52bf867126d8899fb72dc"`);
        await queryRunner.query(`ALTER TABLE "master_manifests" DROP COLUMN "shipperId"`);
        await queryRunner.query(`ALTER TABLE "master_manifests" ADD "shipperId" character varying(100)`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1c26abb9b684324dbb0751b2b"`);
        await queryRunner.query(`DROP TABLE "shippers"`);
        await queryRunner.query(`ALTER TABLE "master_manifests" RENAME COLUMN "shipperId" TO "shipper"`);
        await queryRunner.query(`CREATE INDEX "idx_master_manifests_shippingLineId" ON "master_manifests" ("shippingLineId") `);
        await queryRunner.query(`CREATE INDEX "idx_shipping_lines_name" ON "shipping_lines" ("name") `);
        await queryRunner.query(`ALTER TABLE "master_manifests" ADD CONSTRAINT "fk_master_manifests_shippingLineId" FOREIGN KEY ("shippingLineId") REFERENCES "shipping_lines"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
