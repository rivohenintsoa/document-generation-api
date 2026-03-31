import { Schema, model, Document } from 'mongoose';

export interface IBatch extends Document {
  batchId: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
  total: number;
}

const batchSchema = new Schema<IBatch>(
  {
    batchId: { type: String, required: true, unique: true },
    status: { type: String, required: true, default: 'pending' },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export const BatchModel = model<IBatch>('Batch', batchSchema);