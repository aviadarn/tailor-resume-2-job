#!/bin/bash

echo "Testing Resume Tailor API..."
echo ""

# Check if server is running
echo "1. Checking if server is running..."
HEALTH_CHECK=$(curl -s http://localhost:3000/health 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✓ Server is running"
    echo "Response: $HEALTH_CHECK"
else
    echo "✗ Server is not running"
    echo "Please start the server with: docker-compose up -d"
    exit 1
fi

echo ""
echo "2. Testing resume tailoring (requires job URL)..."
echo "Usage: curl -X POST http://localhost:3000/tailor-resume \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"jobUrl\": \"YOUR_JOB_URL_HERE\"}'"
echo ""
echo "Or use the Chrome extension for easier testing."
