import { useContext, useEffect, useState } from "react";
import STATUS from "../utils/statusCode";
import { ActivityContext } from "../contexts/ActivityContext";

const Status = () => {
  const [activityStatus, setActivityStatus] = useState<string>("NOT_STARTED");

  const activityData = useContext(ActivityContext);

  useEffect(() => {
    if (activityData) {
      const { status } = activityData;
      setActivityStatus(status);
    }
  }, []);
  return (
    <div style={{textAlign: "center"}}>
      <h2>Statut</h2>
      <p>{activityStatus}</p>
    </div>
  );
};

export default Status;
