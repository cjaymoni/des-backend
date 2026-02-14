import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1771100206384 implements MigrationInterface {
  name = 'Migration1771100206384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TABLE "public"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "isActive" boolean NOT NULL DEFAULT true, "lastLogin" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "public"."users" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON "public"."users" ("role") `,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."manifests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "manifestNumber" character varying NOT NULL, "type" character varying NOT NULL, "masterManifestId" character varying, "data" jsonb, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "PK_fb41b22d800467667616837784b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8fea83a1bc49b8af7a60d3d27e" ON "public"."manifests" ("masterManifestId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_481ede6b9388d6b00d38ab0aff" ON "public"."manifests" ("type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_30084d545682fc7627ee2f89d4" ON "public"."manifests" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0cc38f8c4b074cd0ae7445a09" ON "public"."manifests" ("manifestNumber") `,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "jobNumber" character varying NOT NULL, "clientName" character varying NOT NULL, "details" jsonb, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appSubdomain" character varying NOT NULL, "companyName" character varying NOT NULL, "companyTIN" character varying NOT NULL, "address" character varying NOT NULL, "location" character varying NOT NULL, "telephone" character varying NOT NULL, "fax" character varying, "email" character varying NOT NULL, "vatPer" numeric(5,2) NOT NULL, "nhilPer" numeric(5,2) NOT NULL, "gfdPer" numeric(5,2) NOT NULL, "covidPer" numeric(5,2) NOT NULL, "cbm" character varying NOT NULL, "signature" text, "declFoot" text, "maniFoot" text, "rentFoot" text, "serialNumber" character varying, "logo" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "UQ_12a2dc5d7474fb7b97c60c8b64f" UNIQUE ("appSubdomain"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_12a2dc5d7474fb7b97c60c8b64" ON "public"."company" ("appSubdomain") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_12a2dc5d7474fb7b97c60c8b64"`,
    );

    await queryRunner.query(`DROP TABLE "public"."company"`);
    await queryRunner.query(`DROP TABLE "public"."jobs"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0cc38f8c4b074cd0ae7445a09"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_30084d545682fc7627ee2f89d4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_481ede6b9388d6b00d38ab0aff"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8fea83a1bc49b8af7a60d3d27e"`,
    );
    await queryRunner.query(`DROP TABLE "public"."manifests"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ace513fa30d485cfd25c11a9e4"`,
    );
    await queryRunner.query(`DROP TABLE "public"."users"`);
  }
}
