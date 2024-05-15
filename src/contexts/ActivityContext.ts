import { createContext } from "react";
import { IActivityContext } from "../types/ActivityInterface";


export const ActivityContext = createContext<IActivityContext>({
  activityId: null,
  setActivityData: () => {} // Fournissez une implémentation par défaut qui ne fait rien
});