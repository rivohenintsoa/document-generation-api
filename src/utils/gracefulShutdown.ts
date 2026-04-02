import mongoose from "mongoose";
import Redis from "ioredis";
import { batchQueue } from "../modules/batch/queues/batch.queue";

const redisClient = new Redis();

async function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down gracefully...`);

  try {
    // Arrêter la queue proprement : attendre la fin des jobs en cours
    await batchQueue.close();
    console.log("Queue closed successfully");

    // Fermer connexion Mongo
    await mongoose.disconnect();
    console.log("MongoDB disconnected");

    // Fermer connexion Redis
    await redisClient.quit();
    console.log("Redis client disconnected");

    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
}

// Écoute des signaux SIGINT / SIGTERM
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));