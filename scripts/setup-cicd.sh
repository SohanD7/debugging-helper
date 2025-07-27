#!/bin/bash

echo "Setting up CI/CD Pipeline for Debugging Helper"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

echo "Project structure verified"

# Create .github directory if it doesn't exist
mkdir -p .github/workflows

echo "📋 Next steps to complete CI/CD setup:"
echo ""
echo "1. Set up GitHub Secrets:"
echo "   Go to your GitHub repository → Settings → Secrets and variables → Actions"
echo "   Add the following secrets:"
echo ""
echo "   Vercel Deployment:"
echo "   - VERCEL_TOKEN"
echo "   - VERCEL_ORG_ID" 
echo "   - VERCEL_PROJECT_ID"
echo ""
echo "   Render Deployment:"
echo "   - RENDER_SERVICE_ID"
echo "   - RENDER_API_KEY"
echo ""
echo "   Environment Variables:"
echo "   - NEXT_PUBLIC_API_URL"
echo "   - DATABASE_URL"
echo "   - OPENAI_API_KEY"
echo ""
echo "2. Get Vercel credentials:"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Navigate to your project settings"
echo "   - Create a token in the 'Tokens' section"
echo "   - Get Org ID and Project ID from project settings"
echo ""
echo "3. Get Render credentials:"
echo "   - Go to https://dashboard.render.com"
echo "   - Navigate to your service"
echo "   - Copy Service ID from the URL"
echo "   - Create API key in account settings"
echo ""
echo "4. Test the pipeline:"
echo "   - Push to main branch to trigger deployment"
echo "   - Create a PR to test validation"
echo "   - Create a tag (v1.0.0) to test releases"
echo ""
echo "5. Read the documentation:"
echo "   - Check .github/README.md for detailed instructions"
echo ""
echo "CI/CD pipeline is ready to use!" 