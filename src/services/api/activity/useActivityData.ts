// In useActivityData.ts
import { useCallback, useEffect, useState } from "react";
import { ACTIVITY_API } from "../../../api/routes/activityRoutes";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { IActivityData } from "./activityTypes";

const useActivityData = () => {
  const { getItem, setItem } = useLocalStorage("activityData");

  // Try to get the Activity Data value from local storage if it exists
  const storedActivityData = getItem() ? JSON.parse(getItem() as string) : null;
  //
  const [activityData, setActivityData] = useState<IActivityData | null>(storedActivityData);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to update activity data if different from newData, memoized with useCallback
  const updateActivityData = useCallback(
    (newData: IActivityData) => {
      const currentDataString = JSON.stringify(activityData);
      const newDataString = JSON.stringify(newData);

      if (newDataString !== currentDataString) {
        setActivityData(newData);
        setItem(newDataString); // Assuming setItem does not change, otherwise include it in the dependencies array
      } else {
        // This else branch might be unnecessary if you don't need to explicitly set it to null
        // when the data hasn't changed. Consider removing it if not needed.
        setActivityData(null);
      }
    },
    [setActivityData, setItem, activityData]
  );

  const fetchActivityData = useCallback(async () => {
    setIsLoading(true);
    try {
      // If ActivityData in localStorage
      if (storedActivityData) {
        // update activityData state with this value
        updateActivityData(storedActivityData);
      } else {
        // No activityData stored, let's fetch it !
        const response = await fetch(ACTIVITY_API.activityById("1"));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: IActivityData = await response.json();
        updateActivityData(data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch activity data")
      );
    } finally {
      setIsLoading(false);
    }
  }, [updateActivityData, storedActivityData]);

  useEffect(() => {
    if (activityData == null) {
      fetchActivityData();
    }
  }, [activityData, fetchActivityData]);

  return { activityData, isLoading, error };
};

export default useActivityData;
