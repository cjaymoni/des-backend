import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1771882744299 implements MigrationInterface {
    name = 'Migration1771882744299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "manifest_jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "jobNo" character varying NOT NULL, "hblNo" character varying(20) NOT NULL, "houseManifestId" uuid NOT NULL, "consigneeDetails" character varying(200) NOT NULL, "noPkg" integer NOT NULL DEFAULT '0', "custRefNo" character varying(100), "handCharge" numeric(10,2) NOT NULL DEFAULT '0', "netHandCharge" numeric(10,2) NOT NULL DEFAULT '0', "grandHandCharge" numeric(10,2) NOT NULL DEFAULT '0', "vatAmt" numeric(10,2) NOT NULL DEFAULT '0', "nhilAmt" numeric(10,2) NOT NULL DEFAULT '0', "gfdAmt" numeric(10,2) NOT NULL DEFAULT '0', "covidAmt" numeric(10,2) NOT NULL DEFAULT '0', "totalCBM" numeric(10,2) NOT NULL DEFAULT '0', "weight" numeric(10,2) NOT NULL DEFAULT '0', "fileDate" date, "paidDate" date, "paidStatus" boolean NOT NULL DEFAULT false, "releaseStatus" boolean NOT NULL DEFAULT false, "releaseDate" date, "calcStatus" character varying(10), "incvatStatus" character varying(10), "description" text, "marksNum" character varying(225), "shipBl" character varying(20), "hblType" character varying(50), "hblTypeRemarks" character varying(200), "agentDetails" character varying(200), "agentName" character varying(100), "agentTel" character varying(50), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "UQ_827c1c3c6801f1d83b394bfff62" UNIQUE ("jobNo"), CONSTRAINT "PK_7e21edd26e991802c8290344a8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f5b6bab22b6dbbad38578a3651" ON "manifest_jobs" ("hblNo") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_827c1c3c6801f1d83b394bfff6" ON "manifest_jobs" ("jobNo") `);
        await queryRunner.query(`CREATE TABLE "jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "jobNo" character varying NOT NULL, "ie" character varying(200) NOT NULL, "custRefNo" character varying(100), "vesselName" character varying(100), "vesselEta" character varying(50), "invoiceNo" character varying(100), "totDuty" numeric(12,2) NOT NULL DEFAULT '0', "qtyDescription" text, "destination" character varying(100), "fileDate" date, "fileDate1" character varying(50), "gcnetJob" character varying(100), "oic" character varying(100), "a2IdfNo" character varying(225), "boeNo" character varying(100), "blNo" character varying(20), "transType" character varying(50), "estCompDate" character varying(50), "jobFinanceeType" character varying(50), "jobFinanceeName" character varying(200), "jobFinanceeAmount" numeric(12,2) NOT NULL DEFAULT '0', "agencyFee" numeric(10,2) NOT NULL DEFAULT '0', "jobStatus" character varying(50), "vatPer" numeric(5,2) NOT NULL DEFAULT '0', "nhilPer" numeric(5,2) NOT NULL DEFAULT '0', "gfdPer" numeric(5,2) NOT NULL DEFAULT '0', "covidPer" numeric(5,2) NOT NULL DEFAULT '0', "containers" text, "cntNo" character varying(100), "totItem" integer NOT NULL DEFAULT '0', "strMonth" character varying(10), "strYear" character varying(4), "vatNhilStatus" character varying(10) NOT NULL DEFAULT '0', "paidStatus" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "UQ_2162163c2605eec6b3b2446ec04" UNIQUE ("jobNo"), CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a5948057d5307d53fb8d75db66" ON "jobs" ("blNo") `);
        await queryRunner.query(`CREATE INDEX "IDX_12e98982a50b141b1f9024236f" ON "jobs" ("ie") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2162163c2605eec6b3b2446ec0" ON "jobs" ("jobNo") `);
        await queryRunner.query(`CREATE TABLE "income_expenditures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transRemarks" character varying NOT NULL, "transType" character varying(20) NOT NULL, "purposeCode" character varying, "detailCode" character varying, "incomeAmt" numeric(10,2) NOT NULL DEFAULT '0', "netIncome" numeric(10,2) NOT NULL DEFAULT '0', "netIncVat" numeric(10,2) NOT NULL DEFAULT '0', "expenseAmt" numeric(10,2) NOT NULL DEFAULT '0', "netExpense" numeric(10,2) NOT NULL DEFAULT '0', "netExpVat" numeric(10,2) NOT NULL DEFAULT '0', "bbfAmt" numeric(10,2) NOT NULL DEFAULT '0', "incCheqAmt" numeric(10,2) NOT NULL DEFAULT '0', "expCheqAmt" numeric(10,2) NOT NULL DEFAULT '0', "incCheqVat" numeric(10,2) NOT NULL DEFAULT '0', "expCheqVat" numeric(10,2) NOT NULL DEFAULT '0', "payTerms" character varying(10) NOT NULL DEFAULT '0', "vatNhilStatus" character varying(10) NOT NULL DEFAULT '0', "consignee" character varying(200), "hbl" character varying(20), "agentDetails" character varying(200), "transactionDate" date, "strMonth" character varying(10), "dateYear" character varying(4), "transBy" character varying(100), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "PK_3ae0bfc69d1e374d98a46a93c1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ea3a141dae25e1d8054a046425" ON "income_expenditures" ("consignee") `);
        await queryRunner.query(`CREATE INDEX "IDX_53b7746a5b1e2e0a0361bda752" ON "income_expenditures" ("transType") `);
        await queryRunner.query(`CREATE INDEX "IDX_5bfa3c3b2f3dd98b8e0608fa8a" ON "income_expenditures" ("transRemarks") `);
        await queryRunner.query(`CREATE TABLE "importer_exporters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "ieName" character varying(200) NOT NULL, "address" character varying(200), "telephone" character varying(50), "email" character varying(100), "tin" character varying(20), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "UQ_e98625f9042c2aab27c54aea311" UNIQUE ("code"), CONSTRAINT "PK_5951c6510433bdb2c51f0139335" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e98625f9042c2aab27c54aea31" ON "importer_exporters" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_d96331c2a35dc971177a5e2ad3" ON "importer_exporters" ("ieName") `);
        await queryRunner.query(`ALTER TABLE "manifest_jobs" ADD CONSTRAINT "FK_886ec26f5c6d25066acd49a45e1" FOREIGN KEY ("houseManifestId") REFERENCES "house_manifests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manifest_jobs" DROP CONSTRAINT "FK_886ec26f5c6d25066acd49a45e1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d96331c2a35dc971177a5e2ad3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e98625f9042c2aab27c54aea31"`);
        await queryRunner.query(`DROP TABLE "importer_exporters"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5bfa3c3b2f3dd98b8e0608fa8a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_53b7746a5b1e2e0a0361bda752"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ea3a141dae25e1d8054a046425"`);
        await queryRunner.query(`DROP TABLE "income_expenditures"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2162163c2605eec6b3b2446ec0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12e98982a50b141b1f9024236f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a5948057d5307d53fb8d75db66"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_827c1c3c6801f1d83b394bfff6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f5b6bab22b6dbbad38578a3651"`);
        await queryRunner.query(`DROP TABLE "manifest_jobs"`);
    }

}
