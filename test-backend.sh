#!/bin/bash

echo "Testing BD Backend at https://bd-backend.up.railway.app"
echo "=========================================="
echo ""

# Test 1: Root endpoint
echo "1. Testing root endpoint..."
curl -s https://bd-backend.up.railway.app/ | jq . || curl -s https://bd-backend.up.railway.app/
echo ""

# Test 2: Health check
echo "2. Testing health endpoint..."
curl -s https://bd-backend.up.railway.app/api/health | jq . || curl -s https://bd-backend.up.railway.app/api/health
echo ""

# Test 3: Get categories
echo "3. Getting categories..."
curl -s https://bd-backend.up.railway.app/api/categories | jq . || curl -s https://bd-backend.up.railway.app/api/categories
echo ""

# Test 4: Get guests
echo "4. Getting guests..."
curl -s https://bd-backend.up.railway.app/api/guests | jq . || curl -s https://bd-backend.up.railway.app/api/guests
echo ""

echo "=========================================="
echo "Test complete!"
echo ""
echo "Expected: All endpoints should return JSON responses"
echo "If you see 'Application not found' (404), backend is still deploying or misconfigured"
echo ""