import { useState, useRef, useCallback, useEffect } from "react";

export const useTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    const startTime = Date.now() - time;
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTime);
    }, 10);
  }, [isRunning, time]);

  const stop = useCallback(() => {
    if (!isRunning) return;

    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { time, isRunning, start, stop, reset };
};
