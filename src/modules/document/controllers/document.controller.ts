import { Request, Response } from "express";

export const documentController = {
  async get(req: Request, res: Response) {
    res.json({ message: "document endpoint" });
  },
};