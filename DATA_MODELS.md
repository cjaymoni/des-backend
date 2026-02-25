# DES Backend — Data Models & Architecture

## Module Structure

```
src/
├── auth/                   # JWT authentication
├── users/                  # User accounts (per tenant)
├── companies/              # Company profile (public schema)
├── tenant/                 # Multi-tenancy middleware & context
├── manifests/
│   ├── entities/
│   │   ├── master-manifest.entity.ts
│   │   ├── house-manifest.entity.ts
│   │   └── weight-charge.entity.ts
│   └── services/ & controllers/
├── manifest-jobs/          # Handling charges job file (JobFiles_Man)
├── jobs/                   # Customs declaration job file (JobFiles)
├── importer-exporter/      # Consignee/shipper master data
├── income-expenditure/     # Financial transactions linked to jobs
├── bank-transactions/      # Bank accounts & standalone bank transactions
├── uploads/                # File attachment handling
├── admin/                  # System admin & migrations
└── health/                 # Health check endpoint
```

---

## Entity Relationship Diagram

```
[Company] (public schema — shared)
    │
    │  appSubdomain = tenant identifier
    │
    ▼
[tenant_{orgName} schema] ─────────────────────────────────────────────────────
    │
    ├── [User]
    │
    ├── [MasterManifest] ──────────────────────────────────────────────────────
    │       │ blNo, containerNo, vessel, voyage, arrivalDate
    │       │
    │       └──(OneToMany)──► [HouseManifest]
    │                               │ hblNo, consignee, weight, handCharge
    │                               │ releaseStatus, attachments (jsonb)
    │                               │
    │                               └──(OneToMany)──► [ManifestJob]
    │                                                       │ jobNo, handCharge
    │                                                       │ vatAmt, nhilAmt
    │                                                       │ paidStatus, releaseStatus
    │
    ├── [Job]  (customs declaration — independent)
    │       │ jobNo, ie (importer/exporter name), blNo
    │       │ totDuty, agencyFee, vatPer, nhilPer
    │       │ transType, jobStatus, paidStatus
    │       │
    │       └──(logical link via transRemarks)──► [IncomeExpenditure]
    │                                                   │ transRemarks = jobNo
    │                                                   │ hbl = blNo
    │                                                   │ incomeAmt, netIncome
    │                                                   │ vatNhilStatus
    │
    ├── [ImporterExporter]  (master data — no FK, referenced by name in Job.ie)
    │       code, ieName, tin, address
    │
    ├── [BankAccount]  (standalone — no FK to jobs/manifests)
    │       │ bankCode, acctNumber, acctType, currencyCode, balance
    │       │
    │       └──(OneToMany by acctNumber)──► [BankTransaction]
    │                                             bankCode, acctNumber
    │                                             transactionType (Deposit/Withdrawal)
    │                                             creditAmt, debitAmt, bankCharges
    │                                             balance (running total)
    │
    └── [WeightCharge]  (lookup table — no FK)
            weightFrom, weightTo, charges
```

---

## Relationships Summary

| Entity | Relates To | Type | Key |
|--------|-----------|------|-----|
| `MasterManifest` | `HouseManifest` | One-to-Many | `house_manifests.masterManifestId` |
| `HouseManifest` | `ManifestJob` | One-to-Many | `manifest_jobs.houseManifestId` |
| `Job` | `IncomeExpenditure` | Logical (no FK) | `income_expenditures.transRemarks = jobs.jobNo` |
| `Job` | `ImporterExporter` | Logical (no FK) | `jobs.ie` matches `importer_exporters.ieName` |
| `BankAccount` | `BankTransaction` | One-to-Many | `bank_transactions.acctNumber` |
| `Company` | all tenant tables | Logical | `company.appSubdomain` → schema name |

> **Logical links** are intentional — they mirror the VB6 design where cross-table references were done by matching string values rather than foreign keys. This avoids cascade complexity and keeps modules independently deployable.

---

## Multi-Tenancy

