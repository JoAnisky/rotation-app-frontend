import PageContainer from "../layouts/PageContainer";
// import ControlButtons from "../components/Timer/ControlButtons";
import StopWatch from "../components/Timer/Stopwatch";
// import { ActivityContext } from "../contexts/ActivityContext";

const Gamemaster: React.FC = () => {
  
  // Get ActivityData
  // const activityData = useContext(ActivityContext);
  // const { name, status } = activityData;

  return (
    <PageContainer role="Maître du jeu">
      <h1>Maître du jeu</h1>
      {/* <ControlButtons/> */}
      <StopWatch isAdmin={true}/>
    </PageContainer>
  );
};

export default Gamemaster;
