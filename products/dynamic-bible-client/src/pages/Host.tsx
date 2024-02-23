import { useLocation } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

export const Host = () => {
  const socket = useSocket();
  const { state } = useLocation();
  return (
    <div>
      Your host id is: {state.pin}
      <div>
        <div>
          <button
            onClick={() =>
              socket.emit("get-passage", {
                translation: "kjv",
                book: "Proverbs",
                chapter: 3,
                verse: "1-5",
              })
            }
          >
            Emit verse
          </button>
        </div>
      </div>
    </div>
  );
};
