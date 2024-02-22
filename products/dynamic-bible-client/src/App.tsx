import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useSocket } from "./hooks/useSocket";
import { useEffect, useState } from "react";

function App() {
  const [pin, setPin] = useState("");
  const socket = useSocket();

  useEffect(() => {
    // socket?.on("session-created", ({ pin }) => console.log(pin));
  }, [socket]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Create a new room</h1>
      <div className="card">
        <div>
          <button onClick={() => socket.emit("create-session", socket.id)}>Host Session</button>
        </div>
        <input value={pin} onChange={(e) => setPin(e.target.value)} />
        <button disabled={pin.length === 0} onClick={() => socket.emit("view-session", pin)}>
          View Session
        </button>
      </div>
    </>
  );
}

export default App;
