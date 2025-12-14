# Mini-Instagram

## Overview

Mini-Instagram is a full-stack social media clone built with Node.js, Express, and React. It provides core Instagram-like functionality including user authentication, posts with images and captions, follow/unfollow relationships, likes, and comments. The application uses JWT-based authentication, an in-memory storage system for development, and follows a functionality-first minimal UI approach.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for lightweight client-side navigation
- **Data Fetching**: TanStack Query for server state management and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (configured via `components.json`)
- **Build Tool**: Vite with React plugin and Replit-specific development plugins

The frontend follows a pages-based structure with protected routes for authenticated users. Authentication state is managed via localStorage (token and user info). The UI intentionally follows a minimal, functionality-first design philosophy - avoiding elaborate styling in favor of demonstrating backend functionality clearly.

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Authentication**: JWT tokens with bcryptjs for password hashing
- **API Design**: RESTful endpoints under `/api/` prefix
- **Storage**: In-memory storage implementation (`MemStorage` class) with interface abstraction (`IStorage`) allowing easy swap to database persistence

The server uses a modular structure:
- `server/routes.ts`: All API route handlers with JWT middleware
- `server/storage.ts`: Data persistence layer with storage interface
- `server/vite.ts`: Development server integration with Vite HMR
- `server/static.ts`: Production static file serving

### Data Models
Defined in `shared/schema.ts` using Zod for validation:
- **User**: id, username, password (hashed)
- **Post**: id, userId, imageUrl, caption, createdAt
- **Follow**: id, followerId, followingId
- **Like**: id, userId, postId
- **Comment**: id, userId, postId, text, createdAt

### Key Design Decisions

1. **Shared Schema**: TypeScript types and Zod validation schemas are defined in `shared/` directory for use by both frontend and backend, ensuring type consistency.

2. **Storage Interface Pattern**: The `IStorage` interface allows the in-memory implementation to be replaced with database storage without changing route handlers.

3. **JWT Authentication**: Stateless token-based auth with middleware pattern for protected routes. Tokens include userId and are verified on each request.

4. **Drizzle ORM Configuration**: The project includes Drizzle configuration (`drizzle.config.ts`) pointing to PostgreSQL, indicating planned database migration support even though current implementation uses in-memory storage.

## External Dependencies

### Database
- **Drizzle ORM**: Configured for PostgreSQL via `DATABASE_URL` environment variable
- **connect-pg-simple**: PostgreSQL session store (available but not actively used with JWT auth)

### Authentication & Security
- **jsonwebtoken**: JWT token creation and verification
- **bcryptjs**: Password hashing

### Frontend Libraries
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component primitives
- **wouter**: Lightweight routing
- **tailwindcss**: Utility-first CSS framework

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required for Drizzle)
- `JWT_SECRET`: Secret key for JWT signing (defaults provided for development)
- `SESSION_SECRET`: Optional session management secret
- `PORT`: Server port (defaults to 5000)