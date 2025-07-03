import RoadSlice from "./components/road-slice/RoadSlice";
import type {
  CarsWaitingType,
  LightSettingsType,
  RoadSliceData,
} from "../../shared/types";
import { CELL_SIZE } from "../../shared/constants";

type RoadGridProps = {
  slices: RoadSliceData[];
  gridSize: number;
  lights: LightSettingsType;
  carsWaiting: CarsWaitingType;
};

const RoadGrid = ({ slices, gridSize, lights, carsWaiting }: RoadGridProps) => {
  return (
    <div
      className="relative bg-green-500"
      style={{ width: gridSize * CELL_SIZE, height: gridSize * CELL_SIZE }}
    >
      {slices.map((slice) => (
        <div
          key={`${slice.coords.x}x${slice.coords.y}`}
          className="absolute"
          style={{
            left: slice.coords.x * CELL_SIZE,
            top: slice.coords.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        >
          <RoadSlice
            lines={slice.lines}
            arrow={slice.arrow}
            lights={lights}
            carsWaiting={carsWaiting}
          />
        </div>
      ))}
    </div>
  );
};

export default RoadGrid;
