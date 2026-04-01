import express from "express";
import routes from "./routes";
import { connectMongo } from "./config/mongo";
import { batchQueue } from './modules/batch/queues/batch.queue';


const app = express();

connectMongo();

(async () => {
  try {
    await batchQueue.isReady();
    console.log('Bull queue connected to Redis');

    await batchQueue.add({ test: 'hello queue' });
    console.log('Test job ajouté à la queue');

  } catch (err) {
    console.error('Bull queue error', err);
  }
})();


app.use(express.json());
app.use(routes);


export default app;