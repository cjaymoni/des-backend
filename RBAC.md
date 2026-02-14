# Role-Based Access Control (RBAC)

## Roles

### 1. **user** (default)
- Read access to manifests within their tenant
- Basic authenticated operations

### 2. **company_admin**
- All user permissions
- Update their own company settings only
- Manage users within their tenant
- Requires tenant context (`x-org-name` header)

### 3. **system_admin**
- Full system access across all tenants
- Access `/admin/*` endpoints
- View all companies, users, and stats
- No tenant context required

## Endpoint Access

### Public (No Auth)
- `POST /auth/register`
- `POST /auth/login`
- `GET /health`

### Authenticated (Any Role)
- `GET /manifests`
- `GET /manifests/:id`
- `POST /manifests`
- `PUT /manifests/:id`
- `DELETE /manifests/:id`
- `GET /companies`
- `GET /companies/:id`
- `GET /tenant/current`

### Company Admin Only
- `PUT /companies/:id` - Update own company only

### System Admin Only
- `POST /companies` - Create companies
- `PUT /companies/:id` - Update any company
- `DELETE /companies/:id` - Delete companies
- `GET /admin/companies` - All companies
- `GET /admin/users` - All users
- `GET /admin/stats` - System statistics

## Headers

**Tenant Endpoints** (manifests, companies):
```
Authorization: Bearer <token>
x-org-name: <company-subdomain>
```

**Admin Endpoints**:
```
Authorization: Bearer <token>
```

## Creating Admins

**First System Admin** (Bootstrap):
```bash
npm run build && node dist/seed-admin.js
# Creates: admin@system.com / admin123
```

**Additional System Admins**:
```bash
POST /auth/register-system-admin
Authorization: Bearer <system_admin_token>
{
  "email": "newadmin@system.com",
  "password": "password",
  "firstName": "New",
  "lastName": "Admin"
}
```

**Company Admin**:
```bash
POST /auth/register
x-org-name: acme
{
  "email": "admin@acme.com",
  "password": "password",
  "firstName": "John",
  "lastName": "Doe",
  "role": "company_admin"  # Only 'user' or 'company_admin' allowed
}
```

**Note**: Regular `/auth/register` endpoint only accepts `user` or `company_admin` roles. System admins can only be created via bootstrap script or by existing system admins.
