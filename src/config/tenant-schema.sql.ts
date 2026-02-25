export const TENANT_SCHEMA_SQL = `
-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" varchar NOT NULL UNIQUE,
  "password" varchar NOT NULL,
  "firstName" varchar NOT NULL,
  "lastName" varchar NOT NULL,
  "role" varchar NOT NULL DEFAULT 'user',
  "isActive" boolean NOT NULL DEFAULT true,
  "lastLogin" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "createdBy" varchar,
  "updatedBy" varchar
);

-- Master Manifests table
CREATE TABLE IF NOT EXISTS "master_manifests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "blNo" varchar(20) NOT NULL,
  "containerNo" varchar(225) NOT NULL,
  "vessel" varchar(50) NOT NULL,
  "voyage" varchar(10),
  "arrivalDate" date,
  "rotationDate" date,
  "destination" varchar(50),
  "portLoad" varchar(50),
  "shippingLine" varchar(50),
  "shipper" varchar(100),
  "cntSize" varchar(50),
  "sealNo" varchar(50),
  "consignType" varchar(20),
  "rptNo" varchar(50),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "deletedAt" timestamp,
  "createdBy" varchar,
  "updatedBy" varchar
);

CREATE INDEX IF NOT EXISTS "idx_master_manifests_blNo" ON "master_manifests" ("blNo");
CREATE INDEX IF NOT EXISTS "idx_master_manifests_vessel" ON "master_manifests" ("vessel");
CREATE INDEX IF NOT EXISTS "idx_master_manifests_shippingLine" ON "master_manifests" ("shippingLine");
CREATE INDEX IF NOT EXISTS "idx_master_manifests_containerNo" ON "master_manifests" ("containerNo");

-- House Manifests table
CREATE TABLE IF NOT EXISTS "house_manifests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "masterManifestId" uuid NOT NULL,
  "hblNo" varchar(20) NOT NULL,
  "shipper" varchar(100),
  "description" text NOT NULL,
  "noPkg" int NOT NULL DEFAULT 0,
  "weight" decimal(10,2) NOT NULL DEFAULT 0,
  "totalCBM" decimal(10,2) NOT NULL DEFAULT 0,
  "marksNum" varchar(225),
  "consignee" text NOT NULL,
  "remark" varchar(100),
  "handCharge" decimal(10,2) NOT NULL DEFAULT 0,
  "hblType" varchar(50),
  "fileDate" date,
  "releaseStatus" boolean NOT NULL DEFAULT false,
  "releaseDate" date,
  "attachments" jsonb,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "deletedAt" timestamp,
  "createdBy" varchar,
  "updatedBy" varchar,
  FOREIGN KEY ("masterManifestId") REFERENCES "master_manifests"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_house_manifests_hblNo" ON "house_manifests" ("hblNo");
CREATE INDEX IF NOT EXISTS "idx_house_manifests_consignee" ON "house_manifests" ("consignee");
CREATE INDEX IF NOT EXISTS "idx_house_manifests_masterManifestId" ON "house_manifests" ("masterManifestId");

-- Weight Charges table
CREATE TABLE IF NOT EXISTS "weight_charges" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "weightFrom" decimal(10,2) NOT NULL,
  "weightTo" decimal(10,2) NOT NULL,
  "charges" decimal(10,2) NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

-- Importer/Exporter table
CREATE TABLE IF NOT EXISTS "importer_exporters" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "code" varchar NOT NULL UNIQUE,
  "ieName" varchar(200) NOT NULL,
  "address" varchar(200),
  "telephone" varchar(50),
  "email" varchar(100),
  "tin" varchar(20),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "deletedAt" timestamp,
  "createdBy" varchar,
  "updatedBy" varchar
);

CREATE INDEX IF NOT EXISTS "idx_importer_exporters_ieName" ON "importer_exporters" ("ieName");
CREATE INDEX IF NOT EXISTS "idx_importer_exporters_code" ON "importer_exporters" ("code");

-- Manifest Jobs table (JobFiles_Man)
CREATE TABLE IF NOT EXISTS "manifest_jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "jobNo" varchar NOT NULL UNIQUE,
  "hblNo" varchar(20) NOT NULL,
  "houseManifestId" uuid NOT NULL,
  "consigneeDetails" varchar(200) NOT NULL,
  "noPkg" int NOT NULL DEFAULT 0,
  "custRefNo" varchar(100),
  "handCharge" decimal(10,2) NOT NULL DEFAULT 0,
  "netHandCharge" decimal(10,2) NOT NULL DEFAULT 0,
  "grandHandCharge" decimal(10,2) NOT NULL DEFAULT 0,
  "vatAmt" decimal(10,2) NOT NULL DEFAULT 0,
  "nhilAmt" decimal(10,2) NOT NULL DEFAULT 0,
  "gfdAmt" decimal(10,2) NOT NULL DEFAULT 0,
  "covidAmt" decimal(10,2) NOT NULL DEFAULT 0,
  "totalCBM" decimal(10,2) NOT NULL DEFAULT 0,
  "weight" decimal(10,2) NOT NULL DEFAULT 0,
  "fileDate" date,
  "paidDate" date,
  "paidStatus" boolean NOT NULL DEFAULT false,
  "releaseStatus" boolean NOT NULL DEFAULT false,
  "releaseDate" date,
  "calcStatus" varchar(10),
  "incvatStatus" varchar(10),
  "description" text,
  "marksNum" varchar(225),
  "shipBl" varchar(20),
  "hblType" varchar(50),
  "hblTypeRemarks" varchar(200),
  "agentDetails" varchar(200),
  "agentName" varchar(100),
  "agentTel" varchar(50),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "deletedAt" timestamp,
  "createdBy" varchar,
  "updatedBy" varchar,
  FOREIGN KEY ("houseManifestId") REFERENCES "house_manifests"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_manifest_jobs_jobNo" ON "manifest_jobs" ("jobNo");
CREATE INDEX IF NOT EXISTS "idx_manifest_jobs_hblNo" ON "manifest_jobs" ("hblNo");

-- Income/Expenditure table
CREATE TABLE IF NOT EXISTS "income_expenditures" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "transRemarks" varchar NOT NULL,
  "transType" varchar(20) NOT NULL,
  "purposeCode" varchar,
  "detailCode" varchar,
  "incomeAmt" decimal(10,2) NOT NULL DEFAULT 0,
  "netIncome" decimal(10,2) NOT NULL DEFAULT 0,
  "netIncVat" decimal(10,2) NOT NULL DEFAULT 0,
  "expenseAmt" decimal(10,2) NOT NULL DEFAULT 0,
  "netExpense" decimal(10,2) NOT NULL DEFAULT 0,
  "netExpVat" decimal(10,2) NOT NULL DEFAULT 0,
  "bbfAmt" decimal(10,2) NOT NULL DEFAULT 0,
  "incCheqAmt" decimal(10,2) NOT NULL DEFAULT 0,
  "expCheqAmt" decimal(10,2) NOT NULL DEFAULT 0,
  "incCheqVat" decimal(10,2) NOT NULL DEFAULT 0,
  "expCheqVat" decimal(10,2) NOT NULL DEFAULT 0,
  "payTerms" varchar(10) NOT NULL DEFAULT '0',
  "vatNhilStatus" varchar(10) NOT NULL DEFAULT '0',
  "consignee" varchar(200),
  "hbl" varchar(20),
  "agentDetails" varchar(200),
  "transactionDate" date,
  "strMonth" varchar(10),
  "dateYear" varchar(4),
  "transBy" varchar(100),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "deletedAt" timestamp,
  "createdBy" varchar,
  "updatedBy" varchar
);

CREATE INDEX IF NOT EXISTS "idx_income_expenditures_transRemarks" ON "income_expenditures" ("transRemarks");
CREATE INDEX IF NOT EXISTS "idx_income_expenditures_transType" ON "income_expenditures" ("transType");
CREATE INDEX IF NOT EXISTS "idx_income_expenditures_consignee" ON "income_expenditures" ("consignee");

-- Jobs table (JobFiles)
CREATE TABLE IF NOT EXISTS "jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "jobNo" varchar NOT NULL UNIQUE,
  "ie" varchar(200) NOT NULL,
  "custRefNo" varchar(100),
  "vesselName" varchar(100),
  "vesselEta" varchar(50),
  "invoiceNo" varchar(100),
  "totDuty" decimal(12,2) NOT NULL DEFAULT 0,
  "qtyDescription" text,
  "destination" varchar(100),
  "fileDate" date,
  "fileDate1" varchar(50),
  "gcnetJob" varchar(100),
  "oic" varchar(100),
  "a2IdfNo" varchar(225),
  "boeNo" varchar(100),
  "blNo" varchar(20),
  "transType" varchar(50),
  "estCompDate" varchar(50),
  "jobFinanceeType" varchar(50),
  "jobFinanceeName" varchar(200),
  "jobFinanceeAmount" decimal(12,2) NOT NULL DEFAULT 0,
  "agencyFee" decimal(10,2) NOT NULL DEFAULT 0,
  "jobStatus" varchar(50),
  "vatPer" decimal(5,2) NOT NULL DEFAULT 0,
  "nhilPer" decimal(5,2) NOT NULL DEFAULT 0,
  "gfdPer" decimal(5,2) NOT NULL DEFAULT 0,
  "covidPer" decimal(5,2) NOT NULL DEFAULT 0,
  "containers" text,
  "cntNo" varchar(100),
  "totItem" int NOT NULL DEFAULT 0,
  "strMonth" varchar(10),
  "strYear" varchar(4),
  "vatNhilStatus" varchar(10) NOT NULL DEFAULT '0',
  "paidStatus" boolean NOT NULL DEFAULT false,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "deletedAt" timestamp,
  "createdBy" varchar,
  "updatedBy" varchar
);

CREATE INDEX IF NOT EXISTS "idx_jobs_jobNo" ON "jobs" ("jobNo");
CREATE INDEX IF NOT EXISTS "idx_jobs_ie" ON "jobs" ("ie");
CREATE INDEX IF NOT EXISTS "idx_jobs_blNo" ON "jobs" ("blNo");

-- Bank Accounts table
CREATE TABLE IF NOT EXISTS "bank_accounts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "bankCode" varchar(50) NOT NULL,
  "acctNumber" varchar(20) NOT NULL UNIQUE,
  "branchName" varchar(50),
  "acctType" varchar(20) NOT NULL,
  "currencyCode" varchar(20) NOT NULL,
  "balance" decimal(14,2) NOT NULL DEFAULT 0,
  "address" varchar(255),
  "bankTel" varchar(30),
  "email" varchar(100),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "deletedAt" timestamp,
  "createdBy" varchar,
  "updatedBy" varchar
);

CREATE INDEX IF NOT EXISTS "idx_bank_accounts_bankCode" ON "bank_accounts" ("bankCode");

-- Bank Transactions table
CREATE TABLE IF NOT EXISTS "bank_transactions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "bankCode" varchar(50) NOT NULL,
  "acctNumber" varchar(20) NOT NULL,
  "transPurpose" varchar(50) NOT NULL,
  "chequeNo" varchar(50),
  "currencyCode" varchar(20),
  "transactionType" varchar(20) NOT NULL,
  "creditAmt" decimal(12,2) NOT NULL DEFAULT 0,
  "debitAmt" decimal(12,2) NOT NULL DEFAULT 0,
  "bankCharges" decimal(12,2) NOT NULL DEFAULT 0,
  "balance" decimal(14,2) NOT NULL DEFAULT 0,
  "transactionDate" date NOT NULL,
  "transactionBy" varchar(50) NOT NULL,
  "remarks" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "deletedAt" timestamp,
  "createdBy" varchar,
  "updatedBy" varchar
);

CREATE INDEX IF NOT EXISTS "idx_bank_transactions_bankCode" ON "bank_transactions" ("bankCode");
CREATE INDEX IF NOT EXISTS "idx_bank_transactions_acctNumber" ON "bank_transactions" ("acctNumber");
CREATE INDEX IF NOT EXISTS "idx_bank_transactions_transactionDate" ON "bank_transactions" ("transactionDate");

-- CIF Settings table (global FOB/freight/insurance rates)
CREATE TABLE IF NOT EXISTS "cif_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "fobValue" decimal(12,2) NOT NULL DEFAULT 0,
  "frtValue" decimal(12,2) NOT NULL DEFAULT 0,
  "insValue" decimal(12,2) NOT NULL DEFAULT 0,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "updatedBy" varchar
);

-- CIF Values table (per-shipment line items)
CREATE TABLE IF NOT EXISTS "cif_values" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "jobId" uuid,
  "refNo" varchar(100) NOT NULL,
  "cifValue" decimal(12,2) NOT NULL DEFAULT 0,
  "fobValue" decimal(12,2) NOT NULL DEFAULT 0,
  "fobP" decimal(5,2) NOT NULL DEFAULT 0,
  "frtValue" decimal(12,2) NOT NULL DEFAULT 0,
  "frtP" decimal(5,2) NOT NULL DEFAULT 0,
  "insValue" decimal(12,2) NOT NULL DEFAULT 0,
  "insP" decimal(5,2) NOT NULL DEFAULT 0,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "deletedAt" timestamp,
  "createdBy" varchar,
  "updatedBy" varchar,
  FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "idx_cif_values_refNo" ON "cif_values" ("refNo");
CREATE INDEX IF NOT EXISTS "idx_cif_values_jobId" ON "cif_values" ("jobId");

-- Migrate existing jobs table from stub schema to full schema
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='jobNumber') THEN
    ALTER TABLE "jobs" RENAME COLUMN "jobNumber" TO "jobNo";
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='ie') THEN
    ALTER TABLE "jobs"
      ADD COLUMN IF NOT EXISTS "ie" varchar(200),
      ADD COLUMN IF NOT EXISTS "custRefNo" varchar(100),
      ADD COLUMN IF NOT EXISTS "vesselName" varchar(100),
      ADD COLUMN IF NOT EXISTS "vesselEta" varchar(50),
      ADD COLUMN IF NOT EXISTS "invoiceNo" varchar(100),
      ADD COLUMN IF NOT EXISTS "totDuty" decimal(12,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "qtyDescription" text,
      ADD COLUMN IF NOT EXISTS "destination" varchar(100),
      ADD COLUMN IF NOT EXISTS "fileDate" date,
      ADD COLUMN IF NOT EXISTS "fileDate1" varchar(50),
      ADD COLUMN IF NOT EXISTS "gcnetJob" varchar(100),
      ADD COLUMN IF NOT EXISTS "oic" varchar(100),
      ADD COLUMN IF NOT EXISTS "a2IdfNo" varchar(225),
      ADD COLUMN IF NOT EXISTS "boeNo" varchar(100),
      ADD COLUMN IF NOT EXISTS "blNo" varchar(20),
      ADD COLUMN IF NOT EXISTS "transType" varchar(50),
      ADD COLUMN IF NOT EXISTS "estCompDate" varchar(50),
      ADD COLUMN IF NOT EXISTS "jobFinanceeType" varchar(50),
      ADD COLUMN IF NOT EXISTS "jobFinanceeName" varchar(200),
      ADD COLUMN IF NOT EXISTS "jobFinanceeAmount" decimal(12,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "agencyFee" decimal(10,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "jobStatus" varchar(50),
      ADD COLUMN IF NOT EXISTS "vatPer" decimal(5,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "nhilPer" decimal(5,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "gfdPer" decimal(5,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "covidPer" decimal(5,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "containers" text,
      ADD COLUMN IF NOT EXISTS "cntNo" varchar(100),
      ADD COLUMN IF NOT EXISTS "totItem" int NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "strMonth" varchar(10),
      ADD COLUMN IF NOT EXISTS "strYear" varchar(4),
      ADD COLUMN IF NOT EXISTS "vatNhilStatus" varchar(10) NOT NULL DEFAULT '0',
      ADD COLUMN IF NOT EXISTS "paidStatus" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "deletedAt" timestamp;
    -- Drop old stub columns if they exist
    ALTER TABLE "jobs"
      DROP COLUMN IF EXISTS "clientName",
      DROP COLUMN IF EXISTS "details",
      DROP COLUMN IF EXISTS "status";
  END IF;
END $$;
`;
