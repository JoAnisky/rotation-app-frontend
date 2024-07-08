import React, { useState } from "react";
import { ActivityContext } from "../contexts/ActivityContext";
// import useActivityData from "../../hooks/useActivityData";

interface Props {
  children: React.ReactNode;
}

export const ActivityProvider: React.FC<Props> = ({ children }) => {
  const [activityId, setActivityId] = useState<string | number>(0);

  const setActivityData = (activityId: string) => {
    setActivityId(activityId);
  };

  return (
    <ActivityContext.Provider value={{ activityId, setActivityData }}>
      {children}
    </ActivityContext.Provider>
  );
};


export default ActivityProvider;
