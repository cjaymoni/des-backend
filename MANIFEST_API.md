# Manifest API Documentation

## Overview
The manifest system manages ocean shipping documentation with Master (Ocean BL) and House (House BL) manifests.

## Authentication
All endpoints require JWT authentication via `Authorization: Bearer <token>` header and `x-org-name` header for tenant context.

---

## Master Manifest Endpoints

### GET /manifests/master
Get all master manifests with pagination and search.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `blNo` (string, optional)
- `vessel` (string, optional)
- `shippingLine` (string, optional)
- `containerNo` (string, optional)
- `shipper` (string, optional)

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "blNo": "BL123456",
      "containerNo": "CONT123456",
      "vessel": "VESSEL NAME",
      "voyage": "V001",
      "arrivalDate": "2024-01-15",
      "shippingLine": "MAERSK",
      "shipper": "ABC COMPANY",
      "createdAt": "2024-01-01T00:00:00Z",
      "createdBy": "user-id"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### GET /manifests/master/:id
Get single master manifest by ID.

### POST /manifests/master
Create new master manifest. Assign a `principalId` to enable handling charge calculation on house BLs.

**Body:**
```json
{
  "blNo": "BL123456",
  "containerNo": "CONT123456",
  "vessel": "VESSEL NAME",
  "voyage": "V001",
  "arrivalDate": "2024-01-15",
  "rotationDate": "2024-01-14",
  "destination": "TEMA",
  "portLoad": "SHANGHAI",
  "shippingLineId": "uuid-of-shipping-line",
  "shipperId": "uuid-of-shipper",
  "principalId": "uuid-of-principal",
  "cntSize": "40FT",
  "sealNo": "SEAL123",
  "consignType": "FCL",
  "rptNo": "RPT001"
}
```

### PUT /manifests/master/:id
Update master manifest. Cascades updates to related house manifests.

### DELETE /manifests/master/:id
Soft delete master manifest and all related house manifests.

---

## House Manifest Endpoints

### GET /manifests/house
Get all house manifests with pagination and search.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `hblNo` (string, optional)
- `consignee` (string, optional)
- `masterManifestId` (uuid, optional)

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "masterManifestId": "master-uuid",
      "hblNo": "HBL123456",
      "shipper": "EXPORTER NAME",
      "consignee": "IMPORTER NAME",
      "description": "GOODS DESCRIPTION",
      "noPkg": 100,
      "weight": 5000.50,
      "totalCBM": 25.75,
      "marksNum": "AS ADDRESSED",
      "handCharge": 150.00,
      "releaseStatus": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### GET /manifests/house/:id
Get single house manifest by ID.

### POST /manifests/house
Create new house manifest. Ensure `totalCBM` is set — it is required for handling charge calculation.

**Body:**
```json
{
  "masterManifestId": "master-uuid",
  "hblNo": "HBL123456",
  "shipper": "EXPORTER NAME",
  "consignee": "IMPORTER NAME",
  "description": "GOODS DESCRIPTION",
  "noPkg": 100,
  "weight": 5000.50,
  "totalCBM": 25.75,
  "marksNum": "AS ADDRESSED",
  "remark": "FRAGILE",
  "handCharge": 150.00,
  "hblType": "ORIGINAL",
  "fileDate": "2024-01-15"
}
```

### PUT /manifests/house/:id
Update house manifest. Recalculates charge if weight changes.

**Body (partial update):**
```json
{
  "weight": 6000.00,
  "releaseStatus": true,
  "releaseDate": "2024-01-20"
}
```

### DELETE /manifests/house/:id
Soft delete house manifest.

---

## Principals Endpoints

### GET /principals
List all principals with pagination. Filter by `name` or `isActive`.

### GET /principals/:id
Get single principal.

### POST /principals
Create a new active principal.

**Body:**
```json
{ "name": "GLC OCEAN LINE", "isActive": true }
```

### PUT /principals/:id
Update principal name or active status.

### DELETE /principals/:id
Soft delete principal.

---

## Currencies Endpoints

### GET /currencies
List all currencies. Filter by `code` or `isActive`.

### GET /currencies/:id
Get single currency.

### POST /currencies
Create a currency rate. The currency must be active for use in handling charge calculations.

**Body:**
```json
{ "code": "USD", "name": "US Dollar", "rate": 14, "period": "JAN-2024", "isActive": true }
```

### PUT /currencies/:id
Update rate, period, or active status.

### DELETE /currencies/:id
Soft delete currency.

---

## Principal Charge Setup Endpoints

