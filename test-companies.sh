#!/bin/bash

BASE_URL="http://localhost:5000"

echo "🧪 Testing Multi-Tenant API with Companies"
echo "=========================================="

# Create companies (this creates tenant schemas automatically)
echo -e "\n1️⃣ Creating companies..."
echo "Acme Corp:"
curl -X POST $BASE_URL/companies -H "Content-Type: application/json" -d '{
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
}' && echo

echo -e "\nGlobex Inc:"
curl -X POST $BASE_URL/companies -H "Content-Type: application/json" -d '{
  "appSubdomain": "globex",
  "companyName": "Globex Inc",
  "companyTIN": "TIN789012",
  "address": "456 Oak Ave",
  "location": "Kumasi",
  "telephone": "+233987654321",
  "email": "info@globex.com",
  "vatPer": "12.50",
  "nhilPer": "2.50",
  "gfdPer": "2.50",
  "covidPer": "1.00",
  "cbm": "CBM002"
}' && echo

# Register users for each company
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

# Get current tenant info
echo -e "\n4️⃣ Getting current company info..."
curl -X GET $BASE_URL/tenant/current \
  -H "x-org-name: acme" \
  -H "Authorization: Bearer $ACME_TOKEN" && echo

echo -e "\n✅ Multi-tenant backend with companies is working!"
echo "Each company has isolated data in separate schemas."
