import { ReactNode, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "../hooks/useSocket";

const uri = process.env.NODE_ENV === "production" ? "prod-url" : "http://127.0.0.1:8080";
const newSocket = io(uri);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket>(newSocket);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
