import { useLocation } from "react-router-dom";

export const Viewer = () => {
  const { state } = useLocation();

  return <div>You are viewing session {state.pin}</div>;
};
