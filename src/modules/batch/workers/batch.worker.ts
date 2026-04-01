import { batchQueue } from "../queues/batch.queue";
import { DocumentModel } from "../../document/models/document.model";
import { generatePdfBuffer } from "../../document/services/pdf.service";
import { withTimeout } from "../../../utils/timeout";

console.log("Worker started...");

batchQueue.on("failed", (job, err) => {
  console.log(
    `Job ${job.id} failed (attempt ${job.attemptsMade}): ${err.message}`,
  );
});

batchQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

batchQueue.process("generate-document", 10, async (job) => {
  const { userId, batchId } = job.data;

  console.log(`Processing user ${userId} for batch ${batchId}`);

  const pdfBuffer = await withTimeout(
    (async () => {
      // Simulation génération document
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulation blocage
      if (userId === 3) {
        await new Promise((resolve) => setTimeout(resolve, 6000));
      }

      return generatePdfBuffer(`Document PDF pour user ${userId}`);
    })(),
    5000
  );

  const doc = new DocumentModel({
    batchId,
    userId,
    content: pdfBuffer.toString("base64"),
    status: "done",
  });

  await doc.save();

  console.log(`Document saved for user ${userId}`);

  return { success: true };
});