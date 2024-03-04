/**
 * TimeShow component
 */
import React, { useContext } from "react";
import TimeContext from "../../context/TimeContext"; // Ensure the path is correct

const Timer: React.FC = () => {

  // Use useContext hook to access the current context value for TimeContext
  const { elapsedTime, turnTime } = useContext(TimeContext);
  // Calculate remaining time in milliseconds, clamping to 0 if negative
  const remainingTime = Math.max(0, turnTime - elapsedTime);
  
 // Convert remaining time to minutes and seconds
 const minutes = Math.floor((remainingTime / 60000) % 60);
 const seconds = Math.floor((remainingTime / 1000) % 60);

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
