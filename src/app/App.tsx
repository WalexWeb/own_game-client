import { Route, Routes } from "react-router-dom";
import Game from "./pages/Game";
import Home from "./pages/Home/Home";
import Leaderboard from "./pages/Leaderboard";
import Start from "./pages/Start";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<Start />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </>
  );
}

export default App;
