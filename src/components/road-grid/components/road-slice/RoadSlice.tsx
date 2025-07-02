import type { JSX } from "react";
import type {
  ArrowType,
  CompassDirectionType,
  LightSettingsType,
  RoadSliceLinesType,
  SingleLineType,
} from "../../../../types";
import { cn } from "../../../../utils/cn";

import ArrowLeft from "../../../../assets/arrow-left.svg";
import ArrowForwardRight from "../../../../assets/arrow-forward-right.svg";
import TrafficLight from "../../../traffic-light/TrafficLight";

type RoadSliceProps = {
  lines: RoadSliceLinesType;
  lights: LightSettingsType;
  arrow?: ArrowType;
};

const LINES_STYLE = "bg-gray-50";

const DASHED = <div className={cn(LINES_STYLE, "h-8 w-1 mt-4")}></div>;
const SOLID = <div className={cn(LINES_STYLE, "h-16 w-1")}></div>;
const DOUBLE = <div className={cn(LINES_STYLE, "h-16 w-1 ml-0.5")}></div>;

const lineMap: Record<SingleLineType, JSX.Element> = {
  none: <></>,
  dashed: DASHED,
  solid: SOLID,
  double: DOUBLE,
};

const linesRotationMap: Record<CompassDirectionType, string> = {
  north: "rotate-90",
  east: "rotate-180",
  south: "rotate-270",
  west: "",
};

const arrowRotationMap: Record<CompassDirectionType, string> = {
  north: "",
  east: "rotate-90",
  south: "rotate-180",
  west: "rotate-270",
};

const generateLine = (
  type: SingleLineType,
  direction: CompassDirectionType
) => {
  const line = lineMap[type];
  const rotation = linesRotationMap[direction];

  return (
    <div className={cn("absolute size-16 transform z-30", rotation)}>
      {line}
    </div>
  );
};

const RoadSlice = ({ lines, lights, arrow }: RoadSliceProps) => {
  return (
    <div className="bg-gray-950 size-16 flex">
      {(Object.entries(lines) as [CompassDirectionType, SingleLineType][]).map(
        ([direction, lineType]) => generateLine(lineType, direction)
      )}

      {arrow && (
        <div
          className={cn(
            "size-16 transform relative z-40",
            arrowRotationMap[arrow.orientation]
          )}
        >
          <div
            className={cn(
              "absolute top-1",
              arrow.type === "forward-right" ? "-right-14" : "-left-3"
            )}
          >
            {arrow.type === "forward-right" ? (
              <div className="flex items-end gap-1">
                <TrafficLight
                  phase={lights[arrow.orientation].basic}
                  direction="basic"
                />
                <TrafficLight
                  phase={lights[arrow.orientation].right}
                  direction="right"
                />
              </div>
            ) : (
              <TrafficLight
                phase={lights[arrow.orientation].left}
                direction="left"
              />
            )}
          </div>

          <img
            src={arrow.type === "forward-right" ? ArrowForwardRight : ArrowLeft}
            alt="Arrow"
            className="size-10 m-auto"
          />
        </div>
      )}
    </div>
  );
};

export default RoadSlice;
