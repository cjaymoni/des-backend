import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1771728177923 implements MigrationInterface {
    name = 'Migration1771728177923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "weight_charges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "weightFrom" numeric(10,2) NOT NULL, "weightTo" numeric(10,2) NOT NULL, "charges" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_76529ee2fcca1d0e54ac8a8251f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "house_manifests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "masterManifestId" uuid NOT NULL, "hblNo" character varying(20) NOT NULL, "shipper" character varying(100), "description" text NOT NULL, "noPkg" integer NOT NULL DEFAULT '0', "weight" numeric(10,2) NOT NULL DEFAULT '0', "totalCBM" numeric(10,2) NOT NULL DEFAULT '0', "marksNum" character varying(225), "consignee" text NOT NULL, "remark" character varying(100), "handCharge" numeric(10,2) NOT NULL DEFAULT '0', "hblType" character varying(50), "fileDate" date, "releaseStatus" boolean NOT NULL DEFAULT false, "releaseDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "PK_700925250b92ec73d83b8099632" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c77e9c511ab411ca2e5eb0be63" ON "house_manifests" ("masterManifestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_00e7284bdcd78199b519542949" ON "house_manifests" ("consignee") `);
        await queryRunner.query(`CREATE INDEX "IDX_15203b8731921e8bcf27df7f52" ON "house_manifests" ("hblNo") `);
        await queryRunner.query(`CREATE TABLE "master_manifests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blNo" character varying(20) NOT NULL, "containerNo" character varying(225) NOT NULL, "vessel" character varying(50) NOT NULL, "voyage" character varying(10), "arrivalDate" date, "rotationDate" date, "destination" character varying(50), "portLoad" character varying(50), "shippingLine" character varying(50), "shipper" character varying(100), "cntSize" character varying(50), "sealNo" character varying(50), "consignType" character varying(20), "rptNo" character varying(50), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "PK_b3f6455fa9b97b2d01cfeabb254" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e68d1723de3431af0785347763" ON "master_manifests" ("containerNo") `);
        await queryRunner.query(`CREATE INDEX "IDX_7ac7706b671697a1b3db476000" ON "master_manifests" ("shippingLine") `);
        await queryRunner.query(`CREATE INDEX "IDX_d9e3b7909ff05d50b3965c6789" ON "master_manifests" ("vessel") `);
        await queryRunner.query(`CREATE INDEX "IDX_a681c1e33ac0730c88627905dd" ON "master_manifests" ("blNo") `);
        await queryRunner.query(`ALTER TABLE "house_manifests" ADD CONSTRAINT "FK_c77e9c511ab411ca2e5eb0be633" FOREIGN KEY ("masterManifestId") REFERENCES "master_manifests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "house_manifests" DROP CONSTRAINT "FK_c77e9c511ab411ca2e5eb0be633"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a681c1e33ac0730c88627905dd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d9e3b7909ff05d50b3965c6789"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ac7706b671697a1b3db476000"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e68d1723de3431af0785347763"`);
        await queryRunner.query(`DROP TABLE "master_manifests"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_15203b8731921e8bcf27df7f52"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_00e7284bdcd78199b519542949"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c77e9c511ab411ca2e5eb0be63"`);
        await queryRunner.query(`DROP TABLE "house_manifests"`);
        await queryRunner.query(`DROP TABLE "weight_charges"`);
    }

}
