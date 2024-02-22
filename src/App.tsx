import Button from "./components/Button";

const App = () => {
  return (
    <div className="index">
      <div className="_content">
        <div className="_welcome">
          <h1>Bienvenue !</h1>
          <p>Quel rôle avez-vous pour cette insolite activité ?</p>
        </div>

        <div className="roles-choice">
          <Button text="Participant"></Button>
          <Button text="Animateur"></Button>
          <Button text="Maître du jeu"></Button>
        </div>
      </div>
    </div>
  );
}

export default App;
