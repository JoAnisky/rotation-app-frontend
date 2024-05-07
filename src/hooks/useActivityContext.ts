import  { useContext } from "react";
import { ActivityContext } from "@/contexts/ActivityContext";

export function useActivityContext() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivityContext doit être utilisé à l’intérieur d’un ActivityProvider');
  }
  return context;
}