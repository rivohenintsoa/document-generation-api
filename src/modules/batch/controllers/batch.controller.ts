import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { BatchModel } from '../models/batch.model';

export class BatchController {
  // POST /api/batch
  static async createBatch(req: Request, res: Response) {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'userIds[] is required and cannot be empty' });
    }

    const batchId = uuidv4();

    try {
      const batch = new BatchModel({
        batchId,
        status: 'pending',
        total: userIds.length,
      });

      await batch.save();

      return res.status(201).json({
        batchId: batch.batchId,
        status: batch.status,
        total: batch.total,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create batch' });
    }
  }

  // GET /api/batch/:id
  static async getBatch(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const batch = await BatchModel.findOne({ batchId: id });

      if (!batch) {
        return res.status(404).json({ error: 'Batch not found' });
      }

      return res.json({
        batchId: batch.batchId,
        status: batch.status,
        total: batch.total,
        createdAt: batch.createdAt,
        updatedAt: batch.updatedAt,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch batch' });
    }
  }
}