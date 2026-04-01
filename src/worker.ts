import { connectMongo } from './config/mongo';
import './modules/batch/workers/batch.worker';

(async () => {
  await connectMongo();
})();