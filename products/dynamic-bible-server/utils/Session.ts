import { Socket } from "socket.io";

export default class Session {
  readonly pin: string;
  private host: Socket;
  private viewers: Socket[];
  constructor({ pin, host }: { pin: string; host: Socket }) {
    this.pin = pin;
    this.host = host;
    this.viewers = [];
    // this.host.join(this.pin);
  }

  /**
   * Adds viewer to the session
   * @param viewer
   */
  addViewer(viewer: Socket) {
    this.viewers.push(viewer);
  }

  endSession() {}
}

// const sess = new Session({ pin: "123" });
