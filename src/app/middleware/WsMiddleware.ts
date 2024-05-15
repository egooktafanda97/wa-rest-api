import { Request, Response, NextFunction } from 'express';
import { WebSocket } from 'ws';
export default function WsMiddleware(req: any, res: Response, next: NextFunction) {
  console.log('middleware ok');
  const wss: any = new WebSocket.Server({ port: 3001 });
  req.wss = wss;
  next();
}
