//import Button from "./components/Button";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/router";
import TimeProvider from "./context/TimeProvider";
import { useLocalStorage } from "./hooks/useLocalStorage";
import useActivityData from "./services/api/activity/useActivityData";

const App: React.FC = () => {
  // On app launch, store the application's start time in localStorage.
  const { getItem, setItem } = useLocalStorage("app_start_time");
  const { activityData, error } = useActivityData(); // Use the custom hook

  // State to track the elapsed time since the user connected, after the activity launch
  const [userElapsedTime, setUserElapsedTime] = useState<number>(0);

  // Sets Activity start time
  const [activityStartTime, setActivityStartTime] = useState<string>("");

  // Sets App start time
  const [appStartTime, setAppStartTime] = useState<string>("");

  // Get activity Status
  const [activityStatus, setActivityStatus] = useState("")

  /**
   * Verify if app_start_time exists in localStorage and create it if nedeed
   */
  const createUserAppStartTime = useCallback(() => {
    const appStartTimeLocalStorage = getItem() || Date.now().toString(); // Fallback to now if not found

    setItem(Date.now().toString());

    setAppStartTime(appStartTimeLocalStorage);
  }, [getItem, setItem]);

  const countElapsedTime = useCallback(() => {

    const parsedAppStartTime = parseInt(appStartTime, 10);
    const parsedActivityStartTimeDB = parseInt(activityStartTime, 10);

    // On a récupéré un temps de lancement de l'activité, elle a démarré
    if (!isNaN(parsedActivityStartTimeDB) && !isNaN(parsedAppStartTime)) {
      // Both times are valid numbers

      const initialElapsedTime = parsedAppStartTime - parsedActivityStartTimeDB;
      setUserElapsedTime(initialElapsedTime); // Set the initial elapsed time

      // console.log("Utilisateur connecté à : ", appStartTime);
      // console.log("Activité lancée à : ", parsedActivityStartTimeDB);

      // Calculate the elapsed time if the user connected after the activity started
      if (parsedAppStartTime > parsedActivityStartTimeDB) {
        const elapsedTime = parsedAppStartTime - parsedActivityStartTimeDB;
        setUserElapsedTime(elapsedTime)
      }
    }
  }, [appStartTime, activityStartTime]);

  useEffect(() => {
    createUserAppStartTime();

    // Check if there is an activity
    if (activityData) {
      const { activity_start_time, status } = activityData;

      if (activity_start_time !== null) {
        setActivityStartTime(activity_start_time);
        setActivityStatus(status)
      }

      countElapsedTime();
    } else if (error) {
      console.error("Error fetching activity data:", error);
    }
  }, [
    activityData,
    error,
    activityStartTime,
    createUserAppStartTime,
    countElapsedTime,
  ]);

  return (
    <TimeProvider
      elapsedTime={userElapsedTime}
      activityStartTime={activityStartTime}
      activityStatus={activityStatus}
    >
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </TimeProvider>
  );
};

export default App;
