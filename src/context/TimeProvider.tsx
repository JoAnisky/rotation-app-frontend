import React, { useState, ReactNode } from "react";
import TimeContext, { defaultState } from "./TimeContext"; // Ensure the path is correct

const TimeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [time, setTime] = useState(defaultState.time);
  const [isActive, setIsActive] = useState(defaultState.isActive);
  const [isPaused, setIsPaused] = useState(defaultState.isPaused);

  const start = () => {
    setIsActive(true);
    setIsPaused(false);
    // Logic to start timer, possibly using setInterval
  };

  const pauseResume = () => {
    setIsPaused(!isPaused);
    // Logic to pause or resume timer based on isPaused state
  };

  const reset = () => {
    setIsActive(false);
    setIsPaused(true);
    setTime(0);
    // Logic to reset timer
  };

  React.useEffect(() => {
    let interval: number = 0;

    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  return (
    <TimeContext.Provider
      value={{ time, isActive, isPaused, start, pauseResume, reset }}
    >
      {children}
    </TimeContext.Provider>
  );
};

export default TimeProvider