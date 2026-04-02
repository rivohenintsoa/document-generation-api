import express from "express";
import routes from "./routes";
import { connectMongo } from "./config/mongo";
import { batchQueue } from './modules/batch/queues/batch.queue';
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

connectMongo();

(async () => {
  try {
    await batchQueue.isReady();
    console.log('Bull queue connected to Redis');
  } catch (err) {
    console.error('Bull queue error', err);
  }
})();


app.use(express.json());
app.use(routes);

app.use(errorHandler);

export default app;