//import Button from "./components/Button";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/router";
import TimeProvider from "./context/TimeProvider";

const App: React.FC = () => {
  return (
    <TimeProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </TimeProvider>
  );
};

export default App;
