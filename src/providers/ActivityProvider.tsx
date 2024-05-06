import React, { useState } from "react";
import { ActivityContext } from "../contexts/ActivityContext";
// import useActivityData from "../../hooks/useActivityData";

interface Props {
  children: React.ReactNode;
}

export const ActivityProvider: React.FC<Props> = ({ children }) => {
  const [activityId, setActivityId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const setActivityData = (activityId: string, role: string) => {
    setActivityId(activityId);
    setRole(role);
  };

  return (
    <ActivityContext.Provider value={{ activityId, role, setActivityData }}>
      {children}
    </ActivityContext.Provider>
  );
};


export default ActivityProvider;
