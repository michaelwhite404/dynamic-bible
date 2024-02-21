import express from "express";
import http from "http";
import cors from "cors";
import chalk from "chalk";
import { Server } from "socket.io";
import ShortUniqueId from "short-unique-id";

const { red, green } = chalk;
const app = express();
const server = http.createServer(app);
const PORT = 8080;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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

io.on("connection", (socket) => {
  console.log(green`A user connected: ${socket.id}`);

  socket.on("create-session", () => {});

  socket.on("pressed", (data) => {
    console.log(io.sockets.sockets);
  });

  socket.on("disconnect", () => {
    console.log(red`A user disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
