import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import Header from "../components/layout/Header";
import BackgroundCode from "../components/ui/BackgroundCode";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { gameSetupAtom } from "../stores/gameStore";

function Start() {
  const navigate = useNavigate();

  const gameSetup = useAtomValue(gameSetupAtom);

  const handleStartGame = () => {
    navigate("/game");
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-900">
      <BackgroundCode />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 w-full">
        <Header name={gameSetup.gameName} />

        <main className="mt-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12 text-center"
          >
            <motion.h2
              className="mb-6 font-mono text-5xl font-bold text-green-400"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
            >
              Готовы начать игру?
            </motion.h2>
            <p className="w-lg font-mono text-xl text-gray-300">
              Выберите категории и отвечайте на вопросы за баллы
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Button onClick={handleStartGame}>Начать игру</Button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Start;
