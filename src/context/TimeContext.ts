import React, { useContext } from "react";

export interface ITimeContext {
  turnTime: number;
  elapsedTime: number;
  isActive: boolean;
  isPaused: boolean;
  start: () => void;
  pauseResume: () => void;
  reset: () => void;
}

export const defaultState: ITimeContext = {
  turnTime: 0,
  elapsedTime: 0,
  isActive: false,
  isPaused: true,
  start: () => {},
  pauseResume: () => {},
  reset: () => {},
};

const TimeContext = React.createContext<ITimeContext>(defaultState);

export default TimeContext;

export const useTime = () => useContext(TimeContext);
