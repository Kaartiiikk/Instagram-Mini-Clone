import type { Express, Request, Response, NextFunction } from "express";
import { seed } from "../script/seed";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { insertUserSchema, insertPostSchema, insertCommentSchema } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "mini-instagram-secret-key-change-in-production";

interface AuthRequest extends Request {
  userId?: string;
}

// Authentication middleware
function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Seed route (dev only ideally, but keeping open for demo)
  app.post("/api/seed", async (req: Request, res: Response) => {
    try {
      await seed();
      res.json({ message: "Seeding complete" });
    } catch (error) {
      res.status(500).json({ message: "Seeding failed" });
    }
  });

  // Auth routes
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const parseResult = insertUserSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: parseResult.error.errors[0].message });
      }

      const { username, password } = parseResult.data;

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ username, password: hashedPassword });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.json({
        token,
        user: { id: user.id, username: user.username, avatarUrl: user.avatarUrl },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      console.log(`Login attempt for: ${username}`);

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        console.log(`User not found: ${username}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }
      console.log(`User found: ${user.username}, storing hash starting with: ${user.password.substring(0, 10)}...`);

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log(`Password mismatch for user: ${username}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }
      console.log(`Login successful for: ${username}`);

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.json({
        token,
        user: { id: user.id, username: user.username, avatarUrl: user.avatarUrl },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Feed route
  app.get("/api/feed", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const posts = await storage.getFeed(req.userId!);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Post routes
  app.post("/api/posts", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const parseResult = insertPostSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: parseResult.error.errors[0].message });
      }

      const post = await storage.createPost(req.userId!, parseResult.data);
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/posts/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const post = await storage.getPostWithDetails(req.params.id, req.userId!);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Like routes
  app.post("/api/posts/:id/like", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      await storage.likePost(req.userId!, req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/posts/:id/like", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      await storage.unlikePost(req.userId!, req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Comment routes
  app.get("/api/posts/:id/comments", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const comments = await storage.getComments(req.params.id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/posts/:id/comments", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const parseResult = insertCommentSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: parseResult.error.errors[0].message });
      }

      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = await storage.createComment(req.userId!, req.params.id, parseResult.data);
      const user = await storage.getUser(req.userId!);

      res.json({
        ...comment,
        username: user?.username,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // User/Profile routes
  app.get("/api/users/:username", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const profile = await storage.getUserProfile(req.params.username, req.userId!);
      if (!profile) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Search route
  app.get("/api/search", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length === 0) {
        return res.json([]);
      }
      const results = await storage.searchUsers(query.trim());
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Follow routes
  app.post("/api/users/:username/follow", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const targetUser = await storage.getUserByUsername(req.params.username);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      if (targetUser.id === req.userId) {
        return res.status(400).json({ message: "Cannot follow yourself" });
      }

      await storage.follow(req.userId!, targetUser.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/users/:username/follow", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const targetUser = await storage.getUserByUsername(req.params.username);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      await storage.unfollow(req.userId!, targetUser.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  return httpServer;
}
