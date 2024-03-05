import { useState, useEffect, ReactNode } from "react";
import TimeContext, { defaultState } from "./TimeContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { minsToMilliseconds } from "../utils/timeUtils";
import { ACTIVITY_API } from "../api/routes/activityRoutes";
import { useTimer } from "../hooks/useTimer";

const TimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const initialTime = minsToMilliseconds(1); // Converts minutes to milliseconds
  // Get the app start time from user
  const { getItem, setItem } = useLocalStorage("app_start_time");

  // Activity start time
  const [activityStartTime, setActivityStartTime] = useState<number | null>(null);

  const [timerState, setTimerState] = useState({
    turnTime: initialTime,
    isActive: defaultState.isActive,
    isPaused: defaultState.isPaused,
    elapsedTime: 0,
  });

  const { turnTime, isActive, isPaused, elapsedTime } = timerState;

  useTimer(setTimerState, isActive, isPaused, getItem, initialTime); // Custom hook for timer logic

  const start = async () => {
    const now = Date.now();
    setTimerState((prev) => ({ ...prev, isActive: true, isPaused: false }));
    setActivityStartTime(now);
    setItem(now.toString());

    // Define data for the PUT request using the same timestamp
    const postData = JSON.stringify({
      activity_start_time: now.toString(),
      status: 'ROTATING'
    });
  
    // Define the options for the PUT request
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: postData,
    };

    try {
      const response = await fetch(ACTIVITY_API.activityById("1"), options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      // Handle successful response, e.g., update state or UI based on result
    } catch (error) {
      console.error("Failed to start activity:", error);
      // Handle error, e.g., show error message to user
    }

  };
  
  const pauseResume = () => {
    setTimerState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const reset = () => {
    setTimerState({
      turnTime: initialTime,
      isActive: false,
      isPaused: true,
      elapsedTime: 0,
    });
  };

  // useEffect(() => {
  //   let interval: number = 0;
  //   if (isActive && !isPaused) {
  //     interval = setInterval(() => {
  //       const startTime = getItem();
  //       if (startTime) {
  //         const now = Date.now();
  //         const elapsed = now - parseInt(startTime, 10); // Calculate elapsed time
  //         setElapsedTime(elapsed);

  //         // Stop the timer when it reaches 0
  //         if (turnTime <= 0) {
  //           clearInterval(interval);
  //           setIsActive(false);
  //         } else {
  //           setTurnTime((prevTime) => prevTime);
  //         }
  //       }
  //     }, 1000); // Update every second
  //   } else {
  //     clearInterval(interval);
  //   }
  //   // Clear the interval on effect cleanup
  //   return () => clearInterval(interval);
  // }, [isActive, isPaused, getItem]);

  return (
    <TimeContext.Provider
      value={{
        turnTime,
        elapsedTime,
        isActive,
        isPaused,
        start,
        pauseResume,
        reset,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
};

export default TimeProvider;
