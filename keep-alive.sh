#!/bin/bash
# Keep-alive script for Railway/Render deployment
# Use with cron-job.org or UptimeRobot (free tier: 5min intervals)

BACKEND_URL="YOUR_BACKEND_URL"

curl -s "${BACKEND_URL}/health" > /dev/null
