import { Request, Response } from "express";
import mongoose from "mongoose";
import Redis from "ioredis";
import { batchQueue } from "../../batch/queues/batch.queue";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
});

export class HealthController {
  static async check(req: Request, res: Response) {
    const status: Record<string, string> = { status: "ok" };

    // MongoDB
    try {
      const mongoState = mongoose.connection.readyState;
      status.mongo = mongoState === 1 ? "up" : "down";
      if (mongoState !== 1) status.status = "error";
    } catch {
      status.mongo = "down";
      status.status = "error";
    }

    // Redis
    try {
      const pong = await redisClient.ping();
      status.redis = pong === "PONG" ? "up" : "down";
      if (pong !== "PONG") status.status = "error";
    } catch {
      status.redis = "down";
      status.status = "error";
    }

    // Queue
    try {
      const jobCounts = await batchQueue.getJobCounts();
      status.queue = jobCounts ? "up" : "down";
      if (!jobCounts) status.status = "error";
    } catch {
      status.queue = "down";
      status.status = "error";
    }

    return res.json(status);
  }
}