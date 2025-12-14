# Mini-Instagram

A full-stack Instagram clone application built with Node.js, Express, and React.

## Features

### User Authentication
- User registration with username and password
- Secure login with JWT tokens
- Password hashing with bcrypt

### Social Features
- **Follow/Unfollow**: Follow other users to see their posts in your feed
- **Posts**: Create posts with image URLs and captions
- **Likes**: Like and unlike posts from other users
- **Comments**: Comment on posts and view all comments

### Screens
- **Login**: User authentication
- **Signup**: New user registration
- **Home Feed**: View posts from users you follow (reverse chronological order)
- **Profile Page**: View user's posts, follower/following counts, follow/unfollow buttons
- **Create Post**: Submit new posts with image URLs and captions
- **Post Detail**: View single post with all comments

## Tech Stack

### Backend
- **Node.js** with Express.js
- **JWT** for authentication
- **bcrypt** for password hashing
- **In-memory database** for data persistence (development/prototyping)

### Frontend
- **React** with TypeScript
- **Wouter** for client-side routing
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** for minimal styling

## Data Models

### User
- `id`: Unique identifier
- `username`: User's display name
- `password`: Hashed password

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
- `GET /api/feed` - Get posts from followed users
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post with details

### Likes
- `POST /api/posts/:id/like` - Like a post
- `DELETE /api/posts/:id/like` - Unlike a post

### Comments
- `GET /api/posts/:id/comments` - Get all comments for a post
- `POST /api/posts/:id/comments` - Add comment to a post

### Users
- `GET /api/users/:username` - Get user profile with posts
- `POST /api/users/:username/follow` - Follow a user
- `DELETE /api/users/:username/follow` - Unfollow a user

## Getting Started

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/            # Utilities and API helpers
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application component
│   └── index.html
├── server/                 # Backend Express application
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # In-memory data storage
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Data models and validation
├── README.md               # This file
└── SETUP_GUIDE.md          # Setup instructions
```

## License

MIT
