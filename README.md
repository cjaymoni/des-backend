# DES Backend - Multi-Tenant NestJS API

## Architecture

**Schema-Based Multi-Tenancy**: Each organization gets its own PostgreSQL schema for complete data isolation.

## Setup

### 1. Install PostgreSQL
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15
```

### 2. Create Database
```bash
psql postgres
CREATE DATABASE des_multi_tenant;
\q
```

### 3. Configure Environment
Update `.env` with your database credentials.

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Server
```bash
npm run start:dev
```

## Creating a New Tenant

```bash
curl -X POST http://localhost:5000/tenants \
  -H "Content-Type: application/json" \
  -d '{"orgName": "acme"}'
```

This creates a new schema: `tenant_acme`

## API Usage

All requests must include the `x-org-name` header:

```bash
# Register user for tenant
curl -X POST http://localhost:5000/auth/register \
  -H "x-org-name: acme" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@acme.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "x-org-name: acme" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@acme.com",
    "password": "password123"
  }'

# Get manifests (with JWT token)
curl http://localhost:5000/manifests \
  -H "x-org-name: acme" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Frontend Integration

Your Next.js proxy already sends `x-org-name` header. Update frontend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

## Deployment

- **Railway**: Auto-deploy with PostgreSQL addon
- **AWS ECS**: Use RDS PostgreSQL
- **DigitalOcean**: App Platform + Managed PostgreSQL

## Schema Management

Each tenant schema is automatically created on first request. To manually manage:

```typescript
// Create schema
await tenantService.createTenantSchema('acme');

// Delete schema
await tenantService.deleteTenantSchema('acme');
```
