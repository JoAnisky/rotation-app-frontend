import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="index">
      <h1>Bienvenue !</h1>
      <p>Quel rôle avez-vous pour cette insolite activité ?</p>
      <Button component={Link} to="/participant"> Participant</Button>
      <Button component={Link} to="/animateur"> Animateur</Button>
      <Button component={Link} to="/gamemaster"> Maitre du jeu</Button>
    </div>
  );
};

export default Home;
