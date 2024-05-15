import express, { Request, Response, Application } from 'express';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { useExpressServer } from 'routing-controllers';
import { UserController } from './app/controllers/UserController';
import { SessionController } from './app/controllers/SessionController';
import { WaMessageController } from './app/controllers/WaMessageController';
import { whasappServices } from './app/services/whasappServices';
import { bootstrap } from './config/bootstrap';
import WsMiddleware from './app/middleware/WsMiddleware';
import { WssServers } from './app/services/WssServers';

const port: number = parseInt(process.env.PORT || '3000', 10);
const server: Application = new bootstrap().app;
const wss = WssServers();

(async () => {
  try {
    // Initialize WhatsApp services with WebSocket server
    await whasappServices(wss);

    // Setup express server with routing-controllers
    useExpressServer(server, {
      controllers: [UserController, SessionController, WaMessageController],
    });

    // Middleware setup
    server.use(morgan('dev'));
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use(cookieParser());
    server.use(cors());

    // Static files
    server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    server.all('*', (req: Request, res: Response) => {
      res.status(404).json({ message: 'Route not found' });
    });

    // Start the server
    server.listen(port, () => {
      console.log(
        `> Server is running on http://localhost:${port} - env ${process.env.NODE_ENV}`
      );
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

export { server, wss };
