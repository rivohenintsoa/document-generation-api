import { Schema, model, Document } from 'mongoose';

export interface IDocument extends Document {
  batchId: string;
  userId: number;
  content: string; // pour l’instant, simulé (string ou buffer)
  status: 'pending' | 'done' | 'failed';
}

const documentSchema = new Schema<IDocument>(
  {
    batchId: { type: String, required: true, index: true },
    userId: { type: Number, required: true },
    content: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' },
  },
  { timestamps: true }
);

export const DocumentModel = model<IDocument>('Document', documentSchema);