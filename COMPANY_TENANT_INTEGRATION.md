# Company-Tenant Integration

## What Changed

**Before**: Simple tenant system with just `orgName`
**After**: Full Company entity that serves as both tenant registry and company data store

## Architecture

1. **Company Table** (public schema)
   - Stores all company metadata
   - `appSubdomain` field is the tenant identifier
   - Each company record triggers creation of `tenant_{subdomain}` schema

2. **Tenant Schemas** (isolated per company)
   - Users, Manifests, Jobs live in tenant-specific schemas
   - Complete data isolation between companies

## API Changes

### Creating a Company (replaces POST /tenants)

```bash
POST /companies
{
  "appSubdomain": "acme",
  "companyName": "Acme Corporation",
  "companyTIN": "TIN123456",
  "address": "123 Main St",
  "location": "Accra",
  "telephone": "+233123456789",
  "email": "info@acme.com",
  "vatPer": "12.50",
  "nhilPer": "2.50",
  "gfdPer": "2.50",
  "covidPer": "1.00",
  "cbm": "CBM001"
}
```

This automatically creates the `tenant_acme` schema.

### Other Company Endpoints

```bash
GET    /companies          # List all companies
GET    /companies/:id      # Get company by ID
PUT    /companies/:id      # Update company
DELETE /companies/:id      # Delete company (and its schema)
GET    /tenant/current     # Get current company (requires x-org-name header)
```

### Using Tenant Context

All authenticated requests still use `x-org-name` header with the `appSubdomain` value:

```bash
curl -H "x-org-name: acme" -H "Authorization: Bearer TOKEN" ...
```

## Migration Steps

1. **Existing tenants**: Create Company records for each existing tenant schema
2. **Frontend**: Update to use `/companies` endpoint instead of `/tenants`
3. **Header**: Continue using `x-org-name` with company's `appSubdomain`

## Benefits

- Single source of truth for company data
- No duplicate company info in tenant schemas
- Validates tenant exists before processing requests
- Full CRUD for company management
- Matches frontend Company model exactly
