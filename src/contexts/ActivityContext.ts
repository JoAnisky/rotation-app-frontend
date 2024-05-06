import { createContext } from "react";
import { ActivityContextType } from "../types/ActivityInterface";


export const ActivityContext = createContext<ActivityContextType>({
  activityId: null,
  role: null,
  setActivityData: () => {} // Fournissez une implémentation par défaut qui ne fait rien
});