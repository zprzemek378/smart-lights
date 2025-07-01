import { CELL_SIZE } from "../../constants";
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
          className="absolute"
          style={{
            left: car.coords.x * CELL_SIZE,
            top: car.coords.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        >
          <Car car={car} />
        </div>
      ))}
    </div>
  );
};

export default CarsGrid;
