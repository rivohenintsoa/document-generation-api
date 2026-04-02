import client from "prom-client";

export const register = new client.Registry();

// métriques par défaut (CPU, mémoire, etc.)
client.collectDefaultMetrics({ register });

// compteur de jobs
export const jobsTotal = new client.Counter({
  name: "jobs_total",
  help: "Total number of jobs processed",
});

// erreurs
export const jobsFailed = new client.Counter({
  name: "jobs_failed",
  help: "Total number of failed jobs",
});

// succès
export const jobsCompleted = new client.Counter({
  name: "jobs_completed",
  help: "Total number of completed jobs",
});

register.registerMetric(jobsTotal);
register.registerMetric(jobsFailed);
register.registerMetric(jobsCompleted);