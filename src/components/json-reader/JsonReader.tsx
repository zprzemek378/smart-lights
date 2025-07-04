import type { CommandFile } from "../../shared/types";
import { Input } from "../../ui/Input";

type JsonReaderProps = {
  setCommandFile: React.Dispatch<React.SetStateAction<CommandFile | null>>;
};

const JsonReader = ({ setCommandFile }: JsonReaderProps) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        setCommandFile(parsed);
      } catch (err) {
        console.error("Error parsing JSON:", err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Input
      type="file"
      accept=".json"
      onChange={handleFileUpload}
      className="cursor-pointer"
    />
  );
};

export default JsonReader;
