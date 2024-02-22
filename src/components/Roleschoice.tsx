import { Toolbar } from "@material-ui/core";
import { Link } from "react-router-dom";

const Roleschoice = () => {
  return (
    <Toolbar>
      <div>
        <Link to="/participant">Participant</Link>
        <Link to="/animateur">Animateur</Link>
        <Link to="/gamemaster">Maître du jeu</Link>
      </div>
    </Toolbar>
  );
};

export default Roleschoice;
