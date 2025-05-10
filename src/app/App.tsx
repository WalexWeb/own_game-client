import { Route, Routes } from "react-router-dom";
import Game from "./pages/Game";
import Home from "./pages/Home/Home";
import LeaderboardPage from "./pages/Leaderboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </>
  );
}

export default App;
