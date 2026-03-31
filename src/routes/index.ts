import { Router } from "express";
import { batchController } from "../modules/batch/controllers/batch.controller";
import { documentController } from "../modules/document/controllers/document.controller";

const router = Router();

// health
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// batch
router.post("/api/documents/batch", batchController.create);
router.get("/api/documents/batch/:id", batchController.get);

// document
router.get("/api/documents/:id", documentController.get);

export default router;