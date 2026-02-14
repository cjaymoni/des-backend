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

-- Manifests table
CREATE TABLE IF NOT EXISTS "manifests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "manifestNumber" varchar NOT NULL,
  "type" varchar NOT NULL,
  "masterManifestId" varchar,
  "data" jsonb,
  "status" varchar NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "createdBy" varchar,
  "updatedBy" varchar
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
