# Setup Guide

This guide provides detailed instructions for setting up and running the Mini-Instagram application.

## Prerequisites

- Node.js 18+ installed
- npm (comes with Node.js)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Session Secret (for additional security)
SESSION_SECRET=your-session-secret-key
```

### Environment Variable Descriptions

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Port number for the server |
| `JWT_SECRET` | Recommended | Built-in default | Secret key for JWT token signing. **Must be changed in production!** |
| `SESSION_SECRET` | Recommended | - | Secret for session management |

### Example .env File

```env
PORT=5000
JWT_SECRET=mini-instagram-jwt-secret-2024-change-me
SESSION_SECRET=session-secret-key-2024
```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mini-instagram
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies for both the frontend and backend.

### 3. Set Up Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

Or create a new `.env` file with the variables listed above.

## Running the Application

### Development Mode

Start both the frontend and backend in development mode:

```bash
npm run dev
```

This command:
- Starts the Express backend server
- Starts the Vite development server for React
- Enables hot-reloading for both frontend and backend

The application will be available at: `http://localhost:5000`

### What Happens on Startup

1. The Express server starts and registers all API routes
2. The Vite development server starts and serves the React frontend
3. Both servers are proxied through the same port (5000)

## Using the Application

### 1. Create an Account

1. Navigate to `http://localhost:5000`
2. You'll be redirected to the login page
3. Click "Sign up" to create a new account
4. Enter a username (minimum 3 characters) and password (minimum 6 characters)

### 2. Create Posts

1. After logging in, click "New Post" in the navigation
2. Enter an image URL (must be a valid URL to an image)
3. Add an optional caption
4. Click "Create Post"

### 3. Follow Users

1. Visit another user's profile by clicking their username
2. Click the "Follow" button
3. Their posts will now appear in your feed

### 4. Interact with Posts

- **Like**: Click "Like" on any post
- **Comment**: Navigate to a post detail page and add comments
- **View Profile**: Click on usernames to view user profiles

## API Testing

You can test the API endpoints using curl or any API client:

### Register a User

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

### Create a Post (requires authentication)

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"imageUrl": "https://picsum.photos/400/300", "caption": "My first post!"}'
```

## Troubleshooting

### Port Already in Use

If port 5000 is already in use:

1. Change the `PORT` in your `.env` file
2. Restart the application

### JWT Errors

If you see JWT-related errors:

1. Ensure `JWT_SECRET` is set in your `.env` file
2. Clear your browser's localStorage
3. Log in again

### CORS Issues

The application is configured to handle CORS automatically through the Vite proxy. If you experience CORS issues:

1. Ensure you're accessing the app through `http://localhost:5000`
2. Don't try to access the Vite dev server directly

## Production Deployment

For production deployment:

1. **Change all secret keys** in environment variables
2. Use a proper database (PostgreSQL recommended) instead of in-memory storage
3. Set up HTTPS
4. Configure proper CORS settings
5. Use environment-specific configurations

### Build for Production

```bash
npm run build
```

This creates optimized production builds for both frontend and backend.

## Data Persistence Note

This application uses in-memory storage for simplicity. This means:

- All data is lost when the server restarts
- Not suitable for production use
- Great for development and testing

For production, implement a proper database solution (PostgreSQL, MongoDB, etc.).
