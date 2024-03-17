import React, { useContext } from "react";

interface ITimeContext {
  turnTime: number;
  elapsedTime: number;
  isActive: boolean;
  isPaused: boolean;
  start: () => void;
  pauseResume: () => void;
  stop: () => void;
}

export const defaultState: ITimeContext = {
  turnTime: 0,
  elapsedTime: 0,
  isActive: false,
  isPaused: true,
  start: () => {},
  pauseResume: () => {},
  stop: () => {},
};

const TimeContext = React.createContext<ITimeContext>(defaultState);

export default TimeContext;

export const useTime = () => useContext(TimeContext);
