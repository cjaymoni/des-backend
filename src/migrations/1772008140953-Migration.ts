import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772008140953 implements MigrationInterface {
    name = 'Migration1772008140953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bank_transactions_transactiontype_enum" AS ENUM('Deposit', 'Withdrawal')`);
        await queryRunner.query(`CREATE TABLE "public"."bank_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bankCode" character varying(50) NOT NULL, "acctNumber" character varying(20) NOT NULL, "transPurpose" character varying(50) NOT NULL, "chequeNo" character varying(50), "currencyCode" character varying(20), "transactionType" "public"."bank_transactions_transactiontype_enum" NOT NULL, "creditAmt" numeric(12,2) NOT NULL DEFAULT '0', "debitAmt" numeric(12,2) NOT NULL DEFAULT '0', "bankCharges" numeric(12,2) NOT NULL DEFAULT '0', "balance" numeric(14,2) NOT NULL DEFAULT '0', "transactionDate" date NOT NULL, "transactionBy" character varying(50) NOT NULL, "remarks" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "PK_123cc87304eefb2c497b4acdd10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_23acb08ddd318917bfd5c32ab8" ON "public"."bank_transactions" ("transactionDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_68c8871910ecc8c396cca93356" ON "public"."bank_transactions" ("acctNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be4ea99f6404022ab9a4bb22d" ON "public"."bank_transactions" ("bankCode") `);
        await queryRunner.query(`CREATE TABLE "public"."bank_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bankCode" character varying(50) NOT NULL, "acctNumber" character varying(20) NOT NULL, "branchName" character varying(50), "acctType" character varying(20) NOT NULL, "currencyCode" character varying(20) NOT NULL, "balance" numeric(14,2) NOT NULL DEFAULT '0', "address" character varying(255), "bankTel" character varying(30), "email" character varying(100), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "UQ_5c85466672d010b6c75f4671c78" UNIQUE ("acctNumber"), CONSTRAINT "PK_c872de764f2038224a013ff25ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_84c09418fd2378a61f96b3df7f" ON "public"."bank_accounts" ("bankCode") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5c85466672d010b6c75f4671c7" ON "public"."bank_accounts" ("acctNumber") `);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."house_manifests" DROP CONSTRAINT "FK_c77e9c511ab411ca2e5eb0be633"`);
        await queryRunner.query(`ALTER TABLE "public"."master_manifests" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."master_manifests" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."manifest_jobs" DROP CONSTRAINT "FK_886ec26f5c6d25066acd49a45e1"`);
        await queryRunner.query(`ALTER TABLE "public"."house_manifests" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."house_manifests" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."manifest_jobs" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."manifest_jobs" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."jobs" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."jobs" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."income_expenditures" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."income_expenditures" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."importer_exporters" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."importer_exporters" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."company" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."company" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."weight_charges" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."weight_charges" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."house_manifests" ADD CONSTRAINT "FK_c77e9c511ab411ca2e5eb0be633" FOREIGN KEY ("masterManifestId") REFERENCES "public"."master_manifests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."manifest_jobs" ADD CONSTRAINT "FK_886ec26f5c6d25066acd49a45e1" FOREIGN KEY ("houseManifestId") REFERENCES "public"."house_manifests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."manifest_jobs" DROP CONSTRAINT "FK_886ec26f5c6d25066acd49a45e1"`);
        await queryRunner.query(`ALTER TABLE "public"."house_manifests" DROP CONSTRAINT "FK_c77e9c511ab411ca2e5eb0be633"`);
        await queryRunner.query(`ALTER TABLE "public"."weight_charges" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."weight_charges" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."company" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."company" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."importer_exporters" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."importer_exporters" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."income_expenditures" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."income_expenditures" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."jobs" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."jobs" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."manifest_jobs" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."manifest_jobs" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."house_manifests" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."house_manifests" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."manifest_jobs" ADD CONSTRAINT "FK_886ec26f5c6d25066acd49a45e1" FOREIGN KEY ("houseManifestId") REFERENCES "public"."house_manifests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."master_manifests" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."master_manifests" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."house_manifests" ADD CONSTRAINT "FK_c77e9c511ab411ca2e5eb0be633" FOREIGN KEY ("masterManifestId") REFERENCES "public"."master_manifests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c85466672d010b6c75f4671c7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_84c09418fd2378a61f96b3df7f"`);
        await queryRunner.query(`DROP TABLE "public"."bank_accounts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4be4ea99f6404022ab9a4bb22d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68c8871910ecc8c396cca93356"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_23acb08ddd318917bfd5c32ab8"`);
        await queryRunner.query(`DROP TABLE "public"."bank_transactions"`);
        await queryRunner.query(`DROP TYPE "public"."bank_transactions_transactiontype_enum"`);
    }

}
