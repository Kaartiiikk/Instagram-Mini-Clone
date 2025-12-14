import { 
  type User, type InsertUser, 
  type Post, type InsertPost,
  type Follow, type Like, type Comment, type InsertComment,
  type PostWithDetails, type UserProfile, type CommentWithUser
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser & { password: string }): Promise<User>;
  
  // Post operations
  createPost(userId: string, post: InsertPost): Promise<Post>;
  getPost(id: string): Promise<Post | undefined>;
  getPostWithDetails(id: string, currentUserId: string): Promise<PostWithDetails | undefined>;
  getPostsByUser(userId: string, currentUserId: string): Promise<PostWithDetails[]>;
  getFeed(userId: string): Promise<PostWithDetails[]>;
  
  // Follow operations
  follow(followerId: string, followingId: string): Promise<void>;
  unfollow(followerId: string, followingId: string): Promise<void>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getFollowerCount(userId: string): Promise<number>;
  getFollowingCount(userId: string): Promise<number>;
  getFollowing(userId: string): Promise<string[]>;
  
  // Like operations
  likePost(userId: string, postId: string): Promise<void>;
  unlikePost(userId: string, postId: string): Promise<void>;
  isLiked(userId: string, postId: string): Promise<boolean>;
  getLikeCount(postId: string): Promise<number>;
  
  // Comment operations
  createComment(userId: string, postId: string, comment: InsertComment): Promise<Comment>;
  getComments(postId: string): Promise<CommentWithUser[]>;
  getCommentCount(postId: string): Promise<number>;
  
  // Profile
  getUserProfile(username: string, currentUserId: string): Promise<UserProfile | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, Post>;
  private follows: Map<string, Follow>;
  private likes: Map<string, Like>;
  private comments: Map<string, Comment>;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.follows = new Map();
    this.likes = new Map();
    this.comments = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser & { password: string }): Promise<User> {
    const id = randomUUID();
    const user: User = { id, username: insertUser.username, password: insertUser.password };
    this.users.set(id, user);
    return user;
  }

  // Post operations
  async createPost(userId: string, insertPost: InsertPost): Promise<Post> {
    const id = randomUUID();
    const post: Post = {
      id,
      userId,
      imageUrl: insertPost.imageUrl,
      caption: insertPost.caption,
      createdAt: new Date().toISOString(),
    };
    this.posts.set(id, post);
    return post;
  }

  async getPost(id: string): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostWithDetails(id: string, currentUserId: string): Promise<PostWithDetails | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;

    const user = await this.getUser(post.userId);
    if (!user) return undefined;

    return {
      ...post,
      username: user.username,
      likeCount: await this.getLikeCount(id),
      commentCount: await this.getCommentCount(id),
      isLiked: await this.isLiked(currentUserId, id),
    };
  }

  async getPostsByUser(userId: string, currentUserId: string): Promise<PostWithDetails[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    const posts = Array.from(this.posts.values())
      .filter((post) => post.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const result: PostWithDetails[] = [];
    for (const post of posts) {
      result.push({
        ...post,
        username: user.username,
        likeCount: await this.getLikeCount(post.id),
        commentCount: await this.getCommentCount(post.id),
        isLiked: await this.isLiked(currentUserId, post.id),
      });
    }
    return result;
  }

  async getFeed(userId: string): Promise<PostWithDetails[]> {
    const following = await this.getFollowing(userId);
    
    const posts = Array.from(this.posts.values())
      .filter((post) => following.includes(post.userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const result: PostWithDetails[] = [];
    for (const post of posts) {
      const user = await this.getUser(post.userId);
      if (user) {
        result.push({
          ...post,
          username: user.username,
          likeCount: await this.getLikeCount(post.id),
          commentCount: await this.getCommentCount(post.id),
          isLiked: await this.isLiked(userId, post.id),
        });
      }
    }
    return result;
  }

  // Follow operations
  async follow(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) return;
    const key = `${followerId}-${followingId}`;
    if (!this.follows.has(key)) {
      this.follows.set(key, {
        id: randomUUID(),
        followerId,
        followingId,
      });
    }
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const key = `${followerId}-${followingId}`;
    this.follows.delete(key);
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const key = `${followerId}-${followingId}`;
    return this.follows.has(key);
  }

  async getFollowerCount(userId: string): Promise<number> {
    return Array.from(this.follows.values()).filter((f) => f.followingId === userId).length;
  }

  async getFollowingCount(userId: string): Promise<number> {
    return Array.from(this.follows.values()).filter((f) => f.followerId === userId).length;
  }

  async getFollowing(userId: string): Promise<string[]> {
    return Array.from(this.follows.values())
      .filter((f) => f.followerId === userId)
      .map((f) => f.followingId);
  }

  // Like operations
  async likePost(userId: string, postId: string): Promise<void> {
    const key = `${userId}-${postId}`;
    if (!this.likes.has(key)) {
      this.likes.set(key, {
        id: randomUUID(),
        userId,
        postId,
      });
    }
  }

  async unlikePost(userId: string, postId: string): Promise<void> {
    const key = `${userId}-${postId}`;
    this.likes.delete(key);
  }

  async isLiked(userId: string, postId: string): Promise<boolean> {
    const key = `${userId}-${postId}`;
    return this.likes.has(key);
  }

  async getLikeCount(postId: string): Promise<number> {
    return Array.from(this.likes.values()).filter((l) => l.postId === postId).length;
  }

  // Comment operations
  async createComment(userId: string, postId: string, insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      id,
      userId,
      postId,
      text: insertComment.text,
      createdAt: new Date().toISOString(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  async getComments(postId: string): Promise<CommentWithUser[]> {
    const comments = Array.from(this.comments.values())
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const result: CommentWithUser[] = [];
    for (const comment of comments) {
      const user = await this.getUser(comment.userId);
      if (user) {
        result.push({
          ...comment,
          username: user.username,
        });
      }
    }
    return result;
  }

  async getCommentCount(postId: string): Promise<number> {
    return Array.from(this.comments.values()).filter((c) => c.postId === postId).length;
  }

  // Profile
  async getUserProfile(username: string, currentUserId: string): Promise<UserProfile | undefined> {
    const user = await this.getUserByUsername(username);
    if (!user) return undefined;

    const posts = await this.getPostsByUser(user.id, currentUserId);
    
    return {
      id: user.id,
      username: user.username,
      postCount: posts.length,
      followerCount: await this.getFollowerCount(user.id),
      followingCount: await this.getFollowingCount(user.id),
      isFollowing: await this.isFollowing(currentUserId, user.id),
      posts,
    };
  }
}

export const storage = new MemStorage();
