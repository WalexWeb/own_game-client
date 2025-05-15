import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import BackgroundCode from "../components/ui/BackgroundCode";
import Header from "../components/layout/Header";
import { gameSetupAtom } from "../stores/gameStore";
import Button from "../components/ui/Button";
import { useEffect } from "react";

const TEAM_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-amber-500",
];

const getRandomColorClass = () => {
  const randomIndex = Math.floor(Math.random() * TEAM_COLORS.length);
  return TEAM_COLORS[randomIndex];
};

const LeaderboardPage = () => {
  const [gameSetup] = useAtom(gameSetupAtom);
  const navigate = useNavigate();

  // Добавляем цвета командам если их нет
  const teamsWithColors = gameSetup.teams.map((team) => ({
    ...team,
    colorClass: getRandomColorClass(),
  }));

  const sortedTeams = [...teamsWithColors].sort((a, b) => b.score - a.score);

  const handleBackToGame = () => {
    navigate("/game");
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-900">
      <BackgroundCode />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 w-full max-w-4xl px-4">
        <Header name="Рейтинг" />

        <main className="mt-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 w-full"
          >
            <div className="mb-6 grid grid-cols-12 gap-2 px-4 font-mono text-sm text-gray-400">
              <div className="col-span-1">#</div>
              <div className="col-span-7">Команда</div>
              <div className="col-span-4 text-right">Очки</div>
            </div>

            {sortedTeams.length > 0 ? (
              <div className="space-y-3">
                {sortedTeams.map((team, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={clsx(
                      "grid grid-cols-12 items-center gap-2 rounded-lg p-4 backdrop-blur-sm",
                      index % 2 === 0 ? "bg-gray-800/80" : "bg-gray-800/60",
                    )}
                  >
                    <div
                      className={clsx(
                        "col-span-1 font-mono font-bold",
                        index < 3 ? "text-green-400" : "text-yellow-400",
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="col-span-7 flex items-center">
                      <div
                        className={`mr-3 h-3 w-3 rounded-full ${team.colorClass}`}
                      />
                      <span className="font-mono text-gray-100">
                        {team.name}
                      </span>
                    </div>
                    <div
                      className={clsx(
                        "col-span-4 text-right font-mono font-bold",
                        index < 3 ? "text-green-400" : "text-yellow-400",
                      )}
                    >
                      {team.score}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center font-mono text-gray-300">
                Нет данных о командах
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Button onClick={handleBackToGame}>Вернуться к игре</Button>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default LeaderboardPage;
