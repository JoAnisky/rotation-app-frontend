import PageContainer from "../layouts/PageContainer";
// import ControlButtons from "../components/Timer/ControlButtons";
// import Timer from "../components/Timer/Timer";
import StopWatch from "../components/Timer/Stopwatch";
// import { ActivityContext } from "../contexts/ActivityContext";

const Gamemaster: React.FC = () => {
  
  // Get ActivityData
  // const activityData = useContext(ActivityContext);
  // const { name, status } = activityData;

  return (
    <PageContainer role="Maître du jeu">
      <h1>Maître du jeu</h1>
      <StopWatch isAdmin={true}/>
      {/* <ControlButtons /> */}
      {/* <Timer /> */}
    </PageContainer>
  );
};

export default Gamemaster;
