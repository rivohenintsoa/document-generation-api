import { batchQueue } from "../queues/batch.queue";
import { DocumentModel } from "../../document/models/document.model";
import { BatchModel } from "../models/batch.model";
import { generatePdfBuffer } from "../../document/services/pdf.service";
import { withTimeout } from "../../../utils/timeout";
import { logger } from "../../../utils/logger";
import { jobsCompleted, jobsFailed, jobsTotal } from "../../../utils/metrics";

console.log("Worker started...");

// FAILED
batchQueue.on("failed", async (job, err) => {
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

  // option simple : marquer batch en failed
  await BatchModel.updateOne(
    { batchId: job.data.batchId },
    { status: "failed" }
  );
});

// COMPLETED
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
    // Mettre batch en processing (une seule fois)
    await BatchModel.updateOne(
      { batchId, status: "pending" },
      { status: "processing" }
    );

    const pdfBuffer = await withTimeout(
      (async () => {
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

    // Vérifier si batch terminé
    const totalDocs = await DocumentModel.countDocuments({ batchId });
    const batch = await BatchModel.findOne({ batchId });

    if (batch && totalDocs === batch.total) {
      await BatchModel.updateOne(
        { batchId },
        { status: "completed" }
      );

      log.info("Batch completed");
    }

    jobsCompleted.inc();
    return { success: true };

  } catch (err: any) {
    jobsFailed.inc();
    throw err;
  }
});