import { useState } from "react";
import CounterContext, { ICounterContext } from "../contexts/CounterContext";

interface Props {
  children: React.ReactNode;
}

const CounterProvider: React.FC<Props> = ({ children }) => {

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);

  const contextValue: ICounterContext = {
    counter,
    setCounter,
    isActive,
    isPaused,
    setIsActive,
    setIsPaused,
  };

  return (
    <CounterContext.Provider value={contextValue}>
      {children}
    </CounterContext.Provider>
  );
};

export default CounterProvider;
