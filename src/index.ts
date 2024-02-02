import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { join } from "node:path";
import { Server } from "socket.io";
import { createServer } from "node:http";

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3030;
const io = new Server(httpServer);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(join(__dirname, 'frontend.html'));
});

io.on('connection', (socket) => {
  socket.on('addGuide', (guide: string) => {
    socket.emit('newGuideNotification', guide);
  });
});

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
