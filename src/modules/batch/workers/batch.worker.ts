import { batchQueue } from "../queues/batch.queue";
import { DocumentModel } from "../../document/models/document.model";
import { generatePdfBuffer } from "../../document/services/pdf.service";
import { withTimeout } from "../../../utils/timeout";
import { logger } from "../../../utils/logger";
import { jobsCompleted, jobsFailed, jobsTotal } from "../../../utils/metrics";

console.log("Worker started...");

batchQueue.on("failed", (job, err) => {
  logger.error(
    {
      jobId: job.id,
      attempts: job.attemptsMade,
      userId: job.data.userId,
      batchId: job.data.batchId,
      error: err.message,
    },
    "Job failed",
  );
});

batchQueue.on("completed", (job) => {
  logger.info(
    {
      jobId: job.id,
      userId: job.data.userId,
      batchId: job.data.batchId,
    },
    "Job completed",
  );
});

batchQueue.process("generate-document", 10, async (job) => {
  const { userId, batchId } = job.data;
  jobsTotal.inc();

  const log = logger.child({ userId, batchId });
  log.info("Processing job");

  try {
    const pdfBuffer = await withTimeout(
      (async () => {
        // Simulation génération document
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return generatePdfBuffer(`Document PDF pour user ${userId}`);
      })(),
      5000,
    );

    const doc = new DocumentModel({
      batchId,
      userId,
      content: pdfBuffer.toString("base64"),
      status: "done",
    });

    await doc.save();

    log.info("Document saved");

    jobsCompleted.inc(); 
    return { success: true };
  } catch (err: any) {
    jobsFailed.inc();
    throw err;
  }
});
