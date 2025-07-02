import { CELL_SIZE, STEP_TIME } from "../../constants";
import type { CarType } from "../../types";
import Car from "./components/car-view/CarView";

type CarsGridProps = {
  cars: CarType[];
  gridSize: number;
};

const CarsGrid = ({ cars, gridSize }: CarsGridProps) => {
  return (
    <div
      className="relative"
      style={{ width: gridSize * CELL_SIZE, height: gridSize * CELL_SIZE }}
    >
      {cars.map((car) => (
        <div
          key={`${car.id}`}
          className="absolute transition-all ease-linear"
          style={{
            left: car.coords.x * CELL_SIZE,
            top: car.coords.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            transitionDuration: `${STEP_TIME}ms`,
          }}
        >
          <Car car={car} />
        </div>
      ))}
    </div>
  );
};

export default CarsGrid;
