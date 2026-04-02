import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { BatchModel } from "../models/batch.model";
import { BatchService } from "../services/batch.service";
import { DocumentModel } from "../../document/models/document.model";

export class BatchController {
  // POST /api/documents/batch
  static async createBatch(req: Request, res: Response, next: NextFunction) {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      const error: any = new Error("userIds[] is required and cannot be empty");
      error.statusCode = 400;
      return next(error);
    }

    const batchId = uuidv4();

    try {
      // 1. Sauvegarde en DB
      const batch = new BatchModel({
        batchId,
        status: "pending",
        total: userIds.length,
      });

      await batch.save();

      // 2. Envoi des jobs dans la queue
      await BatchService.enqueueBatch(userIds, batchId);

      return res.status(201).json({
        batchId: batch.batchId,
        status: batch.status,
        total: batch.total,
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/documents/batch/:id
  static async getBatch(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const batch = await BatchModel.findOne({ batchId: id });

      if (!batch) {
        const error: any = new Error("Batch not found");
        error.statusCode = 404;
        return next(error);
      }

      const documents = await DocumentModel.find({ batchId: id });

      return res.json({
        batchId: batch.batchId,
        status: batch.status,
        total: batch.total,
        createdAt: batch.createdAt,
        updatedAt: batch.updatedAt,

        documents: documents.map((doc) => ({
          id: doc._id,
          userId: doc.userId,
          status: doc.status,
        })),
      });
    } catch (err) {
      next(err);
    }
  }
}
