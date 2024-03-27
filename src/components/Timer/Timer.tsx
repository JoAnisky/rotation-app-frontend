import { useEffect, useState } from "react";

interface TimerProps {
  counter: number;
  elapsedTime: number;
}

const Timer: React.FC<TimerProps> = ({ counter, elapsedTime }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const remainingTime = counter - elapsedTime;
    setTimeLeft(remainingTime > 0 ? remainingTime : 0);
  }, [counter, elapsedTime]);

  const minutes = Math.floor((timeLeft / 60000) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="timer">
      <span className="digits">{("0" + minutes).slice(-2)}:</span>
      <span className="digits">{("0" + seconds).slice(-2)}</span>
    </div>
  );
};

export default Timer;
