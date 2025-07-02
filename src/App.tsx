import { useState } from "react";
import RoadGrid from "./components/road-grid/RoadGrid";
import { generateSlices } from "./utils/generateSlicesUtils";
import type {
  CarType,
  CompassDirectionType,
  Coords,
  LightSettingsType,
  TurnType,
} from "./types";

import CarsGrid from "./components/cars-grid/CarsGrid";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  CELL_SIZE,
  FORWARD_STEPS,
  INITIAL_CAR_ROTATION,
  INITIAL_POSITIONS,
  LEFT_STEPS,
  OPPOSITE_DIRECTION,
  PREVIOUS_DIRECTION,
  RIGHT_STEPS,
} from "./constants";
import { rotateVector, vectorToDegrees } from "./utils/vectorUtils";
import { useAnimation } from "./hooks/useAnimation";
import { LightsControlPanel } from "./components/lights-control-panel/LightsControlPanel";

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
    const turn: TurnType =
      validTo === PREVIOUS_DIRECTION[validFrom]
        ? "right"
        : validTo === OPPOSITE_DIRECTION[validFrom]
        ? "forward"
        : "left";
    const newCar: CarType = {
      id,
      from: validFrom,
      to: validTo,
      coords,
      direction,
      turn,
      currentStep: 0,
      innerRotation: INITIAL_CAR_ROTATION[validFrom],
    };

    console.log(newCar);
    setCars((prev) => [...prev, newCar]);
  };

  const makeStep = () => {
    setCars((prev) =>
      prev.flatMap((car) => {
        const step =
          car.turn === "forward"
            ? FORWARD_STEPS[car.currentStep]
            : car.turn === "right"
            ? RIGHT_STEPS[car.currentStep]
            : LEFT_STEPS[car.currentStep];

        if (!step) {
          // TODO wywołać funkcję zapisującą koniec
          console.log(`Samochód ${car.id ?? ""} dojechał do celu.`);
          return [];
        }

        const vector: Coords = rotateVector(step, car.from);

        return {
          ...car,
          innerRotation: vectorToDegrees(vector),
          currentStep: car.currentStep + 1,
          coords: {
            x: car.coords.x + vector.x,
            y: car.coords.y + vector.y,
          },
        };
      })
    );
  };

  const [lights, setLights] = useState<LightSettingsType>({
    north: { basic: 0, left: 0, right: 0 },
    east: { basic: 0, left: 0, right: 0 },
    south: { basic: 0, left: 0, right: 0 },
    west: { basic: 0, left: 0, right: 0 },
  });

  // const changeLights = (
  //   direction: CompassDirectionType,
  //   lightDirection: LightDirectionType,
  //   phase: PhaseType
  // ) => {
  //   setLights((prev) => ({
  //     ...prev,
  //     [direction]: {
  //       ...prev[direction],
  //       [lightDirection]: phase,
  //     },
  //   }));
  // };

  const { startAnimation, stopAnimation } = useAnimation(makeStep);

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
          <RoadGrid slices={generateSlices()} gridSize={12} lights={lights} />
        </div>
        <div className="absolute z-10">
          <CarsGrid cars={cars} gridSize={12} />
        </div>
      </div>

      <LightsControlPanel setLights={setLights} lights={lights} />

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
          onClick={() => createCar(`v${Date.now()}`, inputFrom, inputTo)}
        >
          Add car
        </Button>
        <Button variant="outline" onClick={() => makeStep()}>
          Make step
        </Button>
        <Button variant="outline" onClick={() => startAnimation()}>
          Start animation
        </Button>
        <Button variant="outline" onClick={() => stopAnimation()}>
          Stop animation
        </Button>
      </div>
    </div>
  );
};

export default App;
