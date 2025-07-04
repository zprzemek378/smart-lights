import { useState } from "react";
import Simulation from "./components/simulation/Simulation";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import JsonReader from "./components/json-reader/JsonReader";
import type { CommandFile } from "./shared/types";

const App = () => {
  const [mode, setMode] = useState<"json" | "random" | null>(null);
  const [randomTime, setRandomTime] = useState(30);
  const [trafficIntensity, setTrafficIntensity] = useState(5);
  const [startRandom, setStartRandom] = useState(false);
  const [commandFile, setCommandFile] = useState<CommandFile | null>(null);
  const [simulationKey, setSimulationKey] = useState(0);

  const restartSimulation = () => {
    setMode(null);
    setRandomTime(30);
    setTrafficIntensity(5);
    setStartRandom(false);
    setCommandFile(null);
    setSimulationKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      {!commandFile && !startRandom && (
        <div className="flex gap-4">
          <Button
            variant={mode === "json" ? "default" : "outline"}
            onClick={() => {
              setMode("json");
            }}
          >
            JSON file
          </Button>
          <Button
            variant={mode === "random" ? "default" : "outline"}
            onClick={() => {
              setMode("random");
            }}
          >
            Random simulation
          </Button>
        </div>
      )}

      {mode === "json" && !commandFile && !startRandom && (
        <div className="flex flex-col gap-4 items-center">
          <JsonReader setCommandFile={setCommandFile} />
        </div>
      )}

      {mode === "random" && !commandFile && !startRandom && (
        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min={1}
              value={randomTime}
              onChange={(e) => setRandomTime(Number(e.target.value))}
              className="w-24"
            />
            <span>seconds</span>
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="intensity">Traffic intensity</label>
            <Input
              id="intensity"
              type="number"
              min={1}
              max={10}
              value={trafficIntensity}
              onChange={(e) => setTrafficIntensity(Number(e.target.value))}
              className="w-16"
            />
          </div>
          <Button onClick={() => setStartRandom(true)}>Start</Button>
        </div>
      )}

      {mode === "json" && commandFile && (
        <Simulation
          commandFile={commandFile}
          key={"json-" + simulationKey}
          restartSimulation={restartSimulation}
        />
      )}

      {mode === "random" && startRandom && (
        <Simulation
          randomMode={true}
          randomTime={randomTime}
          trafficIntensity={trafficIntensity}
          key={"random-" + simulationKey}
          restartSimulation={restartSimulation}
        />
      )}
    </div>
  );
};

export default App;
