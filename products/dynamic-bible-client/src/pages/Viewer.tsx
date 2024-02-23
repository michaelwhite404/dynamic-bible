import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

interface Passage {
  translation: string;
  book: string;
  chapter: number;
  verse: number | string;
  text: string;
}

export const Viewer = () => {
  const socket = useSocket();
  const [passage, setPassage] = useState<Passage>();
  const {
    state: { pin },
  } = useLocation();

  // useEffect(() => {
  //   socket.on("viewer-enter-session",);
  // }, [])

  useEffect(() => {
    socket.on("show-passage", setPassage);
    socket.on("hide-passage", () => setPassage(undefined));
  }, [socket]);

  return (
    <div>
      <div style={{ height: 100 }} />
      {passage && (
        <span style={{ color: "dodgerblue", fontSize: 40, fontWeight: 600 }}>{passage.text}</span>
      )}
    </div>
  );
};
