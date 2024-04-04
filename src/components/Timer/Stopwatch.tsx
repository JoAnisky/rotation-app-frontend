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
  const activityDuration = minsToMilliseconds(0.1); // Change mins to ms

  // Activity local States 
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(activityDuration);

  // Access the context value using useContext hook
  const activityData = useContext(ActivityContext);
  
  // Activity data
  const [activityStartTime, setActivityStartTime] = useState<string | null>(null); // (Used to calculate the elapsed time between the activity start time and the user's connection.)
  const [pauseStartTime, setPauseStartTime] = useState<string | null>(null); // (Used to calculate the elapsed time between the pause start time and the activity's resume.)
  const [activityStatus, setActivityStatus] = useState<string>("");

  // State to store initial elapsed time
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const { getItem } = useLocalStorage("app_start_time");
  // App lauch time (User connection time)
  const appLaunchTime = getItem();

  const handleStop = useCallback(() =>  {
    updateActivity({
      status: "COMPLETED",
      activity_start_time: null, // Assuming you want to clear this
      pause_start_time: null, // Assuming you want to clear this
    });
    setIsActive(false); // Set isActive to false
    setIsPaused(true); // Set isPaused to true
    setCounter(activityDuration);
    setElapsedTime(0);
  }, [activityDuration]);

  // Retrieve current activity data
  useEffect(() => {
    if (activityData) {
      const { activity_start_time, status: activityStatus } = activityData;
      if (activity_start_time) {
        setActivityStartTime(activity_start_time);
      }
      setActivityStatus(activityStatus);
    } else {
      // still loading or null ??
    }
  }, [activityData]);

  // track activity Status
  useEffect(() => {
    console.log("Status changed : ", activityStatus);
    if (activityStatus === "ROTATING" || activityStatus === "IN_PROGRESS") {
      console.log("Activity status :  ROTATING or IN_PROGRESS !");
      setIsActive(true);
      setIsPaused(false);
    } else if (activityStatus === "PAUSED") {
      console.log("Activity status : PAUSED");
      setIsPaused(true);
      setIsActive(true);
    } else if (activityStatus === "COMPLETED") {
      console.log("Activity status : COMPLETED");
      setIsActive(false);
    }
  }, [activityStatus, activityDuration]);

  useEffect(() => {
    // Did activity started ?
    if (activityStartTime) {
      const parsedActivityStartTimeDB = parseInt(activityStartTime, 10);
      const parsedAppStartTime = parseInt(appLaunchTime, 10);

      if (!isNaN(parsedActivityStartTimeDB) && !isNaN(parsedAppStartTime)) {
        // Did activity started before App launch (User connection) ?
        if (activityStartTime < appLaunchTime) {
          // Count elapsed Time
         
            setElapsedTime(parsedAppStartTime - parsedActivityStartTimeDB);

          console.log(
            "User connected AFTER activity Launch, count elapsed Time : ",
            elapsedTime
          );
        } else {
          console.log("User was connected BEFORE activity Launch");
        }
      } else {
        console.log("Parsing times Error");
      }
    } else {
      console.log("Activity not started");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityStartTime, elapsedTime]);

  // Counter
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setCounter((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval as ReturnType<typeof setInterval> ); // Stop the interval if time reaches 0

            handleStop();
            return 0;
          }
          return prevTime - 10; // Decrease time by 10 milliseconds
        });
      }, 10);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isPaused, handleStop]);

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
        const response = await fetch(ACTIVITY_API.activityById("15"), options);
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

  const handleStart = useCallback(() => {
    const now = Date.now();
    setIsActive(true);
    setIsPaused(false);
    updateActivity({
      status: "ROTATING",
      activity_start_time: now.toString(),
    });
  }, [updateActivity]);

  const handlePauseResume = useCallback(() => {
    const now = Date.now();
    // Check the new state after toggling and update the activity status accordingly
    if (isPaused) {
      // ACTIVITY RESUME : activity was paused and is now being resumed
      console.log("pauseStartTime " , pauseStartTime);
      // Todo : 
      
      // Get pause_start_time
      // calculate elapsed time between pause_start and now (pause_duration)
      // Store pause_duration in DB
      // remove pause_start_time for the next pause timestamp
      updateActivity({ status: "IN_PROGRESS", pause_start_time: null });

    } else {
      // ACTIVITY PAUSED : activity was running and is now being paused
      setPauseStartTime(now.toString());
      updateActivity({
        status: "PAUSED",
        pause_start_time: now.toString(),
      });

    }
    setIsPaused(!isPaused);

  }, [isPaused, updateActivity, pauseStartTime]);

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
      <Timer counter={counter} elapsedTime={elapsedTime} activityDuration={activityDuration}/>
    </div>
  );
};

export default StopWatch;
