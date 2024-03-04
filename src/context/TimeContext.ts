import React, { useContext} from 'react';

export interface ITimeContext {
  time: number;
  isActive: boolean;
  isPaused: boolean;
  start: () => void;
  pauseResume: () => void;
  reset: () => void;
}

export const defaultState: ITimeContext = {
  time: 0,
  isActive: false,
  isPaused: true,
  start: () => {},
  pauseResume: () => {},
  reset: () => {},
};

const TimeContext = React.createContext<ITimeContext>(defaultState);

export default TimeContext;

export const useTime = () => useContext(TimeContext);