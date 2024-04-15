import React, { useState, useEffect } from "react";
import { IActivityData } from "../types/ActivityInterface";
import { ActivityContext } from "../contexts/ActivityContext";
import { ACTIVITY_API } from "../routes/api/activityRoutes";
// import useActivityData from "../../hooks/useActivityData";

interface ActivityContextValue extends IActivityData {
  loading: boolean;
  error: boolean;
}

interface Props {
  children: React.ReactNode;
}

const ActivityProvider: React.FC<Props> = ({ children }) => {
  const [activityData, setActivityData] = useState<IActivityData | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Initial loading state
  const [error, setError] = useState<boolean>(false); // Initial error state
  // const {
  //   activityData: fetchedActivityData,
  //   error: fetchError,
  //   loading: fetchLoading,
  // } = useActivityData("1");

  const fetchData = async () => {
    try {
      setLoading(true); // Set loading state to true
      const response = await fetch(ACTIVITY_API.activityById("1"), {
        method: "GET",
      });
      if (response.ok) {
        const jsonData = await response.json();
        setActivityData(jsonData);
      } else {
        setError(true); // Set error state if response is not ok
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(true); // Set error state on any error during fetching
    } finally {
      setLoading(false); // Set loading state to false after fetching (success or failure)
      //setTimeout(fetchData, 1000); // Schedule next fetch after 1 second
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
