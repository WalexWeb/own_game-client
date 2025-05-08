import { useAtomValue } from "jotai";
import { gameNameAtom } from "../stores/gameStore";
import BackgroundStars from "../components/ui/BackgroundStars";
import BackgroundBlobs from "../components/ui/BackgroundBlobs";
import Header from "../components/layout/Header";

function Question() {
  const gameName = useAtomValue(gameNameAtom);

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-blue-900">
      <BackgroundStars />
      <BackgroundBlobs />

      <div className="z-10">
        <Header name={gameName} />
      </div>
    </div>
  );
}

export default Question;
