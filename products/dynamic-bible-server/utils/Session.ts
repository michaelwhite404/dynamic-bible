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
  private currentPassage: string | undefined;
  constructor({ pin, host }: { pin: string; host: Socket }) {
    this.pin = pin;
    this.host = host;
    this.viewers = [];
    this.passages = [];
    this.currentPassage = undefined;
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

  getPassage(uid: string) {
    return this.passages.find((passage) => passage.uid === uid);
  }

  getPassages() {
    return this.passages;
  }

  addPassage(params: PassageParams) {
    const passage = new Passage(params);
    if (passage.valid) this.passages.push(passage);
    return passage;
  }

  showPassageToViewers(uid: string) {
    const passage = this.getPassage(uid);
    if (passage && passage.valid) {
      this.currentPassage = passage.uid;
      this.host.broadcast.to(this.pin).emit("show-passage", passage.formatPassage());
    }
  }

  showPassageToViewer(viewer: Socket) {
    if (!this.currentPassage) return;
    const passage = this.getPassage(this.currentPassage)!;
    viewer.emit("show-passage", passage.formatPassage());
  }

  hidePassageFromViewers() {
    if (this.currentPassage) {
      this.currentPassage = undefined;
      this.host.broadcast.to(this.pin).emit("hide-passage");
    }
  }
}
