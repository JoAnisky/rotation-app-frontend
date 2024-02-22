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
          <Button text="Participant" color="#cd1414"></Button>
          <Button text="Animateur" color="#cd1414"></Button>
          <Button text="Maître du jeu" color="#cd1414"></Button>
        </div>
      </div>
    </div>
  );
}

export default App;
