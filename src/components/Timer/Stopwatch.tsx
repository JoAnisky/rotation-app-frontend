import React, { useState, useEffect, useContext, useCallback } from "react";
import Timer from "./Timer";
import ControlButtons from "./ControlButtons";
import { minsToMilliseconds } from "../../utils/timeUtils";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ActivityContext } from "../../contexts/ActivityContext";
import { ACTIVITY_API } from "../../api/routes/activityRoutes";

interface StopWatchProps {
  isAdmin: boolean;
}

const StopWatch: React.FC<StopWatchProps> = ({ isAdmin }) => {
  // Duration of the Activity
  const activityDuration = minsToMilliseconds(10); // Change mins to ms

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [totalDuration, setTotalDuration] = useState<number>(activityDuration);

  // Activity start time from DB
  const [activityStartTime, setActivityStartTime] = useState<string>("");
  const [activityStatus, setActivityStatus] = useState<string>("");

  // User start connexion time (LocalStorage app_start_time) */
  const [userAppStartTime, setUserAppStartTime] = useState<string>("");

  // State to store initial elapsed time
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const { getItem } = useLocalStorage("app_start_time");

  // Launched only once at Stopwatch mount
  useEffect(() => {
    const userAppStartTimeStorage = getItem();
    if (userAppStartTimeStorage !== null) {
      setUserAppStartTime(userAppStartTimeStorage);
    }
  }, [getItem]); // Removed userAppStartTime from the dependency array

  // Access the context value using useContext hook
  const activityData = useContext(ActivityContext);

  // Retrieve current activity data
  useEffect(() => {
    if (activityData) {
      const { activity_start_time, status: activityStatus } = activityData;
      if (activity_start_time !== null) {
        setActivityStartTime(activity_start_time);
      }
      setActivityStatus(activityStatus);
    } else {
      // still loading or null ??
    }
  }, [activityData]);

  useEffect(() => {
    console.log("Status changed : ", activityStatus);
    if (activityStatus === "ROTATING" || activityStatus === "IN_PROGRESS") {
      console.log("activité démarrée !");
      setIsActive(true);
      setIsPaused(false);
    } else if (activityStatus === "PAUSED") {
      console.log("Activité en pause");
      setIsPaused(true);
      setIsActive(true);
    } else if (activityStatus === "COMPLETED") {
      console.log("Activité FINIE");
      setIsActive(false);
    }
  }, [activityStatus, activityDuration]);

  useEffect(() => {
    const parsedActivityStartTimeDB = parseInt(activityStartTime, 10);
    const parsedAppStartTime = parseInt(userAppStartTime, 10);

    if (!isNaN(parsedActivityStartTimeDB) && !isNaN(parsedAppStartTime)) {
      setElapsedTime(parsedAppStartTime - parsedActivityStartTimeDB);
    } else {
      // console.log("No start time");
    }
  }, [activityStartTime, elapsedTime, userAppStartTime]);

  // Counter
  useEffect(() => {
    let interval: number | null = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTotalDuration((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval!); // Stop the interval if time reaches 0

            handleStop();
            return 0;
          }
          return prevTime - 10; // Decrease time by 10 milliseconds
        });
      }, 10);
    } else {
      if (interval !== null) clearInterval(interval);
    }

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  /**
   * Update the activity status in Database
   *
   */
  const updateActivity = useCallback(
    async (status: string, startTime?: number | null) => {
      // Initialize postData with status
      const postData: { status: string; activity_start_time?: string } = {
        status,
      };

      // If startTime is provided and not null, add it to postData
      if (startTime != undefined) {
        postData.activity_start_time = startTime.toString();
      }

      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      };

      try {
        const response = await fetch(ACTIVITY_API.activityById("1"), options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Handle the response, e.g., by updating local state or triggering a re-fetch of activity data
      } catch (error) {
        console.error(`Failed to update activity status to ${status}:`, error);
      }
    },
    []
  ); // This empty dependency array means the function is only created once per component instance)

  const handleStart = useCallback(() => {
    const now = Date.now();
    setIsActive(true);
    setIsPaused(false);
    updateActivity("ROTATING", now);
  }, [updateActivity]);

  const handlePauseResume = useCallback(() => {
    // Check the new state after toggling and update the activity status accordingly
    if (isPaused) {
      // If the activity was paused and is now being resumed
      console.log("Activity In progress");
      updateActivity("IN_PROGRESS");
    } else {
      // If the activity was running and is now being paused
      console.log("Activity Paused");
      updateActivity("PAUSED");
    }
    setIsPaused(!isPaused);
  }, [isPaused, updateActivity]);

  const handleStop = useCallback(() => {
    // Initialize postData with status
    const postData: { status: string; activity_start_time?: null } = {
      status: "COMPLETED",
      activity_start_time: null,
    };

    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    };

    try {
      const response = fetch(ACTIVITY_API.activityById("1"), options);
      if (!response) {
        throw new Error(`HTTP error! status: ${response}`);
      }
      // Handle the response, e.g., by updating local state or triggering a re-fetch of activity data
    } catch (error) {
      console.error(`Failed to update activity status to COMPLETED : `, error);
    }
    setIsActive(false); // Set isActive to false
    setIsPaused(true); // Set isPaused to true
    setTotalDuration(activityDuration);
    setElapsedTime(0)
  }, [activityDuration]);

  return (
    <div className="stop-watch">
      <Timer totalDuration={totalDuration} elapsedTime={elapsedTime} />
      {isAdmin && (
        <ControlButtons
          active={isActive}
          isPaused={isPaused}
          handleStart={handleStart}
          handlePauseResume={handlePauseResume}
          handleStop={handleStop}
        />
      )}
    </div>
  );
};

export default StopWatch;
