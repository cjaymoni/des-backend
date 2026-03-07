import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772109063321 implements MigrationInterface {
    name = 'Migration1772109063321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "master_manifests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "blNo" character varying(20) NOT NULL, "containerNo" character varying(225) NOT NULL, "vessel" character varying(50) NOT NULL, "voyage" character varying(10), "arrivalDate" date, "rotationDate" date, "destination" character varying(50), "portLoad" character varying(50), "shippingLine" character varying(50), "shipper" character varying(100), "cntSize" character varying(50), "sealNo" character varying(50), "consignType" character varying(20), "rptNo" character varying(50), "deletedAt" TIMESTAMP, CONSTRAINT "PK_b3f6455fa9b97b2d01cfeabb254" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e68d1723de3431af0785347763" ON "master_manifests" ("containerNo") `);
        await queryRunner.query(`CREATE INDEX "IDX_7ac7706b671697a1b3db476000" ON "master_manifests" ("shippingLine") `);
        await queryRunner.query(`CREATE INDEX "IDX_d9e3b7909ff05d50b3965c6789" ON "master_manifests" ("vessel") `);
        await queryRunner.query(`CREATE INDEX "IDX_a681c1e33ac0730c88627905dd" ON "master_manifests" ("blNo") `);
        await queryRunner.query(`CREATE TABLE "house_manifests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "masterManifestId" uuid NOT NULL, "hblNo" character varying(20) NOT NULL, "shipper" character varying(100), "description" text NOT NULL, "noPkg" integer NOT NULL DEFAULT '0', "weight" numeric(10,2) NOT NULL DEFAULT '0', "totalCBM" numeric(10,2) NOT NULL DEFAULT '0', "marksNum" character varying(225), "consignee" text NOT NULL, "remark" character varying(100), "handCharge" numeric(10,2) NOT NULL DEFAULT '0', "hblType" character varying(50), "fileDate" date, "releaseStatus" boolean NOT NULL DEFAULT false, "releaseDate" date, "attachments" jsonb, "deletedAt" TIMESTAMP, CONSTRAINT "PK_700925250b92ec73d83b8099632" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c77e9c511ab411ca2e5eb0be63" ON "house_manifests" ("masterManifestId") `);
        await queryRunner.query(`CREATE INDEX "IDX_00e7284bdcd78199b519542949" ON "house_manifests" ("consignee") `);
        await queryRunner.query(`CREATE INDEX "IDX_15203b8731921e8bcf27df7f52" ON "house_manifests" ("hblNo") `);
        await queryRunner.query(`CREATE TABLE "manifest_jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "jobNo" character varying NOT NULL, "hblNo" character varying(20) NOT NULL, "houseManifestId" uuid NOT NULL, "consigneeDetails" character varying(200) NOT NULL, "noPkg" integer NOT NULL DEFAULT '0', "custRefNo" character varying(100), "handCharge" numeric(10,2) NOT NULL DEFAULT '0', "netHandCharge" numeric(10,2) NOT NULL DEFAULT '0', "grandHandCharge" numeric(10,2) NOT NULL DEFAULT '0', "vatAmt" numeric(10,2) NOT NULL DEFAULT '0', "nhilAmt" numeric(10,2) NOT NULL DEFAULT '0', "gfdAmt" numeric(10,2) NOT NULL DEFAULT '0', "covidAmt" numeric(10,2) NOT NULL DEFAULT '0', "totalCBM" numeric(10,2) NOT NULL DEFAULT '0', "weight" numeric(10,2) NOT NULL DEFAULT '0', "fileDate" date, "paidDate" date, "paidStatus" boolean NOT NULL DEFAULT false, "releaseStatus" boolean NOT NULL DEFAULT false, "releaseDate" date, "calcStatus" character varying(10), "incvatStatus" character varying(10), "description" text, "marksNum" character varying(225), "shipBl" character varying(20), "hblType" character varying(50), "hblTypeRemarks" character varying(200), "agentDetails" character varying(200), "agentName" character varying(100), "agentTel" character varying(50), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "UQ_827c1c3c6801f1d83b394bfff62" UNIQUE ("jobNo"), CONSTRAINT "PK_7e21edd26e991802c8290344a8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f5b6bab22b6dbbad38578a3651" ON "manifest_jobs" ("hblNo") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_827c1c3c6801f1d83b394bfff6" ON "manifest_jobs" ("jobNo") `);
        await queryRunner.query(`CREATE TABLE "cif_values" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "jobId" uuid, "refNo" character varying(100) NOT NULL, "cifValue" numeric(12,2) NOT NULL DEFAULT '0', "fobValue" numeric(12,2) NOT NULL DEFAULT '0', "fobP" numeric(5,2) NOT NULL DEFAULT '0', "frtValue" numeric(12,2) NOT NULL DEFAULT '0', "frtP" numeric(5,2) NOT NULL DEFAULT '0', "insValue" numeric(12,2) NOT NULL DEFAULT '0', "insP" numeric(5,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "PK_52a341f00cd7a6dd125e8d124a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_39c52b61de1fd9db138b6a3d54" ON "cif_values" ("refNo") `);
        await queryRunner.query(`CREATE TABLE "jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "jobNo" character varying NOT NULL, "ie" character varying(200) NOT NULL, "custRefNo" character varying(100), "vesselName" character varying(100), "vesselEta" character varying(50), "invoiceNo" character varying(100), "totDuty" numeric(12,2) NOT NULL DEFAULT '0', "qtyDescription" text, "destination" character varying(100), "fileDate" date, "fileDate1" character varying(50), "gcnetJob" character varying(100), "oic" character varying(100), "a2IdfNo" character varying(225), "boeNo" character varying(100), "blNo" character varying(20), "transType" character varying(50), "estCompDate" character varying(50), "jobFinanceeType" character varying(50), "jobFinanceeName" character varying(200), "jobFinanceeAmount" numeric(12,2) NOT NULL DEFAULT '0', "agencyFee" numeric(10,2) NOT NULL DEFAULT '0', "jobStatus" character varying(50), "vatPer" numeric(5,2) NOT NULL DEFAULT '0', "nhilPer" numeric(5,2) NOT NULL DEFAULT '0', "gfdPer" numeric(5,2) NOT NULL DEFAULT '0', "covidPer" numeric(5,2) NOT NULL DEFAULT '0', "containers" text, "cntNo" character varying(100), "totItem" integer NOT NULL DEFAULT '0', "strMonth" character varying(10), "strYear" character varying(4), "vatNhilStatus" character varying(10) NOT NULL DEFAULT '0', "paidStatus" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_2162163c2605eec6b3b2446ec04" UNIQUE ("jobNo"), CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a5948057d5307d53fb8d75db66" ON "jobs" ("blNo") `);
        await queryRunner.query(`CREATE INDEX "IDX_12e98982a50b141b1f9024236f" ON "jobs" ("ie") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2162163c2605eec6b3b2446ec0" ON "jobs" ("jobNo") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "isActive" boolean NOT NULL DEFAULT true, "lastLogin" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON "users" ("role") `);
        await queryRunner.query(`CREATE TABLE "income_expenditures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transRemarks" character varying NOT NULL, "transType" character varying(20) NOT NULL, "purposeCode" character varying, "detailCode" character varying, "incomeAmt" numeric(10,2) NOT NULL DEFAULT '0', "netIncome" numeric(10,2) NOT NULL DEFAULT '0', "netIncVat" numeric(10,2) NOT NULL DEFAULT '0', "expenseAmt" numeric(10,2) NOT NULL DEFAULT '0', "netExpense" numeric(10,2) NOT NULL DEFAULT '0', "netExpVat" numeric(10,2) NOT NULL DEFAULT '0', "bbfAmt" numeric(10,2) NOT NULL DEFAULT '0', "incCheqAmt" numeric(10,2) NOT NULL DEFAULT '0', "expCheqAmt" numeric(10,2) NOT NULL DEFAULT '0', "incCheqVat" numeric(10,2) NOT NULL DEFAULT '0', "expCheqVat" numeric(10,2) NOT NULL DEFAULT '0', "payTerms" character varying(10) NOT NULL DEFAULT '0', "vatNhilStatus" character varying(10) NOT NULL DEFAULT '0', "consignee" character varying(200), "hbl" character varying(20), "agentDetails" character varying(200), "transactionDate" date, "strMonth" character varying(10), "dateYear" character varying(4), "transBy" character varying(100), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "PK_3ae0bfc69d1e374d98a46a93c1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ea3a141dae25e1d8054a046425" ON "income_expenditures" ("consignee") `);
        await queryRunner.query(`CREATE INDEX "IDX_53b7746a5b1e2e0a0361bda752" ON "income_expenditures" ("transType") `);
        await queryRunner.query(`CREATE INDEX "IDX_5bfa3c3b2f3dd98b8e0608fa8a" ON "income_expenditures" ("transRemarks") `);
        await queryRunner.query(`CREATE TABLE "importer_exporters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "code" character varying NOT NULL, "ieName" character varying(200) NOT NULL, "address" character varying(200), "telephone" character varying(50), "email" character varying(100), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e98625f9042c2aab27c54aea311" UNIQUE ("code"), CONSTRAINT "PK_5951c6510433bdb2c51f0139335" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e98625f9042c2aab27c54aea31" ON "importer_exporters" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_d96331c2a35dc971177a5e2ad3" ON "importer_exporters" ("ieName") `);
        await queryRunner.query(`CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "appSubdomain" character varying NOT NULL, "companyName" character varying NOT NULL, "companyTIN" character varying NOT NULL, "address" character varying NOT NULL, "location" character varying NOT NULL, "telephone" character varying NOT NULL, "fax" character varying, "email" character varying NOT NULL, "vatPer" numeric(5,2) NOT NULL, "nhilPer" numeric(5,2) NOT NULL, "gfdPer" numeric(5,2) NOT NULL, "covidPer" numeric(5,2) NOT NULL, "cbm" character varying NOT NULL, "signature" text, "declFoot" text, "maniFoot" text, "rentFoot" text, "serialNumber" character varying, "logo" character varying, CONSTRAINT "UQ_12a2dc5d7474fb7b97c60c8b64f" UNIQUE ("appSubdomain"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_12a2dc5d7474fb7b97c60c8b64" ON "company" ("appSubdomain") `);
        await queryRunner.query(`CREATE TABLE "cif_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fobValue" numeric(12,2) NOT NULL DEFAULT '0', "frtValue" numeric(12,2) NOT NULL DEFAULT '0', "insValue" numeric(12,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, CONSTRAINT "PK_2da5357062b88106663fefa9fb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bank_transactions_transactiontype_enum" AS ENUM('Deposit', 'Withdrawal')`);
        await queryRunner.query(`CREATE TABLE "bank_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bankCode" character varying(50) NOT NULL, "acctNumber" character varying(20) NOT NULL, "transPurpose" character varying(50) NOT NULL, "chequeNo" character varying(50), "currencyCode" character varying(20), "transactionType" "public"."bank_transactions_transactiontype_enum" NOT NULL, "creditAmt" numeric(12,2) NOT NULL DEFAULT '0', "debitAmt" numeric(12,2) NOT NULL DEFAULT '0', "bankCharges" numeric(12,2) NOT NULL DEFAULT '0', "balance" numeric(14,2) NOT NULL DEFAULT '0', "transactionDate" date NOT NULL, "transactionBy" character varying(50) NOT NULL, "remarks" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "PK_123cc87304eefb2c497b4acdd10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_23acb08ddd318917bfd5c32ab8" ON "bank_transactions" ("transactionDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_68c8871910ecc8c396cca93356" ON "bank_transactions" ("acctNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be4ea99f6404022ab9a4bb22d" ON "bank_transactions" ("bankCode") `);
        await queryRunner.query(`CREATE TABLE "bank_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "bankCode" character varying(50) NOT NULL, "acctNumber" character varying(20) NOT NULL, "branchName" character varying(50), "acctType" character varying(20) NOT NULL, "currencyCode" character varying(20) NOT NULL, "balance" numeric(14,2) NOT NULL DEFAULT '0', "address" character varying(255), "bankTel" character varying(30), "email" character varying(100), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_5c85466672d010b6c75f4671c78" UNIQUE ("acctNumber"), CONSTRAINT "PK_c872de764f2038224a013ff25ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_84c09418fd2378a61f96b3df7f" ON "bank_accounts" ("bankCode") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5c85466672d010b6c75f4671c7" ON "bank_accounts" ("acctNumber") `);
        await queryRunner.query(`CREATE TABLE "weight_charges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "weightFrom" numeric(10,2) NOT NULL, "weightTo" numeric(10,2) NOT NULL, "charges" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_76529ee2fcca1d0e54ac8a8251f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "house_manifests" ADD CONSTRAINT "FK_c77e9c511ab411ca2e5eb0be633" FOREIGN KEY ("masterManifestId") REFERENCES "master_manifests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "manifest_jobs" ADD CONSTRAINT "FK_886ec26f5c6d25066acd49a45e1" FOREIGN KEY ("houseManifestId") REFERENCES "house_manifests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cif_values" ADD CONSTRAINT "FK_c2772156aa41467f6c40161f87b" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cif_values" DROP CONSTRAINT "FK_c2772156aa41467f6c40161f87b"`);
        await queryRunner.query(`ALTER TABLE "manifest_jobs" DROP CONSTRAINT "FK_886ec26f5c6d25066acd49a45e1"`);
        await queryRunner.query(`ALTER TABLE "house_manifests" DROP CONSTRAINT "FK_c77e9c511ab411ca2e5eb0be633"`);
        await queryRunner.query(`DROP TABLE "weight_charges"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c85466672d010b6c75f4671c7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_84c09418fd2378a61f96b3df7f"`);
        await queryRunner.query(`DROP TABLE "bank_accounts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4be4ea99f6404022ab9a4bb22d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68c8871910ecc8c396cca93356"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_23acb08ddd318917bfd5c32ab8"`);
        await queryRunner.query(`DROP TABLE "bank_transactions"`);
        await queryRunner.query(`DROP TYPE "public"."bank_transactions_transactiontype_enum"`);
        await queryRunner.query(`DROP TABLE "cif_settings"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12a2dc5d7474fb7b97c60c8b64"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12a2dc5d7474fb7b97c60c8b64"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d96331c2a35dc971177a5e2ad3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e98625f9042c2aab27c54aea31"`);
        await queryRunner.query(`DROP TABLE "importer_exporters"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5bfa3c3b2f3dd98b8e0608fa8a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_53b7746a5b1e2e0a0361bda752"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ea3a141dae25e1d8054a046425"`);
        await queryRunner.query(`DROP TABLE "income_expenditures"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ace513fa30d485cfd25c11a9e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2162163c2605eec6b3b2446ec0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12e98982a50b141b1f9024236f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a5948057d5307d53fb8d75db66"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39c52b61de1fd9db138b6a3d54"`);
        await queryRunner.query(`DROP TABLE "cif_values"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_827c1c3c6801f1d83b394bfff6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f5b6bab22b6dbbad38578a3651"`);
        await queryRunner.query(`DROP TABLE "manifest_jobs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_15203b8731921e8bcf27df7f52"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_00e7284bdcd78199b519542949"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c77e9c511ab411ca2e5eb0be63"`);
        await queryRunner.query(`DROP TABLE "house_manifests"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a681c1e33ac0730c88627905dd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d9e3b7909ff05d50b3965c6789"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ac7706b671697a1b3db476000"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e68d1723de3431af0785347763"`);
        await queryRunner.query(`DROP TABLE "master_manifests"`);
    }

}
