export type SingleLineType = "none" | "dashed" | "solid" | "double";
export type CompassDirectionType = "north" | "east" | "south" | "west";

export type RoadSliceLinesType = {
  north: SingleLineType;
  east: SingleLineType;
  south: SingleLineType;
  west: SingleLineType;
};

export type ArrowType = {
  type: "forward-right" | "left";
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

export type CarType = {
  id: string;
  from: CompassDirectionType;
  to: CompassDirectionType;
  coords: Coords;
  direction: CompassDirectionType;
};
