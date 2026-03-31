import { Router } from 'express';
import { BatchController } from '../controllers/batch.controller';

const router = Router();

router.post('/batch', BatchController.createBatch);

export default router;