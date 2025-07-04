import { useEffect, useRef, useState } from "react";
import type {
  CarsWaitingOnRoadType,
  CarsWaitingQueueType,
  CarType,
  CommandFile,
  CompassDirectionType,
  Coords,
  LightSettingsType,
  LineType,
  ResultFile,
  TurnType,
} from "../../shared/types";
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
  STEP_TIME,
} from "../../shared/constants";
import {
  coordsToKey,
  rotateVector,
  vectorToDegrees,
} from "../../utils/vectorUtils";

import RoadGrid from "../road-grid/RoadGrid";
import { generateSlices } from "../../utils/generateSlicesUtils";
import CarsGrid from "../cars-grid/CarsGrid";
import { useLightsControl } from "../../hooks/useLightsControl";
import { Button } from "../../ui/Button";

type SimulationProps = {
  randomMode?: boolean;
  randomTime?: number;
  trafficIntensity?: number;
  commandFile?: CommandFile | null;
  restartSimulation: () => void;
};

const Simulation = ({
  randomMode = false,
  randomTime = 30,
  trafficIntensity = 5,
  commandFile = null,
  restartSimulation,
}: SimulationProps) => {
  const [cars, setCars] = useState<CarType[]>([]);
  const [lights, setLights] = useState<LightSettingsType>({
    north: { basic: 0, left: 0, right: 0 },
    east: { basic: 0, left: 0, right: 0 },
    south: { basic: 0, left: 0, right: 0 },
    west: { basic: 0, left: 0, right: 0 },
  });
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
  const [resultFile, setResultFile] = useState<ResultFile>({
    stepStatuses: [],
  });

  const lightsRef = useRef(lights);
  useEffect(() => {
    lightsRef.current = lights;
  }, [lights]);

  const carsWaitingQueueRef = useRef(carsWaitingQueue);
  useEffect(() => {
    carsWaitingQueueRef.current = carsWaitingQueue;
  }, [carsWaitingQueue]);

  const resultFileRef = useRef(resultFile);
  useEffect(() => {
    resultFileRef.current = resultFile;
  }, [resultFile]);

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

      // if no place - put into queue
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
    const finishedInThisStep: string[] = [];
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
              return;
            }

            const isOccupied = newCars.some(
              (c) =>
                c.coords.x === initialCoords.x && c.coords.y === initialCoords.y
            );

            if (!isOccupied) {
              newQueue[from][lineType] = queue.slice(1);
              carsToAdd.push(car);
            }
          });
        }
      );

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
          console.log(`Car ${car.id ?? ""} arrived at its destination.`);
          finishedInThisStep.push(car.id);
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

    setResultFile((prev) => ({
      stepStatuses: [
        ...prev.stepStatuses,
        { leftVehicles: finishedInThisStep },
      ],
    }));
  };

  const [showRestart, setShowRestart] = useState(false);

  const handleEnd = () => {
    const jsonString = JSON.stringify(resultFileRef.current, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "result.json";
    a.click();

    URL.revokeObjectURL(url);
    setShowRestart(true);
  };

  useLightsControl({ setLights, lights, carsWaitingOnRoad, carsWaitingQueue });

  // RANDOM_MODE
  useEffect(() => {
    if (!randomMode) return;
    let isActive = true;

    const stepInterval = setInterval(() => {
      makeStep();
    }, STEP_TIME);

    const trafficIntensityValid = Math.min(Math.max(trafficIntensity, 1), 10);

    const minDelay = 2000 / trafficIntensityValid;
    const maxDelay = 4500 / trafficIntensityValid;

    const generateRandomCars = () => {
      if (!isActive) return;
      const randomDelay =
        Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      const directions: CompassDirectionType[] = [
        "north",
        "east",
        "south",
        "west",
      ];
      setTimeout(() => {
        if (!isActive) return;
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
    const endTimeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
      isActive = false;
      clearInterval(stepInterval);
      handleEnd();
    }, randomTime * 1000);

    return () => {
      isActive = false;
      clearInterval(stepInterval);
      clearTimeout(endTimeoutId);
    };
  }, [randomMode, randomTime, trafficIntensity]);

  // JSON_MODE
  const [commandIndex, setCommandIndex] = useState(0);

  useEffect(() => {
    if (!commandFile || !commandFile.commands) return;
    if (commandIndex >= commandFile.commands.length) {
      handleEnd();
      return;
    }

    const command = commandFile.commands[commandIndex];

    let timeoutId: ReturnType<typeof setTimeout>;

    if (command.type === "addVehicle") {
      createCar(
        command.vehicleId || crypto.randomUUID(),
        command.startRoad,
        command.endRoad
      );
      timeoutId = setTimeout(() => setCommandIndex((i) => i + 1), 0);
    } else if (command.type === "step") {
      makeStep();
      timeoutId = setTimeout(() => setCommandIndex((i) => i + 1), STEP_TIME);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [commandFile, commandIndex, resultFileRef]);

  useEffect(() => {
    if (commandFile) setCommandIndex(0);
  }, [commandFile]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div
        className="relative m-10"
        style={{
          width: `${CELL_SIZE * 12}px`,
          height: `${CELL_SIZE * 12}px`,
        }}
      >
        {showRestart ? (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <Button
              variant="secondary"
              size="lg"
              onClick={restartSimulation}
              className="text-lg px-8 py-4 bg-white"
            >
              Restart
            </Button>
          </div>
        ) : null}
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
    </div>
  );
};

export default Simulation;
