import React, { useState, useEffect } from "react";
import { IActivityData } from "@/types/ActivityInterface";
import { ActivityContext } from "@/contexts/ActivityContext";
import useActivityData from "@/hooks/useActivityData"; // Import your custom hook

interface ActivityContextValue extends IActivityData {
  loading: boolean;
  error: boolean; // Change the type accordingly
}

interface Props {
  children: React.ReactNode;
}
const ActivityProvider: React.FC<Props> = ({ children }) => {
  const [activityData, setActivityData] = useState<IActivityData | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Initial loading state
  const [error, setError] = useState<boolean>(false); // Initial error state
  const {
    activityData: fetchedActivityData,
    error: fetchError,
    loading: fetchLoading,
  } = useActivityData("15");

  useEffect(() => {
    if (fetchedActivityData) {
    //   console.log(fetchedActivityData);
      setActivityData(fetchedActivityData);
    }
  }, [fetchedActivityData]);

  useEffect(() => {
    setLoading(fetchLoading); // Update loading state based on fetchLoading from the custom hook
  }, [fetchLoading]);

  useEffect(() => {
    if (fetchError) {
      setError(true);
    }
  }, [fetchError]);

  const contextValue: ActivityContextValue | undefined = activityData
    ? { ...activityData, loading, error }
    : undefined;

  return (
    <ActivityContext.Provider value={contextValue}>
      {children}
    </ActivityContext.Provider>
  );
};

export default ActivityProvider;
