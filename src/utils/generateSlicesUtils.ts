import type { RoadSliceData } from "../types";

const addNorthSouthRoad = (
  slices: RoadSliceData[],
  y: number,
  arrows?: "north" | "south" | "none"
) => {
  slices.push(
    {
      coords: { x: 4, y },
      lines: {
        north: "none",
        east: "dashed",
        south: "none",
        west: "solid",
      },
      ...(arrows === "south"
        ? {
            arrow: {
              orientation: "south",
              type: "forward-right",
            },
          }
        : {}),
    },
    {
      coords: { x: 5, y },
      lines: {
        north: "none",
        east: "double",
        south: "none",
        west: "dashed",
      },
      ...(arrows === "south"
        ? {
            arrow: {
              orientation: "south",
              type: "left",
            },
          }
        : {}),
    },
    {
      coords: { x: 6, y },
      lines: {
        north: "none",
        east: "dashed",
        south: "none",
        west: "double",
      },
      ...(arrows === "north"
        ? {
            arrow: {
              orientation: "north",
              type: "left",
            },
          }
        : {}),
    },
    {
      coords: { x: 7, y },
      lines: {
        north: "none",
        east: "solid",
        south: "none",
        west: "dashed",
      },
      ...(arrows === "north"
        ? {
            arrow: {
              orientation: "north",
              type: "forward-right",
            },
          }
        : {}),
    }
  );
};

const addWestEastRoad = (
  slices: RoadSliceData[],
  x: number,
  arrows: "east" | "west" | "none"
) => {
  slices.push(
    {
      coords: { x, y: 4 },
      lines: {
        north: "solid",
        east: "none",
        south: "dashed",
        west: "none",
      },
      ...(arrows === "west"
        ? {
            arrow: {
              orientation: "west",
              type: "forward-right",
            },
          }
        : {}),
    },
    {
      coords: { x, y: 5 },
      lines: {
        north: "dashed",
        east: "none",
        south: "double",
        west: "none",
      },
      ...(arrows === "west"
        ? {
            arrow: {
              orientation: "west",
              type: "left",
            },
          }
        : {}),
    },
    {
      coords: { x, y: 6 },
      lines: {
        north: "double",
        east: "none",
        south: "dashed",
        west: "none",
      },
      ...(arrows === "east"
        ? {
            arrow: {
              orientation: "east",
              type: "left",
            },
          }
        : {}),
    },
    {
      coords: { x, y: 7 },
      lines: {
        north: "dashed",
        east: "none",
        south: "solid",
        west: "none",
      },
      ...(arrows === "east"
        ? {
            arrow: {
              orientation: "east",
              type: "forward-right",
            },
          }
        : {}),
    }
  );
};

const addMiddleRoad = (slices: RoadSliceData[], x: number, y: number) => {
  slices.push({
    coords: { x, y },
    lines: {
      north: "none",
      east: "none",
      south: "none",
      west: "none",
    },
  });
};

export const generateSlices = (): RoadSliceData[] => {
  const slices: RoadSliceData[] = [];

  for (let i = 0; i < 4; i++) {
    addNorthSouthRoad(slices, i, i === 3 ? "south" : "none");
    addWestEastRoad(slices, i, i === 3 ? "east" : "none");

    addNorthSouthRoad(slices, i + 8, i === 0 ? "north" : "none");
    addWestEastRoad(slices, i + 8, i === 0 ? "west" : "none");

    for (let j = 0; j < 4; j++) {
      addMiddleRoad(slices, i + 4, j + 4);
    }
  }

  return slices;
};
