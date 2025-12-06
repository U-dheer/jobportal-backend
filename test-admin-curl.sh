#!/bin/bash

BASE_URL="http://localhost:3001"

echo "Testing Admin Endpoints..."
echo "=========================="

# Test health endpoint
echo "1. Testing /admin/health..."
curl -X GET "$BASE_URL/admin/health" -H "Content-Type: application/json"
echo -e "\n"

# Test users endpoint without auth (should fail)
echo "2. Testing /admin/users without auth (should fail)..."
curl -X GET "$BASE_URL/admin/users" -H "Content-Type: application/json"
echo -e "\n"

# Test report endpoint without auth (should fail)
echo "3. Testing /admin/report without auth (should fail)..."
curl -X GET "$BASE_URL/admin/report" -H "Content-Type: application/json"
echo -e "\n"

# Test login to get token
echo "4. Testing login to get auth token..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@jobportal.com", "password": "admin123"}')

echo "Login response: $LOGIN_RESPONSE"

# Extract token from response (simple JSON parsing)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo "Token extracted: ${TOKEN:0:20}..."
    
    # Test users endpoint with auth
    echo -e "\n5. Testing /admin/users with auth..."
    curl -X GET "$BASE_URL/admin/users" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN"
    echo -e "\n"
    
    # Test report endpoint with auth
    echo -e "\n6. Testing /admin/report with auth..."
    curl -X GET "$BASE_URL/admin/report" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN"
    echo -e "\n"
else
    echo "Failed to extract token from login response"
fi

echo "Test completed!" 