#!/bin/bash

echo "🚀 Setting up DES Backend..."

# Start PostgreSQL
echo "📦 Starting PostgreSQL..."
docker-compose up -d

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL..."
sleep 5

# Start server
echo "🔥 Starting NestJS server..."
npm run start:dev
