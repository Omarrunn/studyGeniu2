import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { userProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all topics
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await storage.getTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  });

  // Get specific topic
  app.get("/api/topics/:label", async (req, res) => {
    try {
      const topic = await storage.getTopicByLabel(decodeURIComponent(req.params.label));
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }
      res.json(topic);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topic" });
    }
  });

  // Get surgery secrets
  app.get("/api/secrets", async (req, res) => {
    try {
      const secrets = await storage.getSurgerySecrets();
      res.json(secrets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch surgery secrets" });
    }
  });

  // Search questions
  app.get("/api/search/questions", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      const results = await storage.searchQuestions(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to search questions" });
    }
  });

  // Search secrets
  app.get("/api/search/secrets", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      const results = await storage.searchSecrets(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to search secrets" });
    }
  });

  // Get user progress
  app.get("/api/progress/:topicLabel", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(decodeURIComponent(req.params.topicLabel));
      res.json(progress || { topicLabel: req.params.topicLabel, completedQuestions: [], correctAnswers: [] });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // Update user progress
  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = userProgressSchema.parse(req.body);
      const updatedProgress = await storage.updateUserProgress(progressData);
      res.json(updatedProgress);
    } catch (error) {
      res.status(400).json({ error: "Invalid progress data" });
    }
  });

  // Reset all progress
  app.delete("/api/progress", async (req, res) => {
    try {
      await storage.resetAllProgress();
      res.json({ message: "All progress has been reset" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reset progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
