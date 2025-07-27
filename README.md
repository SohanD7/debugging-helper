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
