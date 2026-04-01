import { batchQueue } from '../queues/batch.queue';

console.log('Worker started...');

batchQueue.process('generate-document', async (job) => {
  const { userId, batchId } = job.data;

  console.log(`Processing user ${userId} for batch ${batchId}`);

  // Simulation génération document
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`Document generated for user ${userId}`);

  return { success: true };
});