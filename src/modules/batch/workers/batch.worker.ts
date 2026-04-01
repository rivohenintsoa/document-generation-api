import { batchQueue } from "../queues/batch.queue";
import { DocumentModel } from "../../document/models/document.model";
import { generatePdfBuffer } from "../../document/services/pdf.service";

console.log("Worker started...");

batchQueue.process("generate-document", async (job) => {
  const { userId, batchId } = job.data;

  console.log(`Processing user ${userId} for batch ${batchId}`);

  // Simulation génération document
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const pdfBuffer = await generatePdfBuffer(
    `Document PDF simulé pour user ${userId}`,
  );

  // Stocker le “document” en DB
  const doc = new DocumentModel({
    batchId,
    userId,
    content: pdfBuffer.toString('base64'),
    status: "done",
  });
  await doc.save();

  console.log(`Document saved for user ${userId}`);

  return { success: true };
});
