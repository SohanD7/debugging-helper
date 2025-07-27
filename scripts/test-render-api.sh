#!/bin/bash

echo "🧪 Testing Render API Deployment"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

echo "📋 Render API Test:"
echo ""

echo "🔗 API Endpoint: https://api.render.com/v1/services/{SERVICE_ID}/deploys"
echo ""

echo "📝 Test Command:"
echo "curl -X POST \\"
echo "  -H \"Authorization: Bearer YOUR_API_KEY\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  \"https://api.render.com/v1/services/YOUR_SERVICE_ID/deploys\" \\"
echo "  -d '{\"clearCache\": \"do_not_clear\"}'"
echo ""

echo "🔍 Status Check Command:"
echo "curl -H \"Authorization: Bearer YOUR_API_KEY\" \\"
echo "  \"https://api.render.com/v1/services/YOUR_SERVICE_ID\""
echo ""

echo "📋 Required Secrets:"
echo "- RENDER_SERVICE_ID: Your Render service ID"
echo "- RENDER_API_KEY: Your Render API key"
echo ""

echo "🔗 How to get these:"
echo "1. Go to https://dashboard.render.com"
echo "2. Navigate to your service"
echo "3. Copy the Service ID from the URL"
echo "4. Go to Account Settings → API Keys"
echo "5. Create a new API key"
echo ""

echo "✅ The CI/CD pipeline will now use direct API calls instead of the action"
echo "🎉 This approach is more reliable and doesn't depend on external actions" 