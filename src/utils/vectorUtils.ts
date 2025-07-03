import type { CompassDirectionType, Coords } from "../types";

export const rotateVector = (coords: Coords, from: CompassDirectionType) => {
  const { x, y } = coords;

  switch (from) {
    case "north":
      return { x, y };
    case "east":
      return { x: -y, y: x };
    case "south":
      return { x: -x, y: -y };
    case "west":
      return { x: y, y: -x };
  }
};

export const vectorToDegrees = ({ x, y }: Coords): number => {
  const radians = Math.atan2(x, -y);
  let degrees = (radians * 180) / Math.PI;

  if (degrees < 0) {
    degrees += 360;
  }

  return degrees;
};

export const generateLeftTurnSteps = (
  radius: number,
  steps: number,
  turn: "left" | "right"
): Coords[] => {
  const result = [];

  const startAngle = Math.PI / 2;
  const endAngle = turn === "left" ? 0 : Math.PI;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = startAngle + (endAngle - startAngle) * t;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    result.push({ x, y });
  }

  return result;
};

export const coordsToKey = (coords: Coords): string => {
  const roundedX = Math.round(coords.x);
  const roundedY = Math.round(coords.y);
  return `${roundedX},${roundedY}`;
};
