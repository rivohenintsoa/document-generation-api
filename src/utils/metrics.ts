import client from "prom-client";

// Compteurs
export const documentsGenerated = new client.Counter({
  name: "documents_generated_total",
  help: "Total number of documents generated",
});

export const jobsFailed = new client.Counter({
  name: "jobs_failed",
  help: "Total number of failed jobs",
});

export const jobsCompleted = new client.Counter({
  name: "jobs_completed",
  help: "Total number of completed jobs",
});

// Histogramme pour batch duration
export const batchProcessingDuration = new client.Histogram({
  name: "batch_processing_duration_seconds",
  help: "Batch processing duration in seconds",
  buckets: [1, 2, 5, 10, 30, 60, 120], // adaptable
});

// Gauge pour queue size
export const queueSize = new client.Gauge({
  name: "queue_size",
  help: "Number of jobs currently in the queue",
});

export const register = client.register;