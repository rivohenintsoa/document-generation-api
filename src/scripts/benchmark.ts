import fetch from "node-fetch";
import dotenv from "dotenv";
import { logger } from "../utils/logger";

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

interface BatchStatus {
  batchId: string;
  status: "pending" | "processing" | "completed" | "failed";
  total: number;
  documents?: Array<{ id: string; userId: number; status: string }>;
}

async function benchmark() {
  const NUM_USERS = 1000;
  const userIds = Array.from({ length: NUM_USERS }, (_, i) => i + 1);

  logger.info(`Starting benchmark: sending ${NUM_USERS} users...`);
  const start = Date.now();

  try {
    // Appel API batch
    const res = await fetch(`${API_BASE_URL}/api/documents/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds }),
    });

    if (!res.ok) {
      const text = await res.text();
      logger.error({ text }, "Error creating batch");
      return;
    }

    const data = (await res.json()) as BatchStatus;
    const batchId = data.batchId;

    // Polling pour vérifier la fin du batch
    let completed = false;
    while (!completed) {
      const statusRes = await fetch(`${API_BASE_URL}/api/documents/batch/${batchId}`);
      const statusData = (await statusRes.json()) as BatchStatus;

      if (statusData.status === "completed") {
        completed = true;
      } else {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    const duration = (Date.now() - start) / 1000;
    logger.info(
      {
        duration,
        docsPerSec: (NUM_USERS / duration).toFixed(0),
        totalDocs: NUM_USERS,
      },
      `Benchmark completed`
    );
  } catch (err) {
    logger.error({ err }, "Benchmark failed");
  }
}

benchmark();