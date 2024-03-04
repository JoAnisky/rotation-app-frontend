/**
 * TimeShow component
 */
import React, { useContext } from "react";
import TimeContext from "../../context/TimeContext"; // Ensure the path is correct

const Timer: React.FC = () => {

  // Use useContext hook to access the current context value for TimeContext
  const { time } = useContext(TimeContext);

  return (
    <div className="timer">
      <span className="digits">
        {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
      </span>
      <span className="digits">
        {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
      </span>
    </div>
  );
};

export default Timer;
