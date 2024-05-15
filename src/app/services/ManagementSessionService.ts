import { SessionRepository } from '../repository/SessionRepository';

export class ManagementSessionService {
  public async updateConnection({ sessionId, status }: { sessionId: string; status: boolean }) {
    await new SessionRepository().updateStatusConnection({
      sessionId: sessionId,
      status: status
    });
  }

  public async removeConnection(sessionId: any) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>', sessionId);

    await new SessionRepository().removeSession(sessionId);
  }
}
