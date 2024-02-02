import express, { Express } from "express";
import dotenv from "dotenv";
import { createServer } from "node:http";

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3030;

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
