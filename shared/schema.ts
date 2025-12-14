import { z } from "zod";

// User schema
export interface User {
  id: string;
  username: string;
  password: string;
}

export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Post schema
export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
}

export const insertPostSchema = z.object({
  imageUrl: z.string().url("Must be a valid URL"),
  caption: z.string().max(500, "Caption must be 500 characters or less"),
});

export type InsertPost = z.infer<typeof insertPostSchema>;

// Follow schema
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
}

// Like schema
export interface Like {
  id: string;
  userId: string;
  postId: string;
}

// Comment schema
export interface Comment {
  id: string;
  userId: string;
  postId: string;
  text: string;
  createdAt: string;
}

export const insertCommentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty").max(300, "Comment must be 300 characters or less"),
});

export type InsertComment = z.infer<typeof insertCommentSchema>;

// API response types
export interface PostWithDetails extends Post {
  username: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  posts: PostWithDetails[];
}

export interface CommentWithUser extends Comment {
  username: string;
}

export interface AuthResponse {
  token: string;
  user: { id: string; username: string };
}
