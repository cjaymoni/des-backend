# Multi-Tenant Architecture Overview

## Schema Isolation Strategy

Each organization gets a **dedicated PostgreSQL schema**:
- `tenant_acme` → Acme Corp data
- `tenant_globex` → Globex Inc data
- `tenant_initech` → Initech LLC data

## How It Works

1. **Request Flow**:
   ```
   Frontend (subdomain: acme.app.com)
   → Proxy extracts "acme" → Sets x-org-name header
   → Backend receives x-org-name
   → TenantMiddleware sets tenant context
   → All queries run in tenant_acme schema
   ```

2. **Database Structure**:
   ```
   des_multi_tenant (database)
   ├── tenant_acme (schema)
   │   ├── users
   │   ├── manifests
   │   └── jobs
   ├── tenant_globex (schema)
   │   ├── users
   │   ├── manifests
   │   └── jobs
   └── tenant_initech (schema)
       ├── users
       ├── manifests
       └── jobs
   ```

## Benefits

✅ **Complete Data Isolation**: Each tenant's data is physically separated
✅ **Easy Backup/Restore**: Backup individual schemas
✅ **Scalable**: Supports 50+ tenants easily
✅ **Cost-Effective**: Single database instance
✅ **Secure**: No risk of cross-tenant data leaks

## Scaling for 50+ Clients

**Current Setup (0-100 clients)**:
- Single PostgreSQL instance
- Schema per tenant
- Shared connection pool

**Future Scaling (100+ clients)**:
- Add read replicas
- Implement caching (Redis)
- Consider database sharding

## Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Disable TypeORM synchronize
- [ ] Use migrations instead
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Add rate limiting
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Use environment-specific configs
