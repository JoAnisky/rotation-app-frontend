import React, { useState, useEffect, useContext } from "react";
import Timer from "./Timer";
import { ActivityContext } from "@/contexts/ActivityContext";
import CounterContext from "@/contexts/CounterContext";

const Stopwatch: React.FC = () => {

  const { setIsActive, setIsPaused } = useContext(
    CounterContext
  );
  // Access the context value using useContext hook
  const activityData = useContext(ActivityContext);

  const [activityStatus, setActivityStatus] = useState<string>("");
  // Fetch Stopwatch duration at stopwatch mount

  // Retrieve current activity data
  useEffect(() => {
    if (!activityData) return;

    setActivityStatus(activityStatus);
  }, [activityStatus, activityData]);

  // track activity Status
  useEffect(() => {
    console.log("Status changed: ", activityStatus);
  
    switch (activityStatus) {
      case "ROTATING":
      case "IN_PROGRESS":
        setIsActive(true);
        setIsPaused(false);
        break;
      case "PAUSED":
        setIsActive(true);
        setIsPaused(true);
        break;
      case "COMPLETED":
        setIsActive(false);
        setIsPaused(true);
        break;
      default:
        // Handle any other status or the initial state
        console.log("Unhandled status: ", activityStatus);
        // Optionally, set default states or do nothing
    }
  }, [activityStatus, setIsActive, setIsPaused]);

  return (
    <>
      <Timer />
    </>
  );
};

export default Stopwatch;
