/**
 * TimeShow component
 */
import React from "react";
import { useTime } from "../../context/TimeContext";

const Timer: React.FC = () => {

  // Use useContext hook to access the current context value for TimeContext
  // const { turnTime, elapsedTime } = useContext(TimeContext);
  const { turnTime, elapsedTime } = useTime();

  const diff = turnTime - elapsedTime;
  
  // Convert turnTime (remaining time) to minutes and seconds
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return (
    <div className="timer">
      <div>
        <p>Elapsed Time : {elapsedTime}</p>
        <p>TurnTime : {turnTime}</p>
      </div>
      <span className="digits">
        {("0" + minutes).slice(-2)}:
      </span>
      <span className="digits">
        {("0" + seconds).slice(-2)}
      </span>
    </div>
  );
};

export default Timer;
