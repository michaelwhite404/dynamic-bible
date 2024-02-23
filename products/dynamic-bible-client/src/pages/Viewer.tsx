import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

export const Viewer = () => {
  const socket = useSocket();
  const [passage, setPassage] = useState({});
  const {
    state: { pin },
  } = useLocation();

  useEffect(() => {
    socket.on("show-passage", setPassage);
  }, [socket]);

  return (
    <div>
      You are viewing session {pin}
      <div style={{ height: 100 }} />
      <span>{passage.text}</span>
    </div>
  );
};
