import { useState } from "react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { instance } from "../../../api/instance";
import { gameNameAtom } from "../../stores/gameStore";
import BackgroundStars from "../../components/ui/BackgroundStars";
import BackgroundBlobs from "../../components/ui/BackgroundBlobs";
import Header from "../../components/layout/Header";
import { container, item } from "../../components/animations/animations";
import Categories from "./Categories/Categories";
import Button from "../../components/ui/Button";

const HomePage = () => {
  const [currentGame, setCurrentGame] = useState(null);

  const [gameName, setGameName] = useAtom(gameNameAtom);

  const createNewGame = async () => {
    try {
      const gameResponse = await instance.post("/game_service/games", {
        name: gameName,
      });

      console.log(gameResponse);
      setCurrentGame(gameResponse.data);
      console.log(currentGame);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-blue-900">
      <BackgroundStars />
      <BackgroundBlobs />

      <div className="z-10">
        <Header name="СВОЯ ИГРА" />

        {/* Основной контент */}
        <main className="mt-10 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="mb-6 text-5xl font-bold text-blue-400">
              Проверь свои знания
            </h2>
            <p className="mb-12 text-xl text-gray-300">
              Классическая викторина в современном формате
            </p>
          </motion.div>

          <motion.div
            className="mb-16 flex flex-col justify-center gap-8"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.input
              type="text"
              placeholder="Введите название"
              onChange={(e) => {
                setGameName(e.target.value);
              }}
              className="rounded-lg border-solid border-blue-500 p-4 text-xl text-gray-100 outline-2 outline-offset-2 outline-blue-500 outline-solid"
              onClick={createNewGame}
              variants={item}
              transition={{ duration: 0.2 }}
            />

            <Button onClick={createNewGame}>Начать игру</Button>
          </motion.div>

          <Categories />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
