import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";

const Home: React.FC = () => {
  return (
    <div className="index">
      <Box className="_welcome">
        <h1>Bienvenue !</h1>
        <p>Quel rôle avez-vous pour cette insolite activité ?</p>
      </Box>

      <Box className="roles-choice">
        <Button className="btnChoiceRole" component={Link} to="/activity_code/participant">
          {" "}
          Participant
        </Button>
        <Button className="btnChoiceRole" component={Link} to="/activity_code/animator">
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
