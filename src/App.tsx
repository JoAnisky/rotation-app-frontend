//import Button from "./components/Button";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Participant from "./pages/Participant";
import Animator from "./pages/Animator";
import Gamemaster from "./pages/Gamemaster";
import Roleschoice from "./components/Roleschoice";

const App = () => {
  return (
    <div className="index">
      <div className="_content">
        <div className="_welcome">
          <h1>Bienvenue !</h1>
          <p>Quel rôle avez-vous pour cette insolite activité ?</p>
        </div>

        <Router>
          <Roleschoice />
          <Routes>
            <Route path="/participant" element={<Participant/>} />
            <Route path="/animateur" element={<Animator />} />
            <Route path="/gamemaster" element={<Gamemaster />} />
          </Routes>
        </Router>
        {/* <div className="roles-choice">
          <Button component={Link} to="/path"text="Participant"></Button>
          <Button component={Link} to="/path" text="Animateur"></Button>
          <Button component={Link} to="/path" text="Maître du jeu"></Button>
        </div> */}
      </div>
    </div>
  );
};

export default App;
