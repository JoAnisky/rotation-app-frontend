//import Button from "./components/Button";
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/router";
import { useLocalStorage } from "./hooks/useLocalStorage";
import ActivityProvider from "./providers/ActivityProvider";
import { AuthProvider } from "./providers/AuthProvider";
// import CounterProvider from "./providers/CounterProvider";

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
        <AuthProvider>
          <Router />
        </AuthProvider>
      </ActivityProvider>
    </BrowserRouter>
  );
};

export default App;
