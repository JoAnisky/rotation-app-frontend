import { Dispatch, SetStateAction, useEffect } from 'react';

interface TimerState {
  turnTime: number;
  isActive: boolean;
  isPaused: boolean;
  elapsedTime: number;
}

/**
 * A custom hook for managing a timer.
 * 
 * @param setTimerState - A state setter function from the component using this hook.
 * @param isActive - A boolean indicating whether the timer is active.
 * @param isPaused - A boolean indicating whether the timer is paused.
 * @param getItem - A function to retrieve the stored start time from local storage.
 * @param initialTime - The initial time for the timer in milliseconds.
 */
export const useTimer = (
  setTimerState: Dispatch<SetStateAction<TimerState>>,
  isActive: boolean,
  isPaused: boolean,
  getItem: () => string | null,
  initialTime: number
): void => {
  useEffect(() => {
    let intervalId: number = 0;

    const updateElapsedTime = () => {
      const startTimeString = getItem();
      if (startTimeString) {
        const startTime = parseInt(startTimeString, 10);
        const now = Date.now();
        const elapsed = now - startTime;

        setTimerState(prevState => ({
          ...prevState,
          elapsedTime: elapsed,
          turnTime: Math.max(initialTime - elapsed, 0)
        }));

        if (initialTime - elapsed <= 0) {
          clearInterval(intervalId);
          setTimerState(prevState => ({
            ...prevState,
            isActive: false
          }));
        }
      }
    };

    if (isActive && !isPaused) {
      intervalId = setInterval(updateElapsedTime, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, isPaused, getItem, setTimerState, initialTime]);
};
