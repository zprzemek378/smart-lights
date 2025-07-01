import { useState } from "react";
import RoadGrid from "./components/road-grid/RoadGrid";
import { generateSlices } from "./utils/generateSlicesUtils";
import type { CarType, CompassDirectionType, Coords } from "./types";

import CarsGrid from "./components/cars-grid/CarsGrid";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { CELL_SIZE } from "./constants";

const INITIAL_POSITIONS: Record<
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

const OPPOSITE_DIRECTION: Record<CompassDirectionType, CompassDirectionType> = {
  north: "south",
  east: "west",
  south: "north",
  west: "east",
};

const DIRECTION_TO_COORDS: Record<CompassDirectionType, Coords> = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

const App = () => {
  const [inputFrom, setInputFrom] = useState<string>("");
  const [inputTo, setInputTo] = useState<string>("");

  const [cars, setCars] = useState<CarType[]>([]);

  const createCar = (id: string, from: string, to: string) => {
    if (
      !["north", "east", "south", "west"].includes(from) ||
      !["north", "east", "south", "west"].includes(to)
    ) {
      console.error("Enter valid directions");
      return;
    }
    if (from === to) {
      console.error('"From" and "To" are the same');
      return;
    }

    const validFrom: CompassDirectionType = from as CompassDirectionType;
    const validTo: CompassDirectionType = to as CompassDirectionType;

    const coords: Coords = INITIAL_POSITIONS[validFrom][validTo]!;
    const direction: CompassDirectionType = OPPOSITE_DIRECTION[validFrom];
    const newCar: CarType = {
      id,
      from: validFrom,
      to: validTo,
      coords,
      direction,
    };
    setCars((prev) => [...prev, newCar]);
  };

  const makeStep = () => {
    setCars((prev) =>
      prev.map((car) => {
        // const newCoords
        return {
          ...car,
          coords: {
            x: car.coords.x + DIRECTION_TO_COORDS[car.direction].x,
            y: car.coords.y + DIRECTION_TO_COORDS[car.direction].y,
          },
        };
      })
    );
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <div
        className="relative"
        style={{
          width: `${CELL_SIZE * 12}px`,
          height: `${CELL_SIZE * 12}px`,
        }}
      >
        <div className="absolute z-0">
          <RoadGrid slices={generateSlices()} gridSize={12} />
        </div>
        <div className="absolute z-10">
          <CarsGrid cars={cars} gridSize={12} />
        </div>
      </div>

      <div className="flex flex-col gap-4 ">
        <Input
          placeholder="From"
          value={inputFrom}
          onChange={(e) => setInputFrom(e.currentTarget.value)}
        />
        <Input
          placeholder="To"
          value={inputTo}
          onChange={(e) => setInputTo(e.currentTarget.value)}
        />
        <Button
          variant="outline"
          onClick={() => createCar(`v${Date.now}`, inputFrom, inputTo)}
        >
          Add car
        </Button>

        <Button variant="outline" onClick={() => makeStep()}>
          Make step
        </Button>
      </div>
    </div>
  );
};

export default App;
