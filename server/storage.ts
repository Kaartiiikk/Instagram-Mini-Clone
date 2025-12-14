import {
  type User, type InsertUser,
  type Post, type InsertPost,
  type Follow, type Like, type Comment, type InsertComment,
  type PostWithDetails, type UserProfile, type CommentWithUser
} from "@shared/schema";
import { randomUUID } from "crypto";

// Simple in-memory storage maps
const users = new Map<string, User>();
const posts = new Map<string, Post>();
const follows = new Map<string, Follow>();
const likes = new Map<string, Like>();
const comments = new Map<string, Comment>();

// Helper functions
async function getUser(id: string): Promise<User | undefined> {
  return users.get(id);
}

async function getUserByUsername(username: string): Promise<User | undefined> {
  return Array.from(users.values()).find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
}

async function createUser(insertUser: InsertUser & { password: string }): Promise<User> {
  const id = randomUUID();
  const user: User = {
    id,
    username: insertUser.username,
    password: insertUser.password,
    avatarUrl: insertUser.avatarUrl
  };
  users.set(id, user);
  return user;
}

async function createPost(userId: string, insertPost: InsertPost): Promise<Post> {
  const id = randomUUID();
  const post: Post = {
    id,
    userId,
    imageUrl: insertPost.imageUrl,
    caption: insertPost.caption,
    createdAt: new Date().toISOString(),
  };
  posts.set(id, post);
  return post;
}

async function getPost(id: string): Promise<Post | undefined> {
  return posts.get(id);
}

async function getLikeCount(postId: string): Promise<number> {
  return Array.from(likes.values()).filter((l) => l.postId === postId).length;
}

async function getCommentCount(postId: string): Promise<number> {
  return Array.from(comments.values()).filter((c) => c.postId === postId).length;
}

async function isLiked(userId: string, postId: string): Promise<boolean> {
  const key = `${userId}-${postId}`;
  return likes.has(key);
}

async function getPostWithDetails(id: string, currentUserId: string): Promise<PostWithDetails | undefined> {
  const post = posts.get(id);
  if (!post) return undefined;

  const user = await getUser(post.userId);
  if (!user) return undefined;

  return {
    ...post,
    username: user.username,
    avatarUrl: user.avatarUrl,
    likeCount: await getLikeCount(id),
    commentCount: await getCommentCount(id),
    isLiked: await isLiked(currentUserId, id),
  };
}

async function getPostsByUser(userId: string, currentUserId: string): Promise<PostWithDetails[]> {
  const user = await getUser(userId);
  if (!user) return [];

  const userPosts = Array.from(posts.values())
    .filter((post) => post.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const result: PostWithDetails[] = [];
  for (const post of userPosts) {
    result.push({
      ...post,
      username: user.username,
      avatarUrl: user.avatarUrl,
      likeCount: await getLikeCount(post.id),
      commentCount: await getCommentCount(post.id),
      isLiked: await isLiked(currentUserId, post.id),
    });
  }
  return result;
}

async function getFollowing(userId: string): Promise<string[]> {
  return Array.from(follows.values())
    .filter((f) => f.followerId === userId)
    .map((f) => f.followingId);
}

async function getFeed(userId: string): Promise<PostWithDetails[]> {
  const following = await getFollowing(userId);

  // Include posts from users you follow AND your own posts
  const feedPosts = Array.from(posts.values())
    .filter((post) => following.includes(post.userId) || post.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const result: PostWithDetails[] = [];
  for (const post of feedPosts) {
    const user = await getUser(post.userId);
    if (user) {
      result.push({
        ...post,
        username: user.username,
        avatarUrl: user.avatarUrl,
        likeCount: await getLikeCount(post.id),
        commentCount: await getCommentCount(post.id),
        isLiked: await isLiked(userId, post.id),
      });
    }
  }
  return result;
}

async function follow(followerId: string, followingId: string): Promise<void> {
  if (followerId === followingId) return;
  const key = `${followerId}-${followingId}`;
  if (!follows.has(key)) {
    follows.set(key, {
      id: randomUUID(),
      followerId,
      followingId,
    });
  }
}

async function unfollow(followerId: string, followingId: string): Promise<void> {
  const key = `${followerId}-${followingId}`;
  follows.delete(key);
}

async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const key = `${followerId}-${followingId}`;
  return follows.has(key);
}

async function getFollowerCount(userId: string): Promise<number> {
  return Array.from(follows.values()).filter((f) => f.followingId === userId).length;
}

async function getFollowingCount(userId: string): Promise<number> {
  return Array.from(follows.values()).filter((f) => f.followerId === userId).length;
}

async function likePost(userId: string, postId: string): Promise<void> {
  const key = `${userId}-${postId}`;
  if (!likes.has(key)) {
    likes.set(key, {
      id: randomUUID(),
      userId,
      postId,
    });
  }
}

async function unlikePost(userId: string, postId: string): Promise<void> {
  const key = `${userId}-${postId}`;
  likes.delete(key);
}

async function createComment(userId: string, postId: string, insertComment: InsertComment): Promise<Comment> {
  const id = randomUUID();
  const comment: Comment = {
    id,
    userId,
    postId,
    text: insertComment.text,
    createdAt: new Date().toISOString(),
  };
  comments.set(id, comment);
  return comment;
}

async function getComments(postId: string): Promise<CommentWithUser[]> {
  const postComments = Array.from(comments.values())
    .filter((c) => c.postId === postId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const result: CommentWithUser[] = [];
  for (const comment of postComments) {
    const user = await getUser(comment.userId);
    if (user) {
      result.push({
        ...comment,
        username: user.username,
        avatarUrl: user.avatarUrl,
      });
    }
  }
  return result;
}

async function getUserProfile(username: string, currentUserId: string): Promise<UserProfile | undefined> {
  const user = await getUserByUsername(username);
  if (!user) return undefined;

  const posts = await getPostsByUser(user.id, currentUserId);

  return {
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl,
    postCount: posts.length,
    followerCount: await getFollowerCount(user.id),
    followingCount: await getFollowingCount(user.id),
    isFollowing: await isFollowing(currentUserId, user.id),
    posts,
  };
}

async function searchUsers(query: string): Promise<{ id: string; username: string; postCount: number; followerCount: number }[]> {
  const foundUsers = Array.from(users.values())
    .filter((user) => user.username.toLowerCase().includes(query.toLowerCase()));

  const results = [];
  for (const user of foundUsers) {
    const postCount = Array.from(posts.values()).filter((p) => p.userId === user.id).length;
    const followerCount = await getFollowerCount(user.id);
    results.push({
      id: user.id,
      username: user.username,
      postCount,
      followerCount,
    });
  }
  return results;
}

// Export a single object to maintain compatibility with consumers
export const storage = {
  getUser,
  getUserByUsername,
  createUser,
  createPost,
  getPost,
  getPostWithDetails,
  getPostsByUser,
  getFeed,
  follow,
  unfollow,
  isFollowing,
  getFollowerCount,
  getFollowingCount,
  getFollowing,
  likePost,
  unlikePost,
  isLiked,
  getLikeCount,
  createComment,
  getComments,
  getCommentCount,
  getUserProfile,
  searchUsers
};
