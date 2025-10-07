import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import BackgroundCode from "../components/ui/BackgroundCode";
import Header from "../components/layout/Header";
import Button from "../components/ui/Button";
import { gameSetupAtom } from "../stores/gameStore";
import { useAtomValue } from "jotai";
import axios from "axios";

interface ITeam {
  id: number;
  name: string;
  score: number;
}

const LeaderboardPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const gameSetup = useAtomValue(gameSetupAtom);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        if (!gameSetup.gameId) {
          throw new Error("Game ID is missing");
        }

        const response = await axios.get(
          `${API_URL}/games/${gameSetup.gameId}/ranking`,
        );

        if (Array.isArray(response.data)) {
          setTeams(response.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Ranking fetch error:", err);
        setError("Ошибка загрузки рейтинга");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, [gameSetup.gameId]);

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  const handleBackToGame = () => navigate("/game");

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
        <div className="font-mono text-green-400">Загрузка рейтинга...</div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-auto bg-gray-900">
      <BackgroundCode />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 w-full max-w-4xl px-4 py-8">
        <Header name="Рейтинг команд" />

        <main className="mt-8 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 w-full"
          >
            {error ? (
              <div className="text-center font-mono text-red-400">{error}</div>
            ) : (
              <>
                <div className="mb-6 grid grid-cols-12 gap-2 px-4 font-mono text-sm text-gray-400">
                  <div className="col-span-1">#</div>
                  <div className="col-span-7">Команда</div>
                  <div className="col-span-4 text-right">Очки</div>
                </div>

                <div className="space-y-3">
                  {sortedTeams.map((team, index) => (
                    <motion.div
                      key={team.id}
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
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button onClick={handleBackToGame}>Вернуться к игре</Button>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default LeaderboardPage;
