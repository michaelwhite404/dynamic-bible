import { Socket } from "socket.io";

interface FormattedSession {
  pin: string;
  host: string;
  viewers: string[];
}

export default class Session {
  readonly pin: string;
  private host: Socket;
  private viewers: Socket[];
  constructor({ pin, host }: { pin: string; host: Socket }) {
    this.pin = pin;
    this.host = host;
    this.viewers = [];
    this.host.join(this.pin);
    this.host.emit("session-created", { pin });
    this.host.data.hostSession = this;
  }

  /**
   * Adds viewer to the session
   * @param viewer
   */
  addViewer(viewer: Socket) {
    this.viewers.push(viewer);
  }

  formatSession(): FormattedSession {
    return {
      pin: this.pin,
      host: this.host.id,
      viewers: this.viewers.map((viewer) => viewer.id),
    };
  }
}

// const sess = new Session({ pin: "123" });
