import PageContainer from "../layouts/PageContainer";
// import ControlButtons from "../components/Timer/ControlButtons";
import StopWatch from "../components/Timer/Stopwatch";
import { ActivityContext } from "../contexts/ActivityContext";
import { useContext, useEffect, useState } from "react";
import { IActivityData } from "../types/activityTypes";

const Gamemaster: React.FC = () => {

  const [activityData, setActivityData] = useState<IActivityData | null>(null);
  const [activityName, setActivityName] = useState<string>("")

  // Get ActivityData
  const activityDataProvider = useContext(ActivityContext);
  
  // Retrieve current activity data
  useEffect(() => {
    if (activityDataProvider) {
      setActivityData(activityDataProvider)
      setActivityName(activityDataProvider.name)
    } else {
      // still loading or null ??
    }
  }, [activityDataProvider]);

  return (
    <PageContainer role="Maître du jeu">
      <h3>Gestion de l'activité</h3>
      <p>Nom :  {activityName}</p>
      {/* <ControlButtons/> */}
      <StopWatch isAdmin={true}/>

    </PageContainer>
  );
};

export default Gamemaster;
