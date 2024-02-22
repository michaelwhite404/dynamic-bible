import { useLocation } from "react-router-dom";

export const Host = () => {
  const { state } = useLocation();
  return <div>Your host id is: {state.pin}</div>;
};
