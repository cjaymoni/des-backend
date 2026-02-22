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

-- Jobs table
CREATE TABLE IF NOT EXISTS "jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "jobNumber" varchar NOT NULL,
  "clientName" varchar NOT NULL,
  "details" jsonb,
  "status" varchar NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "createdBy" varchar,
  "updatedBy" varchar
);
`;
