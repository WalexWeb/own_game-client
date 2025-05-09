import { useAtomValue } from "jotai";
import { gameNameAtom } from "../stores/gameStore";
import Header from "../components/layout/Header";
import BackgroundCode from "../components/ui/BackgroundCode";

function Sections() {
  const gameName = useAtomValue(gameNameAtom);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-900">
      <BackgroundCode />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="z-10">
        <Header name={gameName} />
      </div>
    </div>
  );
}

export default Sections;
