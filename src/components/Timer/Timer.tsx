
interface TimerProps {
  counter: number;
}

const Timer: React.FC<TimerProps> = ({ counter }) => {


  const minutes = Math.floor((counter / 60000) % 60);
  const seconds = Math.floor((counter / 1000) % 60);

  return (
    <div className="timer">
      <span className="digits">{("0" + minutes).slice(-2)}:</span>
      <span className="digits">{("0" + seconds).slice(-2)}</span>
    </div>
  );
};

export default Timer;
