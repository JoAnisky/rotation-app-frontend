import { useEffect, useState, useRef, useCallback } from "react";
import { ACTIVITY_API } from "@/routes/api/activityRoutes";
import { IActivityData } from "@/types/ActivityInterface";
import useFetch from "./useFetch";

const useActivityData = (id: number) => {
  const [activityData, setActivityData] = useState<IActivityData | null>(null);
  const [data, loading, error] = useFetch<IActivityData>(ACTIVITY_API.getActivityById(id));

  // Use useRef to keep track of the current value of activityData without causing re-renders
  const activityDataRef = useRef<IActivityData | null>(activityData);

  // Separate function for state updates with dependency on `data` to avoid unnecessary re-renders
  const updateActivityData = useCallback(() => {
    if (data) {
      const currentDataString = JSON.stringify(activityDataRef.current);
      const newDataString = JSON.stringify(data);
      if (newDataString !== currentDataString) {
        setActivityData(data);
      }
    }
  }, [data]);

  // Use useEffect with dependency on `data` and `updateActivityData`
  useEffect(() => {
    updateActivityData();
  }, [data, updateActivityData]);

  return { activityData, loading, error };
};

export default useActivityData;
