import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [pin, setPin] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("session-created", ({ pin }) => {
      navigate("host", { state: { pin } });
    });

    socket.on("viewer-added", ({ pin }) => {
      navigate("viewer", { state: { pin } });
    });
  }, [socket]);
  return (
    <>
      <h1>Create or view a session</h1>
      <div className="card">
        <div>
          <button onClick={() => socket.emit("create-session")}>Host Session</button>
        </div>
        <input value={pin} onChange={(e) => setPin(e.target.value)} />
        <button disabled={pin.length === 0} onClick={() => socket.emit("view-session", pin)}>
          View Session
        </button>
      </div>
    </>
  );
};
