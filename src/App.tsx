//import Button from "./components/Button";
import React, {useEffect} from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/router";
import TimeProvider from "./context/TimeProvider";
import { useLocalStorage } from "./hooks/useLocalStorage";

const App: React.FC = () => {
  const { getItem, setItem } = useLocalStorage("app_start_time");

  useEffect(() => {
    // Check if app_start_time already exists
    const existingStartTime = getItem();
    if (!existingStartTime) {
      const now = Date.now();
      setItem(now); // Set app_start_time only if it doesn't exist
    }
  }, [getItem, setItem]);

  return (
    <TimeProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </TimeProvider>
  );
};

export default App;
