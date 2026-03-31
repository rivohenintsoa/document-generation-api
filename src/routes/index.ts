import express from 'express';
import batchRoutes from '../modules/batch/routes/batch.routes';

const app = express();
app.use(express.json());

// Routes
app.use('/api', batchRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

export default app;