import React, { useState, useEffect, ReactNode, useCallback } from "react";
import TimeContext from "./TimeContext";
import { minsToMilliseconds } from "../utils/timeUtils";
import { ACTIVITY_API } from "../api/routes/activityRoutes";

interface TimeProviderProps {
  children: ReactNode;
  elapsedTime: number; // Assuming elapsedTime could be null if not set
  activityStartTime: string; // Accept null and undefined
}

const TimeProvider: React.FC<TimeProviderProps> = ({
  children,
  elapsedTime,
  activityStartTime,
}) => {
  // Duration of the Activity
  const activityDuration = minsToMilliseconds(10); // Change mins to ms

  const [timer, setTimer] = useState({
    turnTime: activityDuration,
    elapsedTime,
    isActive: true,
    isPaused: false,
  });

  useEffect(() => {
    console.log("time provider elapsed Time : ", elapsedTime);
    // Define a function 'tick' that will be called every second
    const tick = () => {
      const parsedActivityStartTime = parseInt(activityStartTime, 10);

      const now = Date.now(); // Get the current time
      const elapsed = now - (parsedActivityStartTime || 0); // Calculate elapsed time since the activity started
      console.log("Elapsed Time : ", elapsed);
      const timeLeft = Math.max(activityDuration - elapsed, 0); // Calculate remaining time, ensuring it doesn't go below 0

      // Update the timer state with the new elapsed time and remaining time
      setTimer((prev) => ({
        ...prev,
        elapsedTime: elapsed, // Update elapsed time
        turnTime: activityDuration, // Update remaining time
      }));
      // If there's no time left (activity is over)
      if (timeLeft <= 0) {
        //stop(); // Call stop function to update activity status and reset timer
      }
    };

    // Check if the activity is active, not paused, and has a valid start time
    if (timer.isActive && !timer.isPaused && activityStartTime) {
      const timeoutId = setTimeout(tick, 1000); // Set a timeout to call 'tick' after 1 second

      // Return a cleanup function that clears the timeout
      // This ensures the timeout is cleared when the component unmounts or the dependencies change
      return () => clearTimeout(timeoutId);
    }
  }, [timer, activityStartTime, activityDuration, elapsedTime]);

  return (
    <TimeContext.Provider value={{ ...timer }}>
      {children}
    </TimeContext.Provider>
  );
};

export default TimeProvider;
