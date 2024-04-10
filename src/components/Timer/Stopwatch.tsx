import React, { useState, useEffect, useContext, useCallback } from "react";
import Timer from "./Timer";
import ControlButtons from "./ControlButtons";
import { ActivityContext } from "../../contexts/ActivityContext";
import { ACTIVITY_API } from "../../routes/api/activityRoutes";
import { STOPWATCH_API } from "../../routes/api/stopwatchRoutes";

interface StopWatchProps {
  isAdmin: boolean;
}

const StopWatch: React.FC<StopWatchProps> = ({ isAdmin }) => {
  // Duration of the Activity
  //const activityDuration = minsToMilliseconds(10); // Change mins to ms

  // Activity local States
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);

  // Access the context value using useContext hook
  const activityData = useContext(ActivityContext);

  const [activityStatus, setActivityStatus] = useState<string>("");

  /**
   * Update the activity status in Database
   *
   */
  const updateActivity = useCallback(
    async (updateData: { status: string; [key: string]: string | null }) => {
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      };

      try {
        const response = await fetch(ACTIVITY_API.activityById("1"), options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Handle the response...
      } catch (error) {
        console.error(`Failed to update activity: `, error);
      }
    },
    []
  ); // This empty dependency array means the function is only created once per component instance)

  const handleStop = useCallback(async () => {
    // First, update the activity status
    updateActivity({
      status: "COMPLETED",
    });

    // Then, make the async call to reset/init the stopwatch
    try {
      const response = await fetch(`${STOPWATCH_API.stopwatchById("1")}/init`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la réinitialisation du chronomètre");
      }

      const data = await response.json();
      setCounter(data.counter);
    } catch (error) {
      console.error("Erreur :", error);
    }
  }, [updateActivity, setCounter]); // Add necessary dependencies here

  // Fetch Stopwatch duration at stopwatch mount

  /**
   * Decrement stopwatch method (every second)
   */
  const getCounter = useCallback(async() =>  {
    try {
      const response = await fetch(`${STOPWATCH_API.stopwatchById("1")}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du compteur");
      }

      const data = await response.json();
      setCounter(data.counter);
      console.log("Counter : " , counter);
    } catch (error) {
      console.error("Erreur :", error);
    }
  },[]);

  useEffect(() => {
    // Call `getCounter` immediately on component mount
    getCounter();

  }, []);

  // Retrieve current activity data
  useEffect(() => {
    if (!activityData) return;

    const { status: activityStatus } = activityData;
    setActivityStatus(activityStatus);
  }, [activityData]);

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
  }, [activityStatus]);

  /**
   * Decrement stopwatch method (every second)
   */
  const decrementStopwatch = async () => {
    try {
      const response = await fetch(
        `${STOPWATCH_API.stopwatchById("1")}/decrement`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la décrémentation du chronomètre");
      }

      const data = await response.json();
      setCounter(data.counter);

    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  // Counter
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        if (counter > 0) {
          decrementStopwatch();
        } else {
          handleStop();
        }
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isPaused, handleStop, counter]);

  const handleStart = useCallback(() => {
    const now = Date.now();
    updateActivity({
      status: "ROTATING",
      activity_start_time: now.toString(),
    });
  }, [updateActivity]);

  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      updateActivity({
        status: "IN_PROGRESS",
      });
    } else {
      // ACTIVITY PAUSED : activity was running and is now being paused
      updateActivity({
        status: "PAUSED",
      });
    }
    setIsPaused(!isPaused);
  }, [isPaused, updateActivity]);

  return (
    <div className="stop-watch">
      {isAdmin && (
        <ControlButtons
          active={isActive}
          isPaused={isPaused}
          handleStart={handleStart}
          handlePauseResume={handlePauseResume}
          handleStop={handleStop}
        />
      )}
      <Timer counter={counter} />
    </div>
  );
};

export default StopWatch;
