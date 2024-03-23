import { useContext, useEffect, useState } from "react";
import STATUS from "../utils/statusCode";
import { ActivityContext } from "../contexts/ActivityContext";

const Status: React.FC = () => {
  const [initialStatus, setActivityStatus] = useState<string>("");

  const activityData = useContext(ActivityContext);

  useEffect(() => {
    if (activityData) {
      const { status: activityStatus } = activityData;
      setActivityStatus(activityStatus);
    }
  }, [activityData]);

  // Function to translate status code to string
  const getStatusString = (statusCode: string) => {
    return (STATUS as Record<string, string>)[statusCode] || "";
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Statut</h2>
      <p>{getStatusString(initialStatus)}</p>
    </div>
  );
};

export default Status;
