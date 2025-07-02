import type { CarType } from "../../../../types";

import CarIcon from "../../../../assets/car.svg";
import { cn } from "../../../../utils/cn";

type CarViewProps = {
  car: CarType;
};

const CarView = ({ car }: CarViewProps) => {
  return (
    <div
      className="size-16 flex transform"
      style={{ rotate: car.innerRotation + "deg" }}
    >
      <img src={CarIcon} alt="Car" className={cn("size-10 m-auto")} />
    </div>
  );
};

export default CarView;
