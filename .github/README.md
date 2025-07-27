# CI/CD Pipeline Documentation

This repository uses GitHub Actions for continuous integration and deployment.

## Workflows Overview

### 1. **Pull Request Checks** (`.github/workflows/pr-check.yml`)

- **Triggers**: Pull requests to `main` or `develop` branches
- **Purpose**: Validate code quality before merging
- **Actions**:
  - Lint frontend code
  - Type check TypeScript
  - Run unit tests for both frontend and backend
  - Security audit of dependencies

### 2. **Main CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)

- **Triggers**: Pushes to `main` or `develop` branches
- **Purpose**: Full testing, building, and deployment
- **Jobs**:
  - **Test**: Lint, type check, and test both applications
  - **Deploy Frontend**: Build and deploy to Vercel
  - **Deploy Backend**: Build and deploy to Render
  - **Migrate Database**: Run Prisma migrations
  - **Security**: Audit dependencies and check for vulnerabilities
  - **Analyze**: Bundle analysis for frontend optimization

### 3. **Release Pipeline** (`.github/workflows/release.yml`)

- **Triggers**: Git tags matching `v*` pattern (e.g., `v1.0.0`)
- **Purpose**: Production releases with GitHub releases
- **Actions**:
  - Create GitHub release with changelog
  - Deploy to production environments
  - Run database migrations
  - Send deployment notifications

## Required GitHub Secrets

### Vercel Deployment

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

### Render Deployment

```bash
RENDER_SERVICE_ID=your_render_service_id
RENDER_API_KEY=your_render_api_key
```

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://debugging-helper-backend.onrender.com
DATABASE_URL=postgresql://your_database_url
OPENAI_API_KEY=your_openai_api_key
```

## How to Set Up Secrets

### 1. Vercel Secrets

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project settings
3. Go to "Tokens" section
4. Create a new token
5. Get your Org ID and Project ID from the project settings

### 2. Render Secrets

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Navigate to your service
3. Go to "Environment" tab
4. Copy the Service ID from the URL
5. Create an API key in your account settings

### 3. GitHub Secrets Setup

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add each secret with the exact names listed above

## Deployment Process

### Automatic Deployments

- **Main branch**: Automatic deployment to production
- **Develop branch**: Automatic deployment to staging (if configured)
- **Pull requests**: Only run tests, no deployment

### Manual Releases

1. Create and push a new tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. This triggers the release workflow
3. Creates a GitHub release with changelog
4. Deploys to production environments

## Local Development

### Running Tests Locally

```bash
# Run all tests
npm test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend

# Run linting
npm run lint --prefix frontend
```

### Database Migrations

```bash
# Generate Prisma client
cd backend && npx prisma generate --schema=../prisma/schema.prisma

# Run migrations
cd backend && npx prisma migrate deploy --schema=../prisma/schema.prisma
```

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check Node.js version compatibility
   - Ensure all dependencies are installed
   - Verify environment variables are set

2. **Deployment Failures**

   - Verify secrets are correctly configured
   - Check service permissions
   - Review deployment logs

3. **Database Migration Issues**
   - Ensure DATABASE_URL is correct
   - Check Prisma schema compatibility
   - Verify database connection

### Debugging Workflows

1. Go to Actions tab in GitHub
2. Click on the failed workflow
3. Check the specific job that failed
4. Review logs for error details

## Best Practices

1. **Branch Protection**

   - Enable branch protection on `main`
   - Require PR reviews
   - Require status checks to pass

2. **Testing**

   - Write tests for new features
   - Maintain good test coverage
   - Use meaningful test descriptions

3. **Security**

   - Regularly update dependencies
   - Monitor security advisories
   - Use least privilege for deployment tokens

4. **Monitoring**
   - Set up deployment notifications
   - Monitor application health
   - Track performance metrics
