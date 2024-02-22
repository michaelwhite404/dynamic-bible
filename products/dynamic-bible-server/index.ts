import express from "express";
import http from "http";
import cors from "cors";
import chalk from "chalk";
import { Server } from "socket.io";
import ShortUniqueId from "short-unique-id";
import LiveSessions from "./utils/LiveSessions";
import Session from "./utils/Session";

interface ServerToClientEvents {
  "session-created": () => void;
  "no-session-found": () => void;
}

interface ClientToServerEvents {
  "create-session": () => void;
  "view-session": (pin: string) => void;
}

interface InterServerEvents {}

interface SocketData {
  hostSession?: Session;
  viewerSession?: Session;
}

const liveSessions = new LiveSessions();

const { red, green } = chalk;
const app = express();
const server = http.createServer(app);
const PORT = 8080;
export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const uid = new ShortUniqueId({ length: 10 });

app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.get("/sockets", (req, res) => {
  const sockets = Array.from(io.sockets.sockets.keys());
  res.status(200).json({ sockets });
});

app.get("/sessions", (req, res) => {
  res.status(200).json({
    sessions: liveSessions.getSessions().map((session) => session.formatSession()),
  });
});

app.get("/rooms/:room", (req, res) => {
  const { room } = req.params;
  res.status(200).json({ room: io.sockets.adapter.rooms.get(room)?.values().next() });
});

io.on("connection", (socket) => {
  console.log(green`A user connected: ${socket.id}`);

  socket.on("create-session", () => {
    const pin = uid.rnd().toString();
    console.log(pin);
    liveSessions.createSession(uid.rnd().toString(), socket);
  });

  socket.on("view-session", (pin) => {
    liveSessions.getSession(pin)?.addViewer(socket);
  });

  socket.on("disconnecting", () => {
    const hostPin = socket.data.hostSession?.pin;
    // Rethink this
    if (hostPin) {
      liveSessions.endSession(hostPin);
      return;
    }

    const viewerSession = socket.data.viewerSession;
    if (viewerSession) viewerSession.removeViewer(socket);
  });

  socket.on("disconnect", () => {
    console.log(red`A user disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
