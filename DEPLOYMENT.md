# Deployment Guide - Railway/Render

## Setup

### 1. Deploy Backend

- **Railway**: Connect GitHub repo, auto-deploys
- **Render**: Connect GitHub repo, set build command: `npm install && npm run build`, start command: `npm run start:prod`

### 2. Environment Variables

Add to Railway/Render dashboard:

```
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=neondb
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production
```

### 3. Keep-Alive (Prevent Cold Starts)

**Option A: UptimeRobot (Recommended - Free)**

1. Sign up at https://uptimerobot.com
2. Add monitor: HTTP(s), check every 5 minutes
3. URL: `https://your-backend.railway.app/health`

**Option B: Cron-job.org (Free)**

1. Sign up at https://cron-job.org
2. Create job: every 5 minutes
3. URL: `https://your-backend.railway.app/health`

**Option C: GitHub Actions (Free)**
Add `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Alive
on:
  schedule:
    - cron: '*/5 * * * *'
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: curl https://your-backend.railway.app/health
```

## How It Works

- `/health` endpoint warms up DB connection
- `WarmupInterceptor` pre-warms DB on first request
- Users never see cold start delays
