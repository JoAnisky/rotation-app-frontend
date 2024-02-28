import Roleschoice from "../components/Roleschoice";

const Home = () => {
    return (
      <div className="index">
        <h1>Home</h1>
        <h1>Bienvenue !</h1>
          <p>Quel rôle avez-vous pour cette insolite activité ?</p>
        
        <Roleschoice />
      </div>
    );
  };
  
  export default Home;