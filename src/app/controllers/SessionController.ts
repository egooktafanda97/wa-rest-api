import 'reflect-metadata';
import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Req,
  Res,
  QueryParam,
} from 'routing-controllers';
import { SessionService } from '../services/SessionService';
import { IsAlpha } from 'class-validator';
import { responseSuccessWithMessage } from '../../utils/response';
import * as whatsapp from 'wa-multi-session';
import { toDataURL } from 'qrcode';
import { request } from 'http';
import { ValidationError } from '../../utils/error';
import { wss } from '../../server';
import { SessionConnectionAttributes } from '../models/SessionConnection';
import { SessionRepository } from '../repository/SessionRepository';
import ResponseApi from '../../utils/ResponseApi';
@Controller()
export class SessionController {
  /**
   *created new session
   */
  @Get('/api/new-session')
  public async newSession(@Req() request: any, @Res() response: any) {
    try {
      const SessionRepositorySave = new SessionRepository();
      const scan = request.query.scan;
      const UserId: number = request.query.user_id;
      const sessionName =
        request.body.session ||
        request.query.session ||
        request.headers.session;
      const getSessionInUsers =
        await SessionRepositorySave.getAllSessionByUserId(UserId);
      if (getSessionInUsers) {
        getSessionInUsers.map(async (x: any) => {
          if (x.wtahch_connect == false) {
            await whatsapp.deleteSession(x.session_name);
            await SessionRepositorySave.removeSession(x.session_name);
          }
        });
      }
      if (!sessionName) {
        throw new Error('Bad requestuest');
      }
      await whatsapp.startSession(sessionName, { printQR: true });
      const parser: SessionConnectionAttributes = {
        id: null,
        user_id: UserId,
        phone: '0',
        session_name: sessionName,
        status_connecting: false,
        wtahch_connect: false,
      };

      await SessionRepositorySave.saveSession(parser);
      return ResponseApi.success('Ok', parser);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/api/get-session/:id')
  public async getSession(
    @Param('id') id: number,
    @Req() request: any,
    @Res() response: any
  ) {
    try {
      const SessionRepositorySave = new SessionRepository();
      const sessions = await SessionRepositorySave.getAllSessionByUserId(id, {
        wtahch_connect: true,
      });
      return ResponseApi.success('Ok', sessions);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/api/destory/:sessions')
  public async deleteSession(
    @Param('sessions') sessions: string,
    @Req() request: any,
    @Res() response: any
  ) {
    try {
      if (!sessions) {
        throw new ValidationError('session Required', 500);
      }
      whatsapp.deleteSession(sessions);
      return ResponseApi.success('Success Deleted ', sessions);
    } catch (error) {
      console.log(error);
    }
  }
}
