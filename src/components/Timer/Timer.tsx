/**
 * TimeShow component
 */
import React, { useContext } from "react";
import TimeContext from "../../context/TimeContext";

const Timer: React.FC = () => {

  // Use useContext hook to access the current context value for TimeContext
  const { turnTime } = useContext(TimeContext);

  // Convert turnTime (remaining time) to minutes and seconds
  const minutes = Math.floor((turnTime / 60000) % 60);
  const seconds = Math.floor((turnTime / 1000) % 60);

  return (
    <div className="timer">
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
