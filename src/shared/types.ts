export type SingleLineType = "none" | "dashed" | "solid" | "double";
export type CompassDirectionType = "north" | "east" | "south" | "west";
export type PhaseType = 0 | 1 | 2 | 3;
export type LightDirectionType = "basic" | "left" | "right";

export type RoadSliceLinesType = {
  north: SingleLineType;
  east: SingleLineType;
  south: SingleLineType;
  west: SingleLineType;
};

export type LineType = "forward-right" | "left";

export type ArrowType = {
  type: LineType;
  orientation: CompassDirectionType;
};

export type RoadSliceData = {
  coords: Coords;
  lines: RoadSliceLinesType;
  arrow?: ArrowType;
};

export type Coords = {
  x: number;
  y: number;
};

export type TurnType = "left" | "right" | "forward";

export type CarType = {
  id: string;
  from: CompassDirectionType;
  to: CompassDirectionType;
  coords: Coords;
  direction: CompassDirectionType;
  turn: TurnType;
  currentStep: number;
  innerRotation: number;
};

export type LightSettingsType = Record<
  CompassDirectionType,
  Record<LightDirectionType, PhaseType>
>;

export type CarsWaitingOnRoadType = Record<
  CompassDirectionType,
  Record<LineType, number>
>;

export type CarsWaitingQueueType = Record<
  CompassDirectionType,
  Record<LineType, CarType[]>
>;

type Command =
  | {
      type: "addVehicle";
      vehicleId: string;
      startRoad: string;
      endRoad: string;
    }
  | {
      type: "step";
    };

export type CommandFile = {
  commands: Command[];
};

type Result = {
  leftVehicles: string[];
};

export type ResultFile = {
  stepStatuses: Result[];
};
