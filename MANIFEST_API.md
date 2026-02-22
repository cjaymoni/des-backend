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
Create new master manifest.

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
  "shippingLine": "MAERSK",
  "shipper": "ABC COMPANY",
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
Create new house manifest. Automatically calculates handling charge based on weight if not provided.

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
✅ **Automatic charge calculation** - Based on weight ranges  
✅ **Cascading updates** - Master changes propagate to house manifests  
✅ **Search & filter** - Multiple search criteria supported  
✅ **Pagination** - Efficient data retrieval  

---

## Example Usage

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
