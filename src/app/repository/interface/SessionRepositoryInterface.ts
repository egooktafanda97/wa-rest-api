import { SessionConnectionAttributes } from 'server/app/models/SessionConnection';

export interface SessionRepositoryInterface {
  saveSession: (request: SessionConnectionAttributes) => void;
  updateStatusConnection({ sessionId, status }: { sessionId: string; status: boolean }): any;
  getSessionId: () => void;
  getAllSessionByUserId: (userId: number) => any;
  nonactiveSession: () => void;
  reconnectingSession: () => void;
  removeSession: (sessionId: string) => void;
}
