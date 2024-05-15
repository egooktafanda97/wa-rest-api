import { where } from 'sequelize';
import SessionConnection, { SessionConnectionAttributes } from '../models/SessionConnection';
import { SessionRepositoryInterface } from './interface/SessionRepositoryInterface';

export class SessionRepository implements SessionRepositoryInterface {
  public async saveSession(request: SessionConnectionAttributes) {
    const data = await SessionConnection.create(request);
    return data;
  }
  public async updateStatusConnection({ sessionId, status }: { sessionId: string; status: boolean }) {
    const Sessions = await SessionConnection.update(
      {
        status_connecting: status,
        wtahch_connect: true
      },
      {
        where: {
          session_name: sessionId
        }
      }
    );
    return Sessions;
  }
  public async getAllSessionByUserId(userId: number, where?: any) {
    const Sessions = await SessionConnection.findAll({
      where: {
        user_id: userId,
        ...where
      }
    });

    return Sessions;
  }

  public async getSessionId() {}
  public async nonactiveSession() {}
  public async reconnectingSession() {}
  public async removeSession(sessionId: string) {
    const Sessions = await SessionConnection.destroy({
      where: {
        session_name: sessionId
      }
    });

    return Sessions;
  }
}
