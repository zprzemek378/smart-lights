import type { LightDirectionType, PhaseType } from "../../shared/types";

type TrafficLightProps = {
  phase: PhaseType;
  direction: LightDirectionType;
};

const LIGHTS = [
  {
    id: 0,
    colorOn: "#FF0000",
    colorOff: "#4D0000",
  },
  {
    id: 1,
    colorOn: "#FFFF00",
    colorOff: "#4D4D00",
  },
  {
    id: 2,
    colorOn: "#00FF00",
    colorOff: "#004D00",
  },
];

const PHASE_MAP: Record<PhaseType, [number, number, number]> = {
  0: [1, 0, 0],
  1: [1, 1, 0],
  2: [0, 0, 1],
  3: [0, 1, 0],
};

const TEXT_MAP: Record<LightDirectionType, string> = {
  basic: "",
  left: "⬅",
  right: "⮕",
};

const TrafficLight = ({ phase, direction }: TrafficLightProps) => {
  const lights = direction === "right" ? [LIGHTS[2]] : LIGHTS;

  return (
    <div className="bg-gray-500 rounded flex flex-col justify-between items-center p-1 gap-1">
      {lights.map((l) => (
        <div
          key={l.id}
          className="size-4 rounded-full flex items-center justify-center text-xs text-black leading-none"
          style={{
            backgroundColor: PHASE_MAP[phase][l.id] ? l.colorOn : l.colorOff,
          }}
        >
          {PHASE_MAP[phase][l.id] ? TEXT_MAP[direction] : ""}
        </div>
      ))}
    </div>
  );
};

export default TrafficLight;
