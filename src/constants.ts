import type { CompassDirectionType, Coords } from "./types";
import { generateLeftTurnSteps as generateTurnSteps } from "./utils/vectorUtils";

export const CELL_SIZE = 64;
export const STEP_TIME = 1000;

export const OPPOSITE_DIRECTION: Record<
  CompassDirectionType,
  CompassDirectionType
> = {
  north: "south",
  east: "west",
  south: "north",
  west: "east",
};

export const NEXT_DIRECTION: Record<
  CompassDirectionType,
  CompassDirectionType
> = {
  north: "east",
  east: "south",
  south: "west",
  west: "north",
};

export const PREVIOUS_DIRECTION: Record<
  CompassDirectionType,
  CompassDirectionType
> = {
  north: "west",
  west: "south",
  south: "east",
  east: "north",
};

export const INITIAL_POSITIONS: Record<
  CompassDirectionType,
  Partial<Record<CompassDirectionType, Coords>>
> = {
  north: {
    east: { x: 5, y: 0 },
    south: { x: 4, y: 0 },
    west: { x: 4, y: 0 },
  },
  east: {
    north: { x: 11, y: 4 },
    south: { x: 11, y: 5 },
    west: { x: 11, y: 4 },
  },
  south: {
    north: { x: 7, y: 11 },
    east: { x: 7, y: 11 },
    west: { x: 6, y: 11 },
  },
  west: {
    north: { x: 0, y: 6 },
    east: { x: 0, y: 7 },
    south: { x: 0, y: 7 },
  },
};

export const INITIAL_CAR_ROTATION: Record<CompassDirectionType, number> = {
  north: 180,
  east: 270,
  south: 0,
  west: 90,
};

export const FORWARD_STEPS = Array(11).fill({ x: 0, y: 1 });

const LEFT_STEPS_1 = Array(2).fill({ x: 0, y: 1 });
const LEFT_STEPS_2 = generateTurnSteps(0.94, 6, "left");
const LEFT_STEPS_3 = Array(3).fill({ x: 1, y: 0 });

export const LEFT_STEPS = [...LEFT_STEPS_1, ...LEFT_STEPS_2, ...LEFT_STEPS_3];

const RIGHT_STEPS_1 = Array(3).fill({ x: 0, y: 1 });
const RIGHT_STEPS_2 = generateTurnSteps(0.4, 3, "right");
const RIGHT_STEPS_3 = Array(3).fill({ x: -1, y: 0 });

export const RIGHT_STEPS = [
  ...RIGHT_STEPS_1,
  ...RIGHT_STEPS_2,
  ...RIGHT_STEPS_3,
];
