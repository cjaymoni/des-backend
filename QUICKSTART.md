# 🚀 Quick Start Guide

## What You Have

A **NestJS backend** with **schema-based multi-tenancy**:
- Each organization gets isolated PostgreSQL schema
- Supports 50+ clients easily
- Complete data separation

## Start in 3 Steps

### 1. Start PostgreSQL
```bash
cd des-backend
docker-compose up -d
```

### 2. Start Backend
```bash
npm run start:dev
```

### 3. Create First Tenant
```bash
curl -X POST http://localhost:5000/tenants \
  -H "Content-Type: application/json" \
  -d '{"orgName":"acme"}'
```

## Test It

```bash
./test-api.sh
```

## Connect Frontend

Update `des-frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

Visit: `http://acme.localhost:3000`

## Project Structure

```
des-backend/
├── src/
│   ├── tenant/          # Multi-tenancy logic
│   ├── auth/            # JWT authentication
│   ├── users/           # User entity
│   ├── manifests/       # Manifests module
│   └── jobs/            # Jobs entity
├── .env                 # Configuration
└── docker-compose.yml   # PostgreSQL setup
```

## Key Features

✅ Schema isolation per tenant
✅ JWT authentication
✅ Auto-schema creation
✅ CORS configured for Next.js
✅ TypeORM with PostgreSQL
✅ Request-scoped tenant context

## Next Steps

1. Add more modules (companies, debit-notes, etc.)
2. Implement role-based access control
3. Add data validation with DTOs
4. Set up production database
5. Deploy to Railway/AWS/DigitalOcean

## Need Help?

- Architecture: `ARCHITECTURE.md`
- Frontend Integration: `FRONTEND_INTEGRATION.md`
- Full README: `README.md`
