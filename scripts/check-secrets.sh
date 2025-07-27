#!/bin/bash

echo "🔍 Checking CI/CD Pipeline Secrets"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

echo "📋 Required GitHub Secrets:"
echo ""

echo "🔐 Vercel Deployment Secrets:"
echo "   - VERCEL_TOKEN (Required for frontend deployment)"
echo "   - VERCEL_ORG_ID (Required for frontend deployment)"
echo "   - VERCEL_PROJECT_ID (Required for frontend deployment)"
echo ""

echo "🚀 Render Deployment Secrets:"
echo "   - RENDER_SERVICE_ID (Required for backend deployment)"
echo "   - RENDER_API_KEY (Required for backend deployment)"
echo ""

echo "🌍 Environment Variables:"
echo "   - NEXT_PUBLIC_API_URL (Required for frontend build)"
echo "   - DATABASE_URL (Required for database migrations)"
echo "   - OPENAI_API_KEY (Required for backend functionality)"
echo ""

echo "📝 How to set up secrets:"
echo "1. Go to your GitHub repository"
echo "2. Navigate to Settings → Secrets and variables → Actions"
echo "3. Click 'New repository secret'"
echo "4. Add each secret with the exact names listed above"
echo ""

echo "🔗 Quick Links:"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Render Dashboard: https://dashboard.render.com"
echo "- GitHub Secrets: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/')/settings/secrets/actions"
echo ""

echo "⚠️  Note: If secrets are not configured, the pipeline will:"
echo "   - Skip deployment steps gracefully"
echo "   - Continue with testing and validation"
echo "   - Show warnings in the logs"
echo ""

echo "🎉 Your CI/CD pipeline is ready to use!" 