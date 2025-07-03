import { useState, useRef, useEffect } from "react";
import RoadGrid from "./components/road-grid/RoadGrid";
import { generateSlices } from "./utils/generateSlicesUtils";
import type {
  CarsWaitingType,
  CarType,
  CompassDirectionType,
  Coords,
  LightSettingsType,
  LineType,
  TurnType,
} from "./shared/types";
import CarsGrid from "./components/cars-grid/CarsGrid";
import { Button } from "./ui/Button";
import {
  CELL_SIZE,
  FORWARD_STEPS,
  INITIAL_CAR_ROTATION,
  INITIAL_POSITIONS,
  LEFT_STEPS,
  OPPOSITE_DIRECTION,
  POSITIONS_TO_LIGHTS,
  PREVIOUS_DIRECTION,
  RIGHT_STEPS,
} from "./shared/constants";
import {
  coordsToKey,
  rotateVector,
  vectorToDegrees,
} from "./utils/vectorUtils";
import { useAnimation } from "./hooks/useAnimation";
import { LightsControlPanel } from "./components/lights-control-panel/LightsControlPanel";

const App = () => {
  const [cars, setCars] = useState<CarType[]>([]);

  const [lights, setLights] = useState<LightSettingsType>({
    north: { basic: 0, left: 0, right: 0 },
    east: { basic: 0, left: 0, right: 0 },
    south: { basic: 0, left: 0, right: 0 },
    west: { basic: 0, left: 0, right: 0 },
  });

  const lightsRef = useRef(lights);

  useEffect(() => {
    lightsRef.current = lights;
  }, [lights]);

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

    setCars((prev) => {
      if (
        prev.some((c) => c.coords.x === coords.x && c.coords.y === coords.y)
      ) {
        console.log("This place is already occupied");
        return prev;
      }

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

      return [...prev, newCar];
    });
  };

  const [carsWaiting, setCarsWaiting] = useState<CarsWaitingType>({
    north: {
      "forward-right": {
        queue: 0,
        road: 0,
      },
      left: {
        queue: 0,
        road: 0,
      },
    },
    east: {
      "forward-right": {
        queue: 0,
        road: 0,
      },
      left: {
        queue: 0,
        road: 0,
      },
    },
    south: {
      "forward-right": {
        queue: 0,
        road: 0,
      },
      left: {
        queue: 0,
        road: 0,
      },
    },
    west: {
      "forward-right": {
        queue: 0,
        road: 0,
      },
      left: {
        queue: 0,
        road: 0,
      },
    },
  });

  const makeStep = () => {
    setCars((prev) => {
      const newWaiting: CarsWaitingType = {
        north: {
          "forward-right": { queue: 0, road: 0 },
          left: { queue: 0, road: 0 },
        },
        east: {
          "forward-right": { queue: 0, road: 0 },
          left: { queue: 0, road: 0 },
        },
        south: {
          "forward-right": { queue: 0, road: 0 },
          left: { queue: 0, road: 0 },
        },
        west: {
          "forward-right": { queue: 0, road: 0 },
          left: { queue: 0, road: 0 },
        },
      };

      prev.forEach((car) => {
        if (car.currentStep < 4) {
          const from = car.from;
          const lineType: LineType =
            car.turn === "left" ? "left" : "forward-right";

          newWaiting[from][lineType].road += 1;
        }
      });

      setCarsWaiting((prevWaiting) => {
        const merged: CarsWaitingType = {
          north: {
            "forward-right": {
              queue: prevWaiting.north["forward-right"].queue,
              road: newWaiting.north["forward-right"].road,
            },
            left: {
              queue: prevWaiting.north.left.queue,
              road: newWaiting.north.left.road,
            },
          },
          east: {
            "forward-right": {
              queue: prevWaiting.east["forward-right"].queue,
              road: newWaiting.east["forward-right"].road,
            },
            left: {
              queue: prevWaiting.east.left.queue,
              road: newWaiting.east.left.road,
            },
          },
          south: {
            "forward-right": {
              queue: prevWaiting.south["forward-right"].queue,
              road: newWaiting.south["forward-right"].road,
            },
            left: {
              queue: prevWaiting.south.left.queue,
              road: newWaiting.south.left.road,
            },
          },
          west: {
            "forward-right": {
              queue: prevWaiting.west["forward-right"].queue,
              road: newWaiting.west["forward-right"].road,
            },
            left: {
              queue: prevWaiting.west.left.queue,
              road: newWaiting.west.left.road,
            },
          },
        };

        return merged;
      });

      return prev.flatMap((car) => {
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

        // if red light, dont move

        const carLights = POSITIONS_TO_LIGHTS[coordsToKey(car.coords)];

        const currentLightsState: LightSettingsType = lightsRef.current;

        // basic and left light
        if (carLights && currentLightsState[carLights[0]][carLights[1]] !== 2) {
          // conditional arrow
          if (
            car.turn !== "right" ||
            currentLightsState[carLights[0]].right !== 2
          ) {
            return car;
          }
        }

        const vector: Coords = rotateVector(step, car.from);

        const newCoords: Coords = {
          x: car.coords.x + vector.x,
          y: car.coords.y + vector.y,
        };

        if (
          prev.some(
            (c) => c.coords.x === newCoords.x && c.coords.y === newCoords.y
          )
        ) {
          return car;
        }

        return {
          ...car,
          innerRotation: vectorToDegrees(vector),
          currentStep: car.currentStep + 1,
          coords: newCoords,
        };
      });
    });
  };

  useEffect(() => {
    // let timeoutId: ReturnType<typeof setTimeout>;

    const generateRandomCars = () => {
      const minDelay = 500;
      const maxDelay = 2000;

      const randomDelay =
        Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

      const directions: CompassDirectionType[] = [
        "north",
        "east",
        "south",
        "west",
      ];

      setTimeout(() => {
        const fromIndex = Math.floor(Math.random() * directions.length);
        const from = directions[fromIndex];
        const remainingDirections = directions.filter(
          (_, i) => i !== fromIndex
        );
        const to =
          remainingDirections[
            Math.floor(Math.random() * remainingDirections.length)
          ];
        createCar(crypto.randomUUID(), from, to);
        generateRandomCars();
      }, randomDelay);
    };
    generateRandomCars();
  }, []);

  const { startAnimation, stopAnimation } = useAnimation(makeStep);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div
        className="relative m-10"
        style={{
          width: `${CELL_SIZE * 12}px`,
          height: `${CELL_SIZE * 12}px`,
        }}
      >
        <div className="absolute z-0">
          <RoadGrid
            slices={generateSlices()}
            gridSize={12}
            lights={lights}
            carsWaiting={carsWaiting}
          />
        </div>
        <div className="absolute z-10">
          <CarsGrid cars={cars} gridSize={12} />
        </div>
      </div>

      <LightsControlPanel setLights={setLights} lights={lights} />

      <div className="flex flex-col gap-4 ">
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
