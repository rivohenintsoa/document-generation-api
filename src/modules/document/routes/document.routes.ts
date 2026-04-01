import { Router, Request, Response } from "express";
import { DocumentModel } from "../models/document.model";

const router = Router();

/**
 * GET /document/:id
 * Récupérer un document PDF par ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await DocumentModel.findById(id);

    if (!doc) {
      return res.status(404).json({ message: "Document non trouvé" });
    }

    // le content est stocké en Base64
    const buffer = Buffer.from(doc.content, "base64");

    // headers pour téléchargement PDF
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="document_${doc.userId}.pdf"`,
      "Content-Length": buffer.length,
    });

    return res.send(buffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
