import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import * as whatsapp from 'wa-multi-session';
import { toDataURL } from 'qrcode';
import { responseSuccessWithData } from '../../utils/response';
import { propsCreated } from './interface/SessionInterface';

export class SessionService {
  public async SessionCreated(props: propsCreated) {
    const { res, scan, sessionName, cllback } = props;
    try {
      await res.status(200).json(
        whatsapp.onQRUpdated(async (data: any) => {
          if (res && !res.headersSent) {
            const qr: any = await toDataURL(data.qr);
            await cllback(data, qr);
          }
        })
      );
      await whatsapp.startSession(sessionName, { printQR: true });
    } catch (error) {}
  }
}
