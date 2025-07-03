import { useRef, useEffect } from "react";
import { STEP_TIME } from "../shared/constants";

export const useAnimation = (makeStep: () => void) => {
  const intervalRef = useRef<number | null>(null);

  const startAnimation = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      makeStep();
    }, STEP_TIME);
  };

  const stopAnimation = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAnimation();
  }, []);

  return { startAnimation, stopAnimation };
};
