import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export class BatchController {
  // POST /api/batch
  static createBatch(req: Request, res: Response) {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'userIds[] is required and cannot be empty' });
    }

    // Générer un batchId fictif
    const batchId = uuidv4();

    // On renvoie le batchId (mock)
    return res.status(201).json({
      batchId,
      status: 'pending',
      total: userIds.length,
    });
  }
}