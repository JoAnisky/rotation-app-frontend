import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";

const Home: React.FC = () => {
  return (
    <Box className="index">
      <Box className="_welcome">
        <h1>Bienvenue !</h1>
        <p>Quel rôle avez-vous ?</p>
      </Box>

      <Box className="roles-choice">
        <Button variant="contained" component={Link} to="/activity_code/participant">
          {" "}
          Participant
        </Button>
        <Button variant="contained" component={Link} to="/activity_code/animator">
          {" "}
          Animateur
        </Button>
        <Button variant="contained" component={Link} to="/login">
          {" "}
          Maitre du jeu
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
