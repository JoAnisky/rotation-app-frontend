/**
 * TimeShow component
 */
// import { useContext } from "react";
// import TimeContext from "../../context/TimeContext";

interface TimerProps {
  time: number; // Define the type of time prop
}

const Timer: React.FC<TimerProps> = ({ time }) => {
  // Use useContext hook to access the current context value for TimeContext
  // const { turnTime, elapsedTime } = useContext(TimeContext);

  // const diff = turnTime - elapsedTime;

  // Convert turnTime (remaining time) to minutes and seconds
  // const minutes = Math.floor((diff / 60000) % 60);
  // const seconds = Math.floor((diff / 1000) % 60);

  return (
    <div className="timer">
      {/* <div>
        <p>Elapsed Time : {elapsedTime}</p>
        <p>TurnTime : {turnTime}</p>
      </div> */}
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
