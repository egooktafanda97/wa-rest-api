import 'reflect-metadata';
import { ValidationError } from '../../utils/error';
import { delays } from '../../utils/proccessing';
import { responseSuccessWithData } from '../../utils/response';
import 'reflect-metadata';

import { Controller, Param, Body, Get, Post, Put, Delete, Req, Res, QueryParam, UploadedFile } from 'routing-controllers';
import * as whatsapp from 'wa-multi-session';
import ResponseApi from '../../utils/ResponseApi';
import multer, { diskStorage } from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import mime from 'mime-types';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});

const upload = multer({ storage: storage });

@Controller()
export class WaMessageController {
  /**
   *
   * @param value function
   * @returns
   */
  public async isEmpty(value: any) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length === 0;
    } else if (typeof value === 'string') {
      return value.trim().length === 0;
    }
    return !value;
  }

  @Post('/api/send-text')
  public async sendMessage(@Req() request: any, @Res() response: any) {
    try {
      const { to, text, isGroup, session }: { to: string; text: string; isGroup: boolean; session: string } = request?.body;

      if (!to || !text) {
        throw new ValidationError('Missing Parameters', 401);
      }
      const receiver: string = to;
      if (!session) {
        throw new ValidationError('Session Not Found', 404);
      }
      const send = await whatsapp.sendTextMessage({
        sessionId: session,
        to: receiver,
        isGroup: !!isGroup,
        text
      });

      return ResponseApi.success('Ok', send);
    } catch (error: any) {
      return ResponseApi.error('error', error);
    }
  }

  @Post('/api/send-broadcart')
  public async broadCast(@Req() request: any, @Res() response: any) {
    try {
      const sessionId = request.body.session || request.query.session || request.headers.session;
      const delay = request.body.delay || request.query.delay || request.headers.delay;
      if (!sessionId) {
        return {
          status: false,
          data: {
            error: 'Session Not Found'
          }
        };
      }
      for (const dt of request.body.data) {
        const to = dt.to;
        const text = dt.text;
        const isGroup = !!dt.isGroup;

        await whatsapp.sendTextMessage({
          sessionId: sessionId,
          to: to,
          isGroup: isGroup,
          text: text
        });

        await whatsapp.createDelay(delay ?? 1000);
      }
      return ResponseApi.success('Bulk Message is Processing', []);
    } catch (error) {
      return ResponseApi.error('error', error);
    }
  }
  @Post('/api/send-file')
  public async sendFile(@UploadedFile('files', { options: upload }) file: any, @Req() request: any, @Res() response: any) {
    try {
      const { to, text, isGroup, session }: { to: string; text: string; isGroup: boolean; session: string } = request?.body;
      const props: any = {
        sessionId: session,
        to: to,
        text: text ?? '',
        file: `${file?.filename}`
      };
      const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
      if (fileExtension) {
        props.filename = file?.filename;
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          await this.imageSend(props);
        } else if (['mp4', 'avi', 'mkv'].includes(fileExtension)) {
          await this.vidioSend(props);
        } else if (['mp3', 'wav', 'ogg'].includes(fileExtension)) {
          await this.voiceSend(props);
        } else {
          await this.fileSend(props);
        }
      }
      return ResponseApi.success('Ok', []);
    } catch (error) {
      return ResponseApi.error('error', error);
    }
  }

  @Post('/api/send-file-broadcast')
  public async sendFileBroadCast(@UploadedFile('files', { options: upload }) file: any, @Req() request: any, @Res() response: any) {
    try {
      const sessionId = request.body.session || request.query.session || request.headers.session;
      const parseData: any = JSON.parse(request.body.data ?? '[]');

      const delay = request.body.delay || request.query.delay || request.headers.delay;
      if (!sessionId) {
        return {
          status: false,
          data: {
            error: 'Session Not Found'
          }
        };
      }

      for (const dt of parseData) {
        const to = dt.to;
        const text = dt.text;
        const isGroup = !!dt.isGroup;
        const props: any = {
          sessionId: sessionId,
          to: to,
          text: text ?? '',
          file: `${file?.filename}`
        };
        const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
        if (fileExtension) {
          if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            await this.imageSend(props);
          } else if (['mp4', 'avi', 'mkv'].includes(fileExtension)) {
            await this.vidioSend(props);
          } else if (['mp3', 'wav', 'ogg'].includes(fileExtension)) {
            await this.voiceSend(props);
          } else {
            props.filename = file?.filename;
            await this.fileSend(props);
          }
        }

        await whatsapp.createDelay(delay ?? 1000);
      }
      return ResponseApi.success('Bulk Message is Processing', []);
    } catch (error) {
      return ResponseApi.error('error', error);
    }
  }

  public async imageSend(props: Record<string, any>) {
    const publicPath = path.join(process.cwd(), 'public');
    const imagePath = path.join(publicPath, 'uploads', props.file);
    const isFiles = fs.readFileSync(imagePath);

    const send = await whatsapp.sendImage({
      sessionId: props.sessionId,
      to: props.to,
      text: props.text,
      media: isFiles
    });
    return send;
  }

  public async vidioSend(props: Record<string, any>) {
    const publicPath = path.join(process.cwd(), 'public');
    const imagePath = path.join(publicPath, 'uploads', props.file);
    const isFiles = fs.readFileSync(imagePath);

    const send = await whatsapp.sendVideo({
      sessionId: props.sessionId,
      to: props.to,
      text: props.text,
      media: isFiles
    });
    return send;
  }

  public async fileSend(props: Record<string, any>) {
    const publicPath = path.join(process.cwd(), 'public');
    const imagePath = path.join(publicPath, 'uploads', props.file);
    const isFiles = fs.readFileSync(imagePath);

    const send = await whatsapp.sendDocument({
      sessionId: props.sessionId,
      to: props.to,
      text: props.text,
      filename: props.filename,
      media: isFiles
    });
    return send;
  }

  public async voiceSend(props: Record<string, any>) {
    const publicPath = path.join(process.cwd(), 'public');
    const imagePath = path.join(publicPath, 'uploads', props.file);
    const isFiles = fs.readFileSync(imagePath);

    const send = await whatsapp.sendVoiceNote({
      sessionId: props.sessionId,
      to: props.to,
      media: isFiles
    });
    return send;
  }
}
