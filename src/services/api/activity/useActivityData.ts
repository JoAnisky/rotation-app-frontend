import { useEffect, useState, useRef } from "react";
import { ACTIVITY_API } from "../../../api/routes/activityRoutes";
import { IActivityData } from "./activityTypes";
import useFetch from "../../../hooks/useFetch";

const useActivityData = (id: string) => {
  const [activityData, setActivityData] = useState<IActivityData | null>(null);
  const [data, loading, error] = useFetch<IActivityData>(
    ACTIVITY_API.activityById(id)
  );

  // Use useRef to keep track of the current value of activityData without causing re-renders
  const activityDataRef = useRef<IActivityData | null>(activityData);

  useEffect(() => {
    activityDataRef.current = activityData;
  }, [activityData]);

  useEffect(() => {
    if (data) {
      const currentDataString = JSON.stringify(activityDataRef.current);
      const newDataString = JSON.stringify(data);
      // Only update the state if the new data is different from the current data
      if (newDataString !== currentDataString) {
        setActivityData(data);
      }
    }
  }, [data]); // Dependency on 'data' ensures this effect runs whenever 'data' changes

  return { activityData, loading, error };
};

export default useActivityData;
