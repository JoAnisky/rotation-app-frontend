//import Button from "./components/Button";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Participant from "./pages/Participant";
import Animator from "./pages/Animator";
import Gamemaster from "./pages/Gamemaster";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/participant" element={<Participant />} />
        <Route path="/animateur" element={<Animator />} />
        <Route path="/gamemaster" element={<Gamemaster />} />
      </Routes>
    </>
  );
};

export default App;
