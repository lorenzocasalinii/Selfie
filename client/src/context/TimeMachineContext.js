import React, { createContext, useState, useContext, useEffect } from "react";

export const TimeMachineContext = createContext();

export const TimeMachineProvider = ({ children }) => {
  const [time, setTime] = useState(new Date().toISOString());
  const [isTimeMachineActive, setIsTimeMachineActive] = useState(false);

  // Incrementa il tempo ogni secondo
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const newTime = new Date(new Date(prevTime).getTime() + 1000);
        return newTime.toISOString();
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <TimeMachineContext.Provider
      value={{ time, setTime, isTimeMachineActive, setIsTimeMachineActive }}
    >
      {children}
    </TimeMachineContext.Provider>
  );
};

export const useTimeMachine = () => {
  return useContext(TimeMachineContext);
};
