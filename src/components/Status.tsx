import { useContext, useEffect, useState } from "react";
import STATUS from "../utils/statusCode";
import { ActivityContext } from "../contexts/ActivityContext";

interface StatusProps {
  activityStatus: string
}

const Status: React.FC<StatusProps> = ({ activityStatus }) => {
  const [initialStatus, setActivityStatus] = useState<string>(activityStatus);

  const activityData = useContext(ActivityContext);

  useEffect(() => {
      setActivityStatus(activityStatus);
    
  }, [initialStatus, activityStatus]);

  // Function to translate status code to string
  // Function to translate status code to string
  const getStatusString = (statusCode: string) => {
    return (STATUS as Record<string, string>)[statusCode] || "";
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p>{getStatusString(initialStatus)}</p>
    </div>
  );
};

export default Status;
