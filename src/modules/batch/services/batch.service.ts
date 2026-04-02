import { batchQueue } from "../queues/batch.queue";

export class BatchService {
  static async enqueueBatch(userIds: number[], batchId: string) {
    const jobs = userIds.map((userId) => ({
      userId,
      batchId,
    }));

    // Ajout en masse
    await batchQueue.addBulk(
      jobs.map((data) => ({
        name: "generate-document",
        data,
        opts: {
          attempts: 3, // max 3 tentatives
          backoff: {
            type: "exponential",
            delay: 1000, // 1 seconde de base
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      })),
    );
  }
}
