import React, { useState, useEffect, ReactNode, useCallback } from "react";
import TimeContext from "../contexts/TimeContext";
import { minsToMilliseconds } from "../utils/timeUtils";
import { ACTIVITY_API } from "../api/routes/activityRoutes";
import { useLocalStorage } from "../hooks/useLocalStorage";
import useActivityData from "../hooks/useActivityData";

interface TimeProviderProps {
  children: ReactNode;
}

const TimeProvider: React.FC<TimeProviderProps> = ({ children }) => {
  // Duration of the Activity
  const activityDuration = minsToMilliseconds(10); // Change mins to ms

  // State to track the elapsed time since the user connected, after the activity launch
  const [userElapsedTime, setUserElapsedTime] = useState<number>(0);

  // Sets Activity start time
  const [activityStartTime, setActivityStartTime] = useState<string>("");

  // Get activity Status
  // const [activityStatus, setActivityStatus] = useState("");

  // Set or get 'app_start_time' from localStorage
  const [appStartTime, setAppStartTime] = useState("");

  const { activityData, error } = useActivityData("1"); // Use the custom hook

  const [timer, setTimer] = useState({
    turnTime: activityDuration,
    elapsedTime: 0,
    isActive: false,
    isPaused: true,
  });

  const [userElapsedTime, setUserElapsedTime] = useState(() => {
    const parsedAppStartTime = parseInt(appStartTime, 10);
    const parsedActivityStartTimeDB = parseInt(activityStartTime, 10);

    // On a récupéré un temps de lancement de l'activité, elle a démarré
    if (!isNaN(parsedActivityStartTimeDB) && !isNaN(parsedAppStartTime)) {
      // Both times are valid numbers
      const initialElapsedTime = parsedAppStartTime - parsedActivityStartTimeDB;
      return initialElapsedTime; // Calculated elapsed time
    } else {
      // Default value (e.g., 0) if calculation not possible
      return 0;
    }
  });

  /**
   * Get or set User connexion time */
  const { getItem } = useLocalStorage("app_start_time");

  useEffect(() => {
    let appStartTimeStorage = getItem();
    if (appStartTimeStorage) {
      appStartTimeStorage = Date.now().toString();
      setAppStartTime(appStartTimeStorage);
    }
  }, [getItem]);

  useEffect(() => {
    // Check if there is an activity
    if (activityData) {
      const { activity_start_time, status } = activityData;

      if (activity_start_time !== null) {
        setActivityStartTime(activity_start_time);
        // setActivityStatus(status);
      }
    } else if (error) {
      console.error("Error fetching activity data:", error);
    } else {
      console.log("Pas de données d'activité ! ");
    }
  }, [activityData, activityStartTime, error]);

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
    [] // This empty dependency array means the function is only created once per component instance
  );

  /**
   * Handle Start Activity, set Activity status to ROTATING
   */
  const start = () => {
    const now = Date.now();
    setTimer((prevTimer) => ({
      ...prevTimer,
      isActive: true,
      isPaused: false,
      elapsedTime: userElapsedTime || 0, // ou la valeur que vous souhaitez
    }));
    updateActivity("ROTATING", now);
    tick();
  };

  /**
   * Handle Pause/Resume Activity
   */
  const pauseResume = useCallback(async () => {
    // Toggle the pause state
    setTimer((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));

    // Check the new state after toggling and update the activity status accordingly
    if (timer.isPaused) {
      // If the activity was paused and is now being resumed
      console.log("Activity In progress");
      await updateActivity("IN_PROGRESS");
    } else {
      // If the activity was running and is now being paused
      console.log("Activity Paused");
      await updateActivity("PAUSED");
    }
  }, [timer.isPaused, updateActivity]);

  const stop = useCallback(async () => {
    console.log("Activity ended ");
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
      const response = await fetch(ACTIVITY_API.activityById("1"), options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Handle the response, e.g., by updating local state or triggering a re-fetch of activity data
    } catch (error) {
      console.error(`Failed to update activity status to COMPLETED : `, error);
    }
    setTimer({
      turnTime: activityDuration,
      elapsedTime: 0,
      isActive: false,
      isPaused: true,
    });
    setUserElapsedTime(0);
  }, [activityDuration]);

  const parsedActivityStartTime = activityStartTime
    ? parseInt(activityStartTime, 10)
    : 0;

  // Define a function 'tick' that will be called every second
  const tick = useCallback(async () => {
    // console.log("parsedActivityStartTime :", parsedActivityStartTime);

    const now = Date.now(); // Get the current time

    let elapsed = now - parsedActivityStartTime; // Calculate elapsed time since the activity started

    if (elapsed == now) {
      elapsed = 0;
    }

    const timeLeft = Math.max(activityDuration - elapsed, 0); // Calculate remaining time, ensuring it doesn't go below 0

    // Update the timer state with the new elapsed time and remaining time
    setTimer((prev) => ({
      ...prev,
      elapsedTime: elapsed, // Update elapsed time
      turnTime: activityDuration, // Update remaining time
    }));
    // If there's no time left (activity is over)
    if (timeLeft <= 0) {
      stop(); // Call stop function to update activity status and reset timer
    }
  }, [activityDuration, parsedActivityStartTime, stop]);

  useEffect(() => {
    // Check if the activity is active, not paused, and has a valid start time
    if (timer.isActive && !timer.isPaused) {
      const timeoutId = setTimeout(tick, 1000); // Set a timeout to call 'tick' after 1 second

      // Return a cleanup function that clears the timeout
      // This ensures the timeout is cleared when the component unmounts or the dependencies change
      return () => clearTimeout(timeoutId);
    }
  }, [timer, tick]);

  return (
    <TimeContext.Provider value={{ ...timer, start, pauseResume, stop }}>
      {children}
    </TimeContext.Provider>
  );
};

export { TimeProvider };
