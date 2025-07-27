# Debugging Helper

A comprehensive debugging assistance tool that leverages AI to analyze code, stack traces, git diffs, and commit messages to provide intelligent debugging insights and context-aware recommendations.

## Overview

Debugging Helper is a full-stack web application designed to streamline the debugging process by providing AI-powered analysis of various debugging artifacts. The application maintains session history and context across multiple debugging sessions, enabling users to track their debugging progress and build upon previous analyses.

## Features

### Core Functionality

- **Code Analysis**: AI-powered analysis of code snippets with detailed explanations and suggestions
- **Stack Trace Analysis**: Intelligent parsing and interpretation of error stack traces
- **Git Diff Analysis**: Context-aware analysis of code changes and their potential impact
- **Commit Message Analysis**: Evaluation of commit messages for clarity and completeness
- **Session Management**: Persistent storage of debugging sessions with full context history
- **Context Timeline**: Visual representation of debugging progress and related artifacts

### Technical Features

- **Real-time Analysis**: Instant AI-powered insights using OpenAI's GPT models
- **Persistent Storage**: PostgreSQL database with Prisma ORM for reliable data persistence
- **Responsive Design**: Modern, mobile-friendly interface built with Next.js and Tailwind CSS
- **Type Safety**: Full TypeScript implementation for enhanced development experience
- **API Integration**: RESTful API with comprehensive error handling and logging

## Architecture

### Frontend

- **Framework**: Next.js 15 with React 18
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks with custom session management
- **UI Components**: Radix UI primitives with custom styling
- **Animations**: Framer Motion for smooth user interactions
- **Deployment**: Vercel

### Backend

- **Runtime**: Node.js 18 with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: OpenAI API with Model Context Protocol (MCP)
- **Security**: Helmet.js, CORS, rate limiting
- **Logging**: Winston for comprehensive logging
- **Deployment**: Render

### Database Schema

- **Sessions**: Store debugging session metadata and context
- **Segments**: Individual debugging artifacts (code, stack traces, diffs, commits)
- **References**: Cross-references between related debugging artifacts

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- OpenAI API key
- Git repository

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd debugging-helper
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   ```bash
   # Backend (.env)
   DATABASE_URL="postgresql://username:password@localhost:5432/debugging_helper"
   OPENAI_API_KEY="your-openai-api-key"
   FRONTEND_URL="http://localhost:3000"
   NODE_ENV="development"

   # Frontend (.env.local)
   NEXT_PUBLIC_API_URL="http://localhost:3001"
   ```

4. **Set up the database**

   ```bash
   cd backend
   npx prisma generate --schema=../prisma/schema.prisma
   npx prisma migrate dev --schema=../prisma/schema.prisma
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

### Development Commands

```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev

# Build for production
npm run build:frontend
npm run build:backend

# Run tests
npm test

# Run linting
npm run lint --prefix frontend
```

## Usage

### Creating a Debugging Session

1. **Navigate to the application** at `http://localhost:3000`
2. **Select the analysis type**:

   - Code Analysis: Paste code snippets for AI analysis
   - Stack Trace: Submit error stack traces for interpretation
   - Git Diff: Analyze code changes and their impact
   - Commit Message: Evaluate commit message quality

3. **Submit content** for analysis
4. **Review AI insights** and recommendations
5. **Continue the session** by adding more context or artifacts

### Session Management

- **View Current Session**: See all artifacts and analyses in the current debugging session
- **Load Previous Sessions**: Access and continue previous debugging sessions
- **Clear History**: Remove all session data when needed
- **Context Timeline**: Visual overview of debugging progress

### API Endpoints

#### Analysis Endpoints

- `POST /api/debug/analyze` - Submit content for AI analysis
- `GET /api/debug/session/:sessionId` - Retrieve session data

#### History Endpoints

- `GET /api/history/sessions` - List all sessions
- `DELETE /api/history/sessions` - Clear all sessions

#### Health Check

- `GET /api/health` - Service health status

## Deployment

### Frontend (Vercel)

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)

1. Connect repository to Render
2. Configure build and start commands
3. Set environment variables in Render dashboard
4. Deploy automatically on push to main branch

### Database

1. Set up PostgreSQL database (local or cloud)
2. Run migrations: `npx prisma migrate deploy`
3. Verify connection and schema

## Configuration

### Environment Variables

#### Backend

- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication key
- `FRONTEND_URL`: Frontend application URL for CORS
- `NODE_ENV`: Environment (development/production)

#### Frontend

- `NEXT_PUBLIC_API_URL`: Backend API URL

### Database Configuration

- **Provider**: PostgreSQL
- **ORM**: Prisma
- **Migrations**: Automatic via Prisma CLI
- **Connection**: Environment-based configuration

## Development

### Project Structure

```
debugging-helper/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   └── public/             # Static assets
├── backend/                 # Express.js backend application
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── utils/          # Utility functions
│   │   └── services/       # Business logic services
│   └── server.js           # Application entry point
├── prisma/                 # Database schema and migrations
├── shared/                 # Shared types and utilities
└── .github/               # CI/CD workflows and documentation
```

### Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make changes** and add tests
4. **Run tests**: `npm test`
5. **Submit a pull request**

### Code Style

- **Frontend**: ESLint with Next.js configuration
- **Backend**: Standard JavaScript/Node.js practices
- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier configuration

## Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - Verify DATABASE_URL is correct
   - Ensure PostgreSQL is running
   - Check network connectivity

2. **OpenAI API Errors**

   - Verify OPENAI_API_KEY is valid
   - Check API quota and limits
   - Ensure proper API permissions

3. **CORS Errors**

   - Verify FRONTEND_URL is set correctly
   - Check browser console for specific errors
   - Ensure backend CORS configuration matches frontend URL

4. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Verify Node.js version compatibility
   - Check for missing environment variables

### Logs and Debugging

- **Backend logs**: Winston logging to console and files
- **Frontend logs**: Browser developer tools console
- **Database logs**: Prisma query logging in development
- **Deployment logs**: Platform-specific logging (Vercel/Render)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the CI/CD documentation in `.github/README.md`


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
