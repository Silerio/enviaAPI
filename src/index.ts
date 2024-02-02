import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { join } from "node:path";
import { Server } from "socket.io";
import { createServer } from "node:http";
import dataGuide from './data.json';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3030;
const io = new Server(httpServer);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(join(__dirname, 'frontend.html'));
});

io.on('connection', (socket) => {
  socket.on('addGuide', async () => {
    try {
      const apiRespond = await fetch(`${process.env.API_ENVIA_BASE_URL}/ship/generate/`, {
        method: 'POST',
        body: JSON.stringify(dataGuide),
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_ENVIA_KEY}`,
        },
      });

      const newGuideRespond = await apiRespond.json();

      console.log('newGuide', newGuideRespond);
      socket.emit('newGuideNotification', newGuideRespond);
    } catch (error) {
      console.log('ocurrio un error', error);
      socket.emit('newGuideNotification', false);
    }
  });
});

/*
  Este web hook se había agregado para poder actualizar en tiempo real cuando 
  se actualizaran los estatus de las guías pero la API de prueba no me respondía, 
  solamente cuando probaba el webhook (al agregar onShipmentStatusUpdate en el dashboard) funcionaba,
  pero al momento de actualizar el registro, no tenía respuesta de parte del API.

  Por eso se descarto la funcionalidad pero me parece que no era parte del ejercicio,
  aunque me hubiera gustado agregarlo.

  app.get("/webhook", (req: Request, res: Response) => {
    console.log('webhook has been reach');
    console.log(req);
  });
*/

httpServer.listen(port, () => {
  console.log(`[server]: Servicios ejecutandose en: http://localhost:${port}`);
});
