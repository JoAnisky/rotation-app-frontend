import React, { useCallback, useContext, useEffect } from "react";
import { Button } from "@mui/material";
import { ACTIVITY_API } from "@/routes/api/activityRoutes";
import { STOPWATCH_API } from "@/routes/api/stopwatchRoutes";
import CounterContext from "@/contexts/CounterContext";

const ControlButtons: React.FC = () => {
  const { isActive, isPaused, counter, setCounter } = useContext(CounterContext);

  /**
   * Decrement stopwatch method (every second)
   */
  const decrementStopwatch = useCallback(async () => {
    try {
      const response = await fetch(`${STOPWATCH_API.stopwatchById("1")}/decrement`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la décrémentation du chronomètre");
      }
    } catch (error) {
      console.error("Erreur :", error);
    }
  }, []);

  /**
   * Update the activity status in Database
   *
   */
  const updateActivity = useCallback(async (updateData: { status: string; [key: string]: string | null }) => {
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData)
    };

    try {
      const response = await fetch(ACTIVITY_API.getActivityById("1"), options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Handle the response...
    } catch (error) {
      console.error(`Failed to update activity: `, error);
    }
  }, []); // This empty dependency array means the function is only created once per component instance)

  const handleStop = useCallback(async () => {
    // First, update the activity status
    updateActivity({
      status: "COMPLETED"
    });

    // Then, make the async call to reset/init the stopwatch
    try {
      const response = await fetch(`${STOPWATCH_API.stopwatchById("1")}/init`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la réinitialisation du chronomètre");
      }

      const data = await response.json();
      setCounter(data.counter);
      console.log("counter data : ", data);
    } catch (error) {
      console.error("Erreur :", error);
    }
  }, [updateActivity, setCounter]); // Add necessary dependencies here

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
      activity_start_time: now.toString()
    });
  }, [updateActivity]);

  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      updateActivity({
        status: "IN_PROGRESS"
      });
    } else {
      // ACTIVITY PAUSED : activity was running and is now being paused
      updateActivity({
        status: "PAUSED"
      });
    }
  }, [isPaused, updateActivity]);

  const StartButton = (
    <Button variant="contained" color="primary" onClick={handleStart}>
      Démarrer l'activité
    </Button>
  );

  const ActiveButtons = (
    <div>
      <Button variant="contained" color="error" onClick={handleStop}>
        Stop
      </Button>
      <Button variant="contained" color="success" onClick={handlePauseResume}>
        {isPaused ? "Reprendre" : "Pause"}
      </Button>
    </div>
  );

  return (
    <div className="Control-Buttons">
      <div>{isActive ? ActiveButtons : StartButton}</div>
    </div>
  );
};

export default ControlButtons;
