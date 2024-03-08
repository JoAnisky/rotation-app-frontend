import React, { useState, useEffect, ReactNode, useCallback } from "react";
import TimeContext from "./TimeContext";
import { minsToMilliseconds } from "../utils/timeUtils";
import { ACTIVITY_API } from "../api/routes/activityRoutes";

interface TimeProviderProps {
  children: ReactNode;
  elapsedTime: number; // Assuming elapsedTime could be null if not set
  activityStartTime: string; // Accept null and undefined
  activityStatus: string;
}

const TimeProvider: React.FC<TimeProviderProps> = ({
  children,
  elapsedTime,
  activityStartTime,
  activityStatus,
}) => {
  // Duration of the Activity
  const activityDuration = minsToMilliseconds(10); // Change mins to ms

  const [timer, setTimer] = useState({
    turnTime: activityDuration,
    elapsedTime,
    isActive: false,
    isPaused: true,
  });

  useEffect(() => {
    if (activityStatus == "ROTATING" || activityStatus == "IN_PROGRESS") {
      // Rotating
      setTimer((prev) => ({ ...prev, isActive: true, isPaused: false }));
    }
  }, [activityStatus]);

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
      elapsedTime: 5000, // ou la valeur que vous souhaitez
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
  }, [activityDuration]);

  // Define a function 'tick' that will be called every second
  const parsedActivityStartTime = activityStartTime
    ? parseInt(activityStartTime, 10)
    : 0;

  const tick = useCallback(async () => {
    console.log("parsedActivityStartTime :", parsedActivityStartTime);

    const now = Date.now(); // Get the current time

    let elapsed = now - parsedActivityStartTime; // Calculate elapsed time since the activity started

    if (elapsed == now) {
      elapsed = 0;
    }

    console.log("Elapsed Time : ", elapsedTime);
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
  }, [activityDuration, parsedActivityStartTime, stop, elapsedTime]);

  useEffect(() => {
    // Check if the activity is active, not paused, and has a valid start time
    if (timer.isActive && !timer.isPaused) {
      //const timeoutId =
      setTimeout(tick, 1000); // Set a timeout to call 'tick' after 1 second

      // Return a cleanup function that clears the timeout
      // This ensures the timeout is cleared when the component unmounts or the dependencies change
      //return () => clearTimeout(timeoutId);
    }
  }, [timer, tick]);

  return (
    <TimeContext.Provider value={{ ...timer, start, pauseResume, stop }}>
      {children}
    </TimeContext.Provider>
  );
};

export default TimeProvider;
