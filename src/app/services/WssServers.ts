import { WebSocket } from 'ws';

export const WssServers = (): any => {
  const wss: any = new WebSocket.Server({ port: 3001 });
  return wss;
};
