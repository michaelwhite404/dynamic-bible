import { Socket } from "socket.io";
import Session from "./Session";
import { io } from "..";

export default class LiveSessions {
  private sessions: Session[];
  constructor() {
    this.sessions = [];
  }

  getSessions() {
    return this.sessions;
  }

  /**
   * Creates a new session
   * @param session
   */
  createSession(pin: string, host: Socket) {
    this.sessions.push(new Session({ pin, host }));
    console.log(io.sockets.adapter.rooms.get(pin));
  }

  /**
   * Get the session by pin
   * @param pin The pin of the session
   */
  getSession(pin: string): Session | undefined;
  getSession(session: Session): Session | undefined;
  getSession(session: Session | string) {
    let pin = session instanceof Session ? session.pin : session;
    return this.sessions.find((currSession) => currSession.pin === pin);
  }

  endSession(pin: string) {
    this.sessions = this.sessions.filter((session) => session.pin !== pin);
  }
}
// const liveSessions = new LiveSessions();
// liveSessions.getSession('');
