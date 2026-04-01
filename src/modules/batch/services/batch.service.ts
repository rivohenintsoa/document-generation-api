import { batchQueue } from '../queues/batch.queue';

export class BatchService {
  static async enqueueBatch(userIds: number[], batchId: string) {
    const jobs = userIds.map((userId) => ({
      userId,
      batchId,
    }));

    // Ajout en masse
    await batchQueue.addBulk(
      jobs.map((data) => ({
        name: 'generate-document',
        data,
      }))
    );
  }
}