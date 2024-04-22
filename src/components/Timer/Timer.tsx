import { useCallback, useContext, useEffect } from "react";
import CounterContext from "@/contexts/CounterContext";
import { STOPWATCH_API } from "@/routes/api/";

const Timer: React.FC = () => {
  const { counter, isActive, isPaused, setCounter } =
    useContext(CounterContext);

  /**
   * Get counter value (each second)
   */
  const getCounter = useCallback(async () => {
    try {
      const response = await fetch(`${STOPWATCH_API.stopwatchById("1")}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du compteur");
      }

      const data = await response.json();
      setCounter(data.counter);
      console.log("Counter : ", counter);
    } catch (error) {
      console.error("Erreur :", error);
    }
  }, [counter, setCounter]);

  useEffect(() => {
    // Call `getCounter` immediately on component mount
    getCounter();
  }, [counter]);

  // Counter
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        getCounter();
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isPaused, counter]);

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
