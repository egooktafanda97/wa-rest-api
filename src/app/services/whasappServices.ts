import { toDataURL } from 'qrcode';
import * as whatsapp from 'wa-multi-session';
import { WebSocket } from 'ws';
import { ManagementSessionService } from './ManagementSessionService';
export const whasappServices = async (wss: any) => {
  whatsapp.onConnected(async (session) => {
    console.log('connected => ', session);
    wss.clients.forEach(async (client: any) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ event: 'connected', sessionId: session, status: true }));
        await new ManagementSessionService().updateConnection({
          sessionId: session,
          status: true
        });
      }
    });
  });

  whatsapp.onDisconnected(async (session: any) => {
    console.log('disconnected => ', session);

    wss.clients.forEach(async (client: any) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ event: 'connected', sessionId: session, status: false }));
        const sessionDb = new ManagementSessionService();
        sessionDb.removeConnection(session);
        await whatsapp.deleteSession(session);
      }
    });
  });

  whatsapp.onConnecting(async (session) => {
    console.log('onConnecting => ', session);
    wss.clients.forEach((client: any) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ event: 'connecteting', sessionId: session }));
      }
    });
  });

  whatsapp.loadSessionsFromStorage();

  whatsapp.onMessageReceived(async (msg: any) => {
    // console.log(msg);
    // if (msg?.broadcast == false) saveMsg(msg);
  });

  whatsapp.onQRUpdated(async ({ sessionId, qr }) => {
    wss.clients.forEach(async (client: any) => {
      if (client.readyState === WebSocket.OPEN) {
        const qrCode: string = await toDataURL(qr);

        client.send(JSON.stringify({ event: 'onQrUpdate', sessionId, qr: qrCode }));
      }
    });
  });
};
