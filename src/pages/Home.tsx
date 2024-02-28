import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="index">
      <Box className="_welcome">
        <h1>Bienvenue !</h1>
        <p>Quel rôle avez-vous pour cette insolite activité ?</p>
      </Box>

      <Box className="roles-choice">
        <Button className="btnChoiceRole" component={Link} to="/participant">
          {" "}
          Participant
        </Button>
        <Button className="btnChoiceRole" component={Link} to="/animateur">
          {" "}
          Animateur
        </Button>
        <Button className="btnChoiceRole" component={Link} to="/gamemaster">
          {" "}
          Maitre du jeu
        </Button>
      </Box>
    </div>
  );
};

export default Home;
