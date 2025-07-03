import { useState, useRef, useEffect } from "react";
import RoadGrid from "./components/road-grid/RoadGrid";
import { generateSlices } from "./utils/generateSlicesUtils";
import type {
  CarsWaitingOnRoadType,
  CarsWaitingQueueType,
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

  const [carsWaitingOnRoad, setCarsWaitingOnRoad] =
    useState<CarsWaitingOnRoadType>({
      north: {
        "forward-right": 0,
        left: 0,
      },
      east: {
        "forward-right": 0,
        left: 0,
      },
      south: {
        "forward-right": 0,
        left: 0,
      },
      west: {
        "forward-right": 0,
        left: 0,
      },
    });

  const [carsWaitingQueue, setCarsWaitingQueue] =
    useState<CarsWaitingQueueType>({
      north: {
        "forward-right": [],
        left: [],
      },
      east: {
        "forward-right": [],
        left: [],
      },
      south: {
        "forward-right": [],
        left: [],
      },
      west: {
        "forward-right": [],
        left: [],
      },
    });

  const carsWaitingQueueRef = useRef(carsWaitingQueue);
  useEffect(() => {
    carsWaitingQueueRef.current = carsWaitingQueue;
  }, [carsWaitingQueue]);

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

      if (
        prev.some((c) => c.coords.x === coords.x && c.coords.y === coords.y)
      ) {
        const lineType: LineType = turn === "left" ? "left" : "forward-right";

        setCarsWaitingQueue((prevQueue) => ({
          ...prevQueue,
          [validFrom]: {
            ...prevQueue[validFrom],
            [lineType]: [...prevQueue[validFrom][lineType], newCar],
          },
        }));

        return prev;
      }

      return [...prev, newCar];
    });
  };

  const makeStep = () => {
    setCars((prev) => {
      let newCars = [...prev];
      const newWaiting: CarsWaitingOnRoadType = {
        north: { "forward-right": 0, left: 0 },
        east: { "forward-right": 0, left: 0 },
        south: { "forward-right": 0, left: 0 },
        west: { "forward-right": 0, left: 0 },
      };

      newCars.forEach((car) => {
        if (car.currentStep < 4) {
          const from = car.from;
          const lineType: "left" | "forward-right" =
            car.turn === "left" ? "left" : "forward-right";
          newWaiting[from][lineType] += 1;
        }
      });

      setCarsWaitingOnRoad(newWaiting);

      const newQueue = { ...carsWaitingQueueRef.current };

      const carsToAdd: CarType[] = [];

      (["north", "east", "south", "west"] as CompassDirectionType[]).forEach(
        (from) => {
          (["left", "forward-right"] as LineType[]).forEach((lineType) => {
            const queue = newQueue[from][lineType];
            if (queue.length === 0) return;

            const car = queue[0];
            const initialCoords = INITIAL_POSITIONS[car.from][car.to];

            if (!initialCoords) {
              console.log("dziwne, nie ma initialCoords");
              return;
            }

            const isOccupied = newCars.some(
              (c) =>
                c.coords.x === initialCoords.x && c.coords.y === initialCoords.y
            );

            if (!isOccupied) {
              console.log("wypuszczamy samochod ", car);
              newQueue[from][lineType] = queue.slice(1);
              carsToAdd.push(car);
            }
          });
        }
      );

      // Aktualizacja kolejki
      setCarsWaitingQueue(newQueue);

      newCars = [...newCars, ...carsToAdd];

      return newCars.flatMap((car) => {
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
          newCars.some(
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
            carsWaitingOnRoad={carsWaitingOnRoad}
            carsWaitingQueue={carsWaitingQueue}
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
