import "./App.css";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Home, Host, Viewer } from "./pages";

function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="host" element={<Host />} />
        <Route path="viewer" element={<Viewer />} />
      </Routes>
    </MemoryRouter>
  );
}

export default App;
