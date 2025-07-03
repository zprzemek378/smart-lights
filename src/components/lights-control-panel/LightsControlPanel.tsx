import { useCallback, useEffect, useState } from "react";
import type {
  CompassDirectionType,
  LightDirectionType,
  LightSettingsType,
} from "../../shared/types";
import { Button } from "../../ui/Button";

type LightsControlPanelProps = {
  lights: LightSettingsType;
  setLights: React.Dispatch<React.SetStateAction<LightSettingsType>>;
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

const modeKeys = Object.keys(lightModes) as Array<keyof typeof lightModes>;

export const LightsControlPanel = ({
  lights,
  setLights,
}: LightsControlPanelProps) => {
  const [modeIndex, setModeIndex] = useState(0);

  const applyLightModeWithTransitions = (
    current: LightSettingsType,
    target: LightSettingsType
  ) => {
    const updatedPhase: LightSettingsType = JSON.parse(JSON.stringify(current));

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
  };

  const applyMode = useCallback(
    (modeName: keyof typeof lightModes) => {
      applyLightModeWithTransitions(lights, lightModes[modeName]);
    },
    [lights]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (modeIndex + 1) % modeKeys.length;
      applyMode(modeKeys[nextIndex]);
      setModeIndex(nextIndex);
    }, 10000); // co 10 sekund

    return () => clearInterval(interval);
  }, [modeIndex, applyMode]);

  return (
    <div className="flex gap-3">
      {Object.keys(lightModes).map((m) => (
        <Button variant="outline" key={m} onClick={() => applyMode(m)}>
          {m}
        </Button>
      ))}
    </div>
  );
};
