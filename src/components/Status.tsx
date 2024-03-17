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
  }, [activityData]);

  // Function to translate status code to string
  // Function to translate status code to string
  const getStatusString = (statusCode: string) => {
    return (STATUS as Record<string, string>)[statusCode] || "";
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Statut</h2>
      <p>{getStatusString(activityStatus)}</p>
    </div>
  );
};

export default Status;
