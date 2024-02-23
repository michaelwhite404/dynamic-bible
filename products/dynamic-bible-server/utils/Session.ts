import { Socket } from "socket.io";
import { Passage, PassageParams } from "./Passage";

interface FormattedSession {
  pin: string;
  host: string;
  viewers: string[];
}

export default class Session {
  readonly pin: string;
  private host: Socket;
  private viewers: Socket[];
  private passages: Passage[];
  constructor({ pin, host }: { pin: string; host: Socket }) {
    this.pin = pin;
    this.host = host;
    this.viewers = [];
    this.passages = [];
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
    viewer.data.viewerSession = this;
    viewer.join(this.pin);
    viewer.emit("viewer-added", { pin: this.pin });
  }

  removeViewer(viewer: Socket) {
    this.viewers = this.viewers.filter((currViewer) => currViewer.id !== viewer.id);
  }

  formatSession(): FormattedSession {
    return {
      pin: this.pin,
      host: this.host.id,
      viewers: this.viewers.map((viewer) => viewer.id),
    };
  }

  // getPassage(query: string) {}

  getPassages() {
    return this.passages;
  }

  addPassage(params: PassageParams) {
    const passage = new Passage(params);
    if (passage.valid) this.passages.push(passage);
    return passage;
  }

  showPassageToViewers(uid: string) {
    const passage = this.passages.find((passage) => passage.uid === uid);
    if (passage && passage.valid) {
      this.host.broadcast.to(this.pin).emit("show-passage", passage.formatPassage());
    }
  }
}
