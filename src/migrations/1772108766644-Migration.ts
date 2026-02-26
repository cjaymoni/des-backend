import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772108766644 implements MigrationInterface {
    name = 'Migration1772108766644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cif_values" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "jobId" uuid, "refNo" character varying(100) NOT NULL, "cifValue" numeric(12,2) NOT NULL DEFAULT '0', "fobValue" numeric(12,2) NOT NULL DEFAULT '0', "fobP" numeric(5,2) NOT NULL DEFAULT '0', "frtValue" numeric(12,2) NOT NULL DEFAULT '0', "frtP" numeric(5,2) NOT NULL DEFAULT '0', "insValue" numeric(12,2) NOT NULL DEFAULT '0', "insP" numeric(5,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "PK_52a341f00cd7a6dd125e8d124a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_39c52b61de1fd9db138b6a3d54" ON "cif_values" ("refNo") `);
        await queryRunner.query(`CREATE TABLE "cif_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fobValue" numeric(12,2) NOT NULL DEFAULT '0', "frtValue" numeric(12,2) NOT NULL DEFAULT '0', "insValue" numeric(12,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, CONSTRAINT "PK_2da5357062b88106663fefa9fb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bank_transactions_transactiontype_enum" AS ENUM('Deposit', 'Withdrawal')`);
        await queryRunner.query(`CREATE TABLE "bank_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bankCode" character varying(50) NOT NULL, "acctNumber" character varying(20) NOT NULL, "transPurpose" character varying(50) NOT NULL, "chequeNo" character varying(50), "currencyCode" character varying(20), "transactionType" "public"."bank_transactions_transactiontype_enum" NOT NULL, "creditAmt" numeric(12,2) NOT NULL DEFAULT '0', "debitAmt" numeric(12,2) NOT NULL DEFAULT '0', "bankCharges" numeric(12,2) NOT NULL DEFAULT '0', "balance" numeric(14,2) NOT NULL DEFAULT '0', "transactionDate" date NOT NULL, "transactionBy" character varying(50) NOT NULL, "remarks" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "PK_123cc87304eefb2c497b4acdd10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_23acb08ddd318917bfd5c32ab8" ON "bank_transactions" ("transactionDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_68c8871910ecc8c396cca93356" ON "bank_transactions" ("acctNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be4ea99f6404022ab9a4bb22d" ON "bank_transactions" ("bankCode") `);
        await queryRunner.query(`CREATE TABLE "bank_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "bankCode" character varying(50) NOT NULL, "acctNumber" character varying(20) NOT NULL, "branchName" character varying(50), "acctType" character varying(20) NOT NULL, "currencyCode" character varying(20) NOT NULL, "balance" numeric(14,2) NOT NULL DEFAULT '0', "address" character varying(255), "bankTel" character varying(30), "email" character varying(100), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_5c85466672d010b6c75f4671c78" UNIQUE ("acctNumber"), CONSTRAINT "PK_c872de764f2038224a013ff25ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_84c09418fd2378a61f96b3df7f" ON "bank_accounts" ("bankCode") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5c85466672d010b6c75f4671c7" ON "bank_accounts" ("acctNumber") `);
        await queryRunner.query(`ALTER TABLE "importer_exporters" DROP COLUMN "tin"`);
        await queryRunner.query(`ALTER TABLE "cif_values" ADD CONSTRAINT "FK_c2772156aa41467f6c40161f87b" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cif_values" DROP CONSTRAINT "FK_c2772156aa41467f6c40161f87b"`);
        await queryRunner.query(`ALTER TABLE "importer_exporters" ADD "tin" character varying(20)`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c85466672d010b6c75f4671c7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_84c09418fd2378a61f96b3df7f"`);
        await queryRunner.query(`DROP TABLE "bank_accounts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4be4ea99f6404022ab9a4bb22d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68c8871910ecc8c396cca93356"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_23acb08ddd318917bfd5c32ab8"`);
        await queryRunner.query(`DROP TABLE "bank_transactions"`);
        await queryRunner.query(`DROP TYPE "public"."bank_transactions_transactiontype_enum"`);
        await queryRunner.query(`DROP TABLE "cif_settings"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39c52b61de1fd9db138b6a3d54"`);
        await queryRunner.query(`DROP TABLE "cif_values"`);
    }

}
