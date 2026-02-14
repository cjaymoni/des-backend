# Frontend Integration Guide

## Step 1: Update Environment Variables

In `des-frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

## Step 2: API Client Already Configured ✅

Your existing `lib/api/client.ts` is already set up correctly:
- Sends JWT tokens
- Handles 401 errors
- 30-second timeout

The proxy middleware automatically adds `x-org-name` header.

## Step 3: Start Backend

```bash
cd des-backend

# Option 1: With Docker (recommended)
docker-compose up -d
npm run start:dev

# Option 2: Quick start script
./start.sh
```

## Step 4: Create Your First Tenant

```bash
# Create tenant schema for "acme"
curl -X POST http://localhost:5000/tenants \
  -H "Content-Type: application/json" \
  -d '{"orgName": "acme"}'
```

## Step 5: Test Frontend

1. Visit: `http://acme.localhost:3000`
2. Register a new user
3. Login and access manifests

## API Endpoints Available

### Auth
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user

### Manifests
- `GET /manifests` - List all manifests
- `GET /manifests/:id` - Get single manifest
- `POST /manifests` - Create manifest
- `PUT /manifests/:id` - Update manifest
- `DELETE /manifests/:id` - Delete manifest

### Tenants (Admin)
- `POST /tenants` - Create new tenant schema
- `DELETE /tenants/:orgName` - Delete tenant schema

## Adding More Modules

To add jobs, companies, etc.:

```bash
cd des-backend
nest g resource jobs --no-spec
nest g resource companies --no-spec
```

Then follow the same pattern as manifests module.

## Production Deployment

### Railway (Easiest)
1. Connect GitHub repo
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy

### AWS ECS
1. Create RDS PostgreSQL
2. Build Docker image
3. Deploy to ECS/Fargate
4. Configure ALB

### DigitalOcean
1. Create Managed PostgreSQL
2. Deploy via App Platform
3. Connect database