Every request must include the `x-org-name` header. The `TenantMiddleware` sets the PostgreSQL `search_path` to `tenant_{orgName}` so all queries run in the correct schema automatically.

```
Request → x-org-name: acme
        → TenantMiddleware sets search_path = tenant_acme
        → All TypeORM queries hit tenant_acme.* tables
```

`Company` lives in the `public` schema and is shared across all tenants. It holds the VAT/NHIL/GFD rates used when creating jobs.

---

## Key Business Flows

### 1. Manifest → Handling Charges
```
Create MasterManifest (BL No, vessel, container)
  └─► Create HouseManifest (HBL No, consignee, weight)
        └─► Create ManifestJob (handling charge calculation)
              vatAmt = handCharge × vatPer / 100
              nhilAmt = handCharge × nhilPer / 100
              grandHandCharge = handCharge + vatAmt + nhilAmt + gfdAmt
```

### 2. Job → Income Recording
```
Create Job (jobNo, ie, agencyFee, totDuty)
  └─► Create IncomeExpenditure (transRemarks = jobNo)
        incomeAmt = agencyFee
        netIncVat = agencyFee × (vatPer + nhilPer + gfdPer) / 100
```

### 3. Bank Transaction → Balance Update
```
Create BankTransaction (Deposit/Withdrawal, amount)
  └─► BankAccount.balance updated atomically
        Deposit:    balance = balance + transactionAmount
        Withdrawal: balance = balance - transactionAmount
```

---

## Schema per Entity

| Table | Schema | Notes |
|-------|--------|-------|
| `companies` | `public` | Shared; holds tax rates & company info |
| `users` | `tenant_{org}` | Per-tenant user accounts |
| `master_manifests` | `tenant_{org}` | Ocean/Air BL |
| `house_manifests` | `tenant_{org}` | HBL, FK → master_manifests |
| `weight_charges` | `tenant_{org}` | Lookup: weight range → charge rate |
| `manifest_jobs` | `tenant_{org}` | Handling charge job file, FK → house_manifests |
| `jobs` | `tenant_{org}` | Customs declaration job file |
| `importer_exporters` | `tenant_{org}` | Consignee/shipper master data |
| `income_expenditures` | `tenant_{org}` | Financial records linked to jobs |
| `bank_accounts` | `tenant_{org}` | Bank account master |
| `bank_transactions` | `tenant_{org}` | Deposits & withdrawals |

---

## API Endpoints

| Module | Base Route | Auth |
|--------|-----------|------|
| Auth | `POST /auth/register`, `POST /auth/login` | Public |
| Users | `GET/PUT /users/:id` | JWT |
| Companies | `GET/POST/PUT /companies` | JWT |
| Master Manifests | `GET/POST/PUT/DELETE /manifests/master` | JWT |
| House Manifests | `GET/POST/PUT/DELETE /manifests/house` | JWT |
| Weight Charges | `GET/POST/PUT/DELETE /manifests/weight-charges` | JWT |
| Manifest Jobs | `GET/POST/PUT/DELETE /manifest-jobs` | JWT |
| Jobs | `GET/POST/PUT/DELETE /jobs` | JWT |
| Importer/Exporter | `GET/POST/PUT/DELETE /importer-exporters` | JWT |
| Income/Expenditure | `GET/POST/PUT/DELETE /income-expenditure` | JWT |
| Bank Accounts | `GET/POST/PUT/DELETE /bank-transactions/accounts` | JWT |
| Bank Transactions | `GET/POST/PUT/DELETE /bank-transactions` | JWT |
| Uploads | `POST /uploads`, `DELETE /uploads/:publicId` | JWT |
| Health | `GET /health` | Public |
| Tenants | `POST/DELETE /admin/tenants` | JWT (system_admin) |

---

## Roles

| Role | Access |
|------|--------|
| `system_admin` | All tenants, admin routes, tenant management |
| `company_admin` | Own tenant — full CRUD |
| `user` | Own tenant — read + limited write |

Roles are enforced via `RolesGuard` + `@Roles()` decorator on controller methods.
