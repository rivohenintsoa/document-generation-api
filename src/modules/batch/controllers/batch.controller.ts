import { Request, Response } from "express";
import { batchService } from "../services/batch.service";

export const batchController = {
  async create(req: Request, res: Response) {
    const result = await batchService.create();
    res.json(result);
  },

  async get(req: Request, res: Response) {
    const { id } = req.params;
    const result = await batchService.getById(id);
    res.json(result);
  },
};