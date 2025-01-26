import express, { Application, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { subscribeEvent } from "./src/Handler";
import { redisPub } from "./src/RedisService";

const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 4665;
app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.send("Hello World");
});


app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server is running on port ${PORT}`);
    subscribeEvent();
});