### GET /principal-charges
List all principal charge setups with their charge types.

### GET /principal-charges/:principalId
Get the charge setup for a specific principal.

### POST /principal-charges
Create or fully replace a principal's handling charge setup (upsert). Max 10 charge types.

**Body:**
```json
{
  "principalId": "uuid-of-principal",
  "currencyId": "uuid-of-currency",
  "chargeTypes": [
    { "chargeType": "CFS", "calcMode": "MIN_MAX", "minValue": 25, "maxValue": 110, "sortOrder": 0 },
    { "chargeType": "DRYAGE", "calcMode": "MIN_MAX", "minValue": 16, "maxValue": 35, "sortOrder": 1 },
    { "chargeType": "GCNET", "calcMode": "FIXED", "fixedValue": 70, "sortOrder": 2 },
    { "chargeType": "THC", "calcMode": "MIN_MAX", "minValue": 12, "maxValue": 30, "sortOrder": 3 }
  ]
}
```

**calcMode values:** `MIN_MAX`, `MAX`, `FIXED`

### DELETE /principal-charges/:principalId
Remove a principal's charge setup.

---

## Recompute Handling Charge

### POST /manifest-jobs/:id/recompute-handling-charge
Recalculates the handling charge for a manifest job using the principal's charge setup and the house BL's CBM.

**Prerequisites:**
1. Master manifest must have a `principalId` assigned
2. The principal must have an active currency and charge setup configured
3. The house BL must have a `totalCBM` value > 0

**Response:**
```json
{
  "job": { "id": "...", "handCharge": 3430, "calcStatus": true, "..." },
  "result": {
    "handCharge": 245,
    "currencyRate": 14,
    "totalHandCharge": 3430,
    "breakdown": [
      { "chargeType": "CFS", "calcMode": "MIN_MAX", "subCharge": 110 },
      { "chargeType": "DRYAGE", "calcMode": "MIN_MAX", "subCharge": 35 },
      { "chargeType": "GCNET", "calcMode": "FIXED", "subCharge": 70 },
      { "chargeType": "THC", "calcMode": "MIN_MAX", "subCharge": 30 }
    ]
  }
}
```

---

## Weight Charges Endpoints

### GET /manifests/charges
Get all weight charge configurations.

**Response:**
```json
[
  {
    "id": "uuid",
    "weightFrom": 0,
    "weightTo": 1000,
    "charges": 50.00
  },
  {
    "id": "uuid",
    "weightFrom": 1001,
    "weightTo": 5000,
    "charges": 100.00
  }
]
```

### POST /manifests/charges
Create weight charge configuration.

**Body:**
```json
{
  "weightFrom": 5001,
  "weightTo": 10000,
  "charges": 200.00
}
```

### DELETE /manifests/charges/:id
Delete weight charge configuration.

---

## Features

✅ **Multi-tenant isolation** - Each organization has separate data  
✅ **Soft deletes** - Data is never permanently deleted  
✅ **Audit trail** - Tracks who created/updated records  
✅ **Principal-based handling charge calculation** - CBM × charge type rules per principal  
✅ **Recompute handling charge** - Triggered on manifest job via dedicated endpoint  
✅ **Warehouse rent charge calculation** - Day bracket engine (unstuffDate → deliveryDate)  
✅ **Warehouse HBL availability tracking** - readStatusW flag gates warehouse processing  
✅ **Cascading updates** - Master changes propagate to house manifests  
✅ **Search & filter** - Multiple search criteria supported  
✅ **Pagination** - Efficient data retrieval  

---

## Warehouse Endpoints

### GET /warehouse/rent-charges
List all rent charge brackets ordered by `dayFrom` ascending.

### POST /warehouse/rent-charges
Create a new day bracket. Rejects overlapping ranges.

**Body:**
```json
{ "dayFrom": 1, "dayTo": 7, "unitCharge": 0 }
```

### PUT /warehouse/rent-charges/:id
Update a bracket. Re-validates overlap excluding self.

### DELETE /warehouse/rent-charges/:id
Delete a bracket.

---

### GET /warehouse/jobs/available-hbls
Returns house manifests where `readStatusW = true` — HBLs not yet processed for warehouse.

**Query Parameters:**
- `search` (string, optional) — filters by consignee, hblNo or description

### GET /warehouse/jobs/preview-rent
Calculates rent charge without persisting. Requires brackets to be configured.

**Query Parameters:**
- `unstuffDate` (date, required) e.g. `2024-11-22`
- `deliveryDate` (date, required) e.g. `2025-01-02`

