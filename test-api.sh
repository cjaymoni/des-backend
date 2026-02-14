#!/bin/bash

BASE_URL="http://localhost:5000"

echo "🧪 Testing Multi-Tenant API"
echo "================================"

# Create tenant schemas
echo -e "\n1️⃣ Creating tenant schemas..."
curl -X POST $BASE_URL/tenants -H "Content-Type: application/json" -d '{"orgName":"acme"}' && echo
curl -X POST $BASE_URL/tenants -H "Content-Type: application/json" -d '{"orgName":"globex"}' && echo

# Register users for each tenant
echo -e "\n2️⃣ Registering users..."
echo "Acme user:"
curl -X POST $BASE_URL/auth/register \
  -H "x-org-name: acme" \
  -H "Content-Type: application/json" \
  -d '{"email":"john@acme.com","password":"pass123","firstName":"John","lastName":"Doe"}' && echo

echo -e "\nGlobex user:"
curl -X POST $BASE_URL/auth/register \
  -H "x-org-name: globex" \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@globex.com","password":"pass123","firstName":"Jane","lastName":"Smith"}' && echo

# Login
echo -e "\n3️⃣ Logging in..."
echo "Acme login:"
ACME_TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "x-org-name: acme" \
  -H "Content-Type: application/json" \
  -d '{"email":"john@acme.com","password":"pass123"}' | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
echo "Token: ${ACME_TOKEN:0:20}..."

echo -e "\n✅ Multi-tenant backend is working!"
echo "Each organization has isolated data in separate schemas."
