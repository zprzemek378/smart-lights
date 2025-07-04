import { useCallback, useEffect, useRef } from "react";
import type {
  CarsWaitingOnRoadType,
  CarsWaitingQueueType,
  CompassDirectionType,
  LightDirectionType,
  LightSettingsType,
  LineType,
} from "../shared/types";

type UseLightsControlProps = {
  lights: LightSettingsType;
  setLights: React.Dispatch<React.SetStateAction<LightSettingsType>>;
  carsWaitingOnRoad: CarsWaitingOnRoadType;
  carsWaitingQueue: CarsWaitingQueueType;
};

// 0 = off, 2 = on
const lightModes: Record<string, LightSettingsType> = {
  NSforward: {
    north: { basic: 2, left: 0, right: 0 },
    east: { basic: 0, left: 0, right: 0 },
    south: { basic: 2, left: 0, right: 0 },
    west: { basic: 0, left: 0, right: 0 },
  },
  EWforward: {
    north: { basic: 0, left: 0, right: 0 },
    east: { basic: 2, left: 0, right: 0 },
    south: { basic: 0, left: 0, right: 0 },
    west: { basic: 2, left: 0, right: 0 },
  },
  NSleft: {
    north: { basic: 0, left: 2, right: 2 },
    east: { basic: 0, left: 0, right: 2 },
    south: { basic: 0, left: 2, right: 2 },
    west: { basic: 0, left: 0, right: 2 },
  },
  EWleft: {
    north: { basic: 0, left: 0, right: 2 },
    east: { basic: 0, left: 2, right: 2 },
    south: { basic: 0, left: 0, right: 2 },
    west: { basic: 0, left: 2, right: 2 },
  },
};

const MIN_MODE_DURATION_MS = 10000;
const BOOST_TIMEOUT = 80000; //after 80s turn on the light even if is not most crowded
const BOOST_VALUE = 1000;

export const useLightsControl = ({
  lights,
  setLights,
  carsWaitingOnRoad,
  carsWaitingQueue,
}: UseLightsControlProps) => {
  const carsWaitingOnRoadRef = useRef(carsWaitingOnRoad);
  const carsWaitingQueueRef = useRef(carsWaitingQueue);

  const lastModeActivationTimeRef = useRef<Record<string, number>>({
    NSforward: Date.now(),
    EWforward: Date.now(),
    NSleft: Date.now(),
    EWleft: Date.now(),
  });

  const currentModeRef = useRef<keyof typeof lightModes>("");
  const lastModeSwitchTimeRef = useRef(Date.now() - MIN_MODE_DURATION_MS);

  const applyLightModeWithTransitions = useCallback(
    (current: LightSettingsType, target: LightSettingsType) => {
      const updatedPhase: LightSettingsType = JSON.parse(
        JSON.stringify(current)
      );

      const transitions: Array<{
        direction: CompassDirectionType;
        light: LightDirectionType;
        final: 0 | 2;
      }> = [];

      (["north", "east", "south", "west"] as CompassDirectionType[]).forEach(
        (dir) => {
          (["basic", "left", "right"] as LightDirectionType[]).forEach(
            (light) => {
              const currentVal = current[dir][light];
              const targetVal = target[dir][light];
              if (currentVal === targetVal) return;

              if (currentVal === 0 && targetVal === 2) {
                updatedPhase[dir][light] = 1; // off -> on
                transitions.push({ direction: dir, light, final: 2 });
              } else if (currentVal === 2 && targetVal === 0) {
                updatedPhase[dir][light] = 3; // on -> off
                transitions.push({ direction: dir, light, final: 0 });
              } else {
                updatedPhase[dir][light] = targetVal;
              }
            }
          );
        }
      );

      setLights(updatedPhase);

      if (transitions.length > 0) {
        setTimeout(() => {
          setLights((prev) => {
            const next = JSON.parse(JSON.stringify(prev));
            transitions.forEach(({ direction, light, final }) => {
              next[direction][light] = final;
            });
            return next;
          });
        }, 2300);
      }
    },
    [setLights]
  );

  useEffect(() => {
    carsWaitingOnRoadRef.current = carsWaitingOnRoad;
  }, [carsWaitingOnRoad]);

  useEffect(() => {
    carsWaitingQueueRef.current = carsWaitingQueue;
  }, [carsWaitingQueue]);

  const applyMode = useCallback(
    (modeName: keyof typeof lightModes) => {
      applyLightModeWithTransitions(lights, lightModes[modeName]);
    },
    [lights, applyLightModeWithTransitions]
  );

  const getSummaryCount = (
    direction: CompassDirectionType,
    lineType: LineType
  ): number => {
    return (
      carsWaitingOnRoadRef.current[direction][lineType] +
      carsWaitingQueueRef.current[direction][lineType].length
    );
  };

  useEffect(() => {
    const changeLights = () => {
      const now = Date.now();

      const need: Record<string, number> = {
        NSforward:
          getSummaryCount("north", "forward-right") +
          getSummaryCount("south", "forward-right"),
        EWforward:
          getSummaryCount("east", "forward-right") +
          getSummaryCount("west", "forward-right"),
        NSleft:
          getSummaryCount("north", "left") + getSummaryCount("south", "left"),
        EWleft:
          getSummaryCount("east", "left") + getSummaryCount("west", "left"),
      };

      // if a mode hasn't been activated for a long time we give it a boost
      Object.entries(lastModeActivationTimeRef.current).forEach(
        ([key, lastTime]) => {
          if (now - lastTime > BOOST_TIMEOUT) {
            need[key] += BOOST_VALUE;
          }
        }
      );

      if (now - lastModeSwitchTimeRef.current < MIN_MODE_DURATION_MS) {
        return;
      }

      console.log(need);

      const maxKey = Object.entries(need).reduce((maxKey, [key, value]) => {
        return value > need[maxKey] ? key : maxKey;
      }, Object.keys(need)[0]);

      // if the same, don't change
      if (maxKey !== currentModeRef.current) {
        currentModeRef.current = maxKey;
        lastModeSwitchTimeRef.current = now;
        lastModeActivationTimeRef.current[maxKey] = now;

        applyMode(maxKey);
      }
    };

    const interval = setInterval(() => {
      changeLights();
    }, 3000);

    return () => clearInterval(interval);
  }, [applyMode]);
};