**Response:**
```json
{
  "totalDays": 42,
  "rentCharge": 733.04,
  "breakdown": [
    { "dayFrom": 1, "dayTo": 7, "daysApplied": 7, "unitCharge": 0, "charge": 0 },
    { "dayFrom": 8, "dayTo": 14, "daysApplied": 7, "unitCharge": 11.64, "charge": 81.48 },
    { "dayFrom": 15, "dayTo": 1000, "daysApplied": 28, "unitCharge": 23.27, "charge": 651.56 }
  ]
}
```

### POST /warehouse/jobs
Create a warehouse job. Auto-calculates `rentCharge` and `period` from brackets.
Sets `HouseManifest.readStatusW = false` on save.

**Required fields:** `jobNo`, `hblNo`, `houseManifestId`, `consigneeDetails`, `unstuffDate`, `deliveryDate`

**Body:**
```json
{
  "jobNo": "WH-2024-001",
  "hblNo": "HBL123456",
  "houseManifestId": "uuid",
  "consigneeDetails": "IMPORTER NAME",
  "unstuffDate": "2024-11-22",
  "deliveryDate": "2025-01-02",
  "arrivalDate": "2024-11-20",
  "weight": 500.00,
  "totalCBM": 5.50,
  "noPkg": 10,
  "vatPer": 15,
  "nhilPer": 2.5,
  "gfdPer": 0.5,
  "covidPer": 1,
  "cargoType": "GENERAL",
  "cargoTypeLevel": 1,
  "cargoTypeAmt": 0,
  "agentName": "AGENT NAME",
  "fileDate": "2024-11-22"
}
```

### PUT /warehouse/jobs/:id
Update a warehouse job. If `unstuffDate` or `deliveryDate` changes, `rentCharge` and `period` are automatically recomputed.

### POST /warehouse/jobs/:id/post-to-income
Posts the job's `grandTotal` to `IncomeExpenditure` (upsert by `transRemarks = jobNo`).
Requires `grandTotal > 0`.

### DELETE /warehouse/jobs/:id
Soft deletes the job, restores `HouseManifest.readStatusW = true`, and removes the linked income record.

---

## Example: Full Warehouse Flow

```bash
# 1. Setup brackets
curl -X POST http://localhost:5000/warehouse/rent-charges \
  -H "x-org-name: acme" -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dayFrom": 1, "dayTo": 7, "unitCharge": 0}'

curl -X POST http://localhost:5000/warehouse/rent-charges \
  -H "x-org-name: acme" -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dayFrom": 8, "dayTo": 14, "unitCharge": 11.64}'

curl -X POST http://localhost:5000/warehouse/rent-charges \
  -H "x-org-name: acme" -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dayFrom": 15, "dayTo": 1000, "unitCharge": 23.27}'

# 2. Preview charge
curl "http://localhost:5000/warehouse/jobs/preview-rent?unstuffDate=2024-11-22&deliveryDate=2025-01-02" \
  -H "x-org-name: acme" -H "Authorization: Bearer TOKEN"

# 3. Create warehouse job
curl -X POST http://localhost:5000/warehouse/jobs \
  -H "x-org-name: acme" -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jobNo": "WH-2024-001", "hblNo": "HBL123456", "houseManifestId": "uuid", "consigneeDetails": "IMPORTER", "unstuffDate": "2024-11-22", "deliveryDate": "2025-01-02"}'

# 4. Post to income
curl -X POST http://localhost:5000/warehouse/jobs/JOB_ID/post-to-income \
  -H "x-org-name: acme" -H "Authorization: Bearer TOKEN"
```

```bash
# Create master manifest
curl -X POST http://localhost:5000/manifests/master \
  -H "x-org-name: acme" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "blNo": "BL123456",
    "containerNo": "CONT123456",
    "vessel": "MAERSK VESSEL",
    "voyage": "V001",
    "arrivalDate": "2024-01-15",
    "shippingLine": "MAERSK"
  }'

# Create house manifest
curl -X POST http://localhost:5000/manifests/house \
  -H "x-org-name: acme" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "masterManifestId": "master-uuid-from-above",
    "hblNo": "HBL123456",
    "consignee": "IMPORTER NAME",
    "description": "ELECTRONICS",
    "noPkg": 50,
    "weight": 2500,
    "totalCBM": 15.5
  }'

# Search manifests
curl "http://localhost:5000/manifests/master?page=1&limit=10&vessel=MAERSK" \
  -H "x-org-name: acme" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
