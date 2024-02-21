import express from "express";
import http from "http";
import cors from "cors";
import chalk from "chalk";
import { Server } from "socket.io";

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
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log(green`A user connected: ${socket.id}`);

  socket.on("pressed", (data) => {
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log(red`A user disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
