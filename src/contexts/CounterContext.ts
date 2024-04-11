import React, { useContext } from "react";

export interface ICounterContext {
  counter: number;
  isActive: boolean;
  isPaused: boolean;
  setIsActive: (isActive: boolean) => void; // Function to set isActive state
  setIsPaused: (isPaused: boolean) => void; // Function to set isPaused state
  setCounter: (counter: number) => void
}

const defaultState: ICounterContext = {
  isActive: false,
  isPaused: true,
  counter : 0,
  setIsActive: () => {}, // Function to set isActive state
  setIsPaused: () => {},
  setCounter: () => {}
};

const CounterContext = React.createContext<ICounterContext>(defaultState);

export default CounterContext;

export const useCounter = () => useContext(CounterContext);
