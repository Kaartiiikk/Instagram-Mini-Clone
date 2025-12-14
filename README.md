# InstaClone

A full-stack Instagram clone application built with Node.js, Express, and React.

## Features

### User Authentication
- User registration with username, password, and optional avatar URL
- Secure login with JWT tokens
- Password hashing with bcrypt

### Social Features
- **Follow/Unfollow**: Follow other users to see their posts in your feed
- **Posts**: Create posts with image URLs and captions
- **Likes**: Like and unlike posts from other users
- **Comments**: Comment on posts and view all comments
- **Search**: Search for other users to follow
- **Profile Pictures**: Users have profile avatars displayed throughout the app

### Screens
- **Login**: User authentication
- **Signup**: New user registration
- **Home Feed**: View posts from users you follow and your own posts
- **Profile Page**: View user's profile info, avatar, posts, follower/following counts
- **Create Post**: Submit new posts with image URLs and captions
- **Post Detail**: View single post with all comments
- **Search Page**: Discover and follow other users

## Tech Stack

### Backend
- **Node.js** with Express.js
- **JWT** for authentication
- **bcrypt** for password hashing
- **In-memory database** for data persistence (development/prototyping)
- **Extensive Seed Data**: Pre-populated with realistic users and interactions

### Frontend
- **React** with TypeScript
- **Wouter** for client-side routing
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** for minimal styling
- **Lucide React** for icons
- **Shadcn/UI** components (Avatar, etc.)

## Data Models

### User
- `id`: Unique identifier
- `username`: User's display name
- `password`: Hashed password
- `avatarUrl`: Optional URL to user's profile picture

### Post
- `id`: Unique identifier
- `userId`: Author's user ID
- `imageUrl`: URL to the post image
- `caption`: Post caption text
- `createdAt`: Timestamp

### Follow
- `id`: Unique identifier
- `followerId`: User who is following
- `followingId`: User being followed

### Like
- `id`: Unique identifier
- `userId`: User who liked
- `postId`: Post that was liked

### Comment
- `id`: Unique identifier
- `userId`: Comment author
- `postId`: Post being commented on
- `text`: Comment content
- `createdAt`: Timestamp

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/feed` - Get posts from followed users and self
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post with details

### Likes
- `POST /api/posts/:id/like` - Like a post
- `DELETE /api/posts/:id/like` - Unlike a post

### Comments
- `GET /api/posts/:id/comments` - Get all comments for a post
- `POST /api/posts/:id/comments` - Add comment to a post

### Users & Search
- `GET /api/users/:username` - Get user profile with posts
- `POST /api/users/:username/follow` - Follow a user
- `DELETE /api/users/:username/follow` - Unfollow a user
- `GET /api/search?q=query` - Search users by username

### Development
- `POST /api/seed` - Trigger database seeding manualy

## Getting Started

1.  **Install Dependencies**: `npm install`
2.  **Start Dev Server**: `npm run dev` (Frontend + Backend on Windows supported)
3.  **Seed Data**: The database is automatically seeded on startup.

### Test Accounts
You can use these pre-created accounts to log in:
*   **Username**: `john_doe`
    *   **Password**: `password`
*   **Username**: `jane_smith`
    *   **Password**: `password`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components (NavBar, PostCard)
│   │   ├── lib/            # Utilities and API helpers
│   │   ├── pages/          # Page components (Feed, Profile, Search)
│   │   └── App.tsx         # Main application component
│   └── index.html
├── server/                 # Backend Express application
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # In-memory data storage (Map-based)
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Data models and validation
├── script/                 # Helper scripts
│   └── seed.ts             # Data seeding logic
├── README.md               # This file
```