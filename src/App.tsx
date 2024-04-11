//import Button from "./components/Button";
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/router";
// import {TimeProvider} from "./context/TimeProvider";
import { useLocalStorage } from "./hooks/useLocalStorage";
import ActivityProvider from "./providers/ActivityProvider";
import CounterProvider from "./providers/CounterProvider";
// Hook responsible to ActivityData get

const App: React.FC = () => {
  // On app launch, store the application's start time in localStorage.
  const { setItem } = useLocalStorage("app_start_time");

  /**
   * Verify if app_start_time exists in localStorage and create it if nedeed
   */
  useEffect(() => {
    setItem(Date.now().toString());
  }, [setItem]);

  return (
    <BrowserRouter>
      <ActivityProvider>
        <CounterProvider>
          <Router />
        </CounterProvider>
      </ActivityProvider>
      {/* <TimeProvider> */}

      {/* </TimeProvider> */}
    </BrowserRouter>
  );
};

export default App;
