import express from 'express';
import batchRoutes from '../modules/batch/routes/batch.routes';
import documentRoutes from '../modules/document/routes/document.routes';
import healthRoutes from "../modules/core/routes/health.routes";

const app = express();
app.use(express.json());

// Routes
app.use('/api/documents', batchRoutes);
app.use('/api/documents', documentRoutes);
app.use("/", healthRoutes);

export default app;