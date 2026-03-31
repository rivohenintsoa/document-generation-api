import express from "express";
import routes from "./routes";
import { connectMongo } from "./config/mongo";

connectMongo();

const app = express();

app.use(express.json());
app.use(routes);


export default app;