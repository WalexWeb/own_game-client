import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import BackgroundCode from "../components/ui/BackgroundCode";
import Header from "../components/layout/Header";
import Button from "../components/ui/Button";
import { instance } from "../../api/instance";
import { gameSetupAtom } from "../stores/gameStore";
import { useAtomValue } from "jotai";

interface ITeam {
  id: number;
  name: string;
  score: number;
}

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const gameSetup = useAtomValue(gameSetupAtom);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        if (!gameSetup.gameId) {
          throw new Error("Game ID is missing");
        }

        console.log("Fetching teams for game:", gameSetup.gameId);

        const response = await instance.get(
          `team_service/teams/game/${gameSetup.gameId}`,
        );
        console.log("Данные с сервера:", response);

        if (!response.data) {
          throw new Error("Empty response from server");
        }

        // Нормализация данных
        let teamsData: ITeam[] = [];

        // Вариант 1: Ответ - массив команд
        if (Array.isArray(response.data)) {
          teamsData = response.data;
        }
        // Вариант 2: Ответ - объект с полем teams
        else if (response.data.teams && Array.isArray(response.data.teams)) {
          teamsData = response.data.teams;
        }
        // Вариант 3: Ответ - объект с полем data (массив команд)
        else if (response.data.data && Array.isArray(response.data.data)) {
          teamsData = response.data.data;
        }
        // Вариант 4: Одиночная команда
        else if (response.data.team && typeof response.data.team === "object") {
          teamsData = [response.data.team];
        }
        // Неизвестный формат
        else {
          throw new Error("Unknown response format");
        }

        // Проверка и нормализация каждой команды
        const normalizedTeams = teamsData.map((team) => ({
          id: team?.id || 0,
          name: team?.name || "Unknown Team",
          score: team?.score || 0,
        }));

        if (normalizedTeams.length === 0) {
          setError("No teams found");
        } else {
          setTeams(normalizedTeams);
          setError(null);
        }
      } catch (err) {
        console.error("Team fetch error:", err);
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
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

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-900">
        <div className="mb-4 font-mono text-red-400">Ошибка: {error}</div>
        <Button onClick={handleBackToGame}>Вернуться к игре</Button>
      </div>
    );
  }

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
                    key={`${team.id}-${index}`}
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
            <button
              onClick={handleBackToGame}
              className={clsx(
                "cursor-pointer rounded-lg border-2 px-6 py-3 font-mono transition",
                "border-green-400/50 bg-gray-800 text-green-400",
                "hover:border-green-400 hover:bg-green-400/10",
                "focus:ring-2 focus:ring-green-400/50 focus:outline-none",
              )}
            >
              Вернуться к игре
            </button>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default LeaderboardPage;
