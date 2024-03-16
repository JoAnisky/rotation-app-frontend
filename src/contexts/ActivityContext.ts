import { createContext, useContext } from "react";
import { IActivityData } from "../types/activityTypes";

export const ActivityContext = createContext<IActivityData | undefined>(undefined);

export const useActivityContext = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivityContext must be used within an ActivityProvider");
  }
  return context;
};