import { Route, Routes } from "react-router-dom";
import Sections from "./pages/Sections";
import Question from "./pages/Question";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sections" element={<Sections />} />
        <Route path="/question" element={<Question />} />
      </Routes>
    </>
  );
}

export default App;
