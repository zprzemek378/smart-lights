import type { CarType, CompassDirectionType } from "../../../../types";

import CarIcon from "../../../../assets/car.svg";
import { cn } from "../../../../utils/cn";

type CarViewProps = {
  car: CarType;
};

const carRotationMap: Record<CompassDirectionType, string> = {
  north: "",
  east: "rotate-90",
  south: "rotate-180",
  west: "rotate-270",
};

const CarView = ({ car }: CarViewProps) => {
  return (
    <div className="size-16 flex">
      <img
        src={CarIcon}
        alt="Car"
        className={cn(
          "size-10 m-auto transform",
          carRotationMap[car.direction]
        )}
      />
    </div>
  );
};

export default CarView;
