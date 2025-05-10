import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import BackgroundCode from "../components/ui/BackgroundCode";
import Header from "../components/layout/Header";
import { gameNameAtom, teamsAtom } from "../stores/gameStore";
import { useEffect } from "react";
import { instance } from "../../api/instance";
import { ITeam } from "../../types/ITeam";

interface ITeamBase {
  id: number;
  name: string;
  score: number;
}

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

const assignColorsToTeams = (teams: ITeamBase[]): ITeam[] => {
  return teams.map((team) => ({
    ...team,
    colorClass: getRandomColorClass(),
  }));
};

const LeaderboardPage = () => {
  const [gameName] = useAtomValue(gameNameAtom);
  const [teams, setTeams] = useAtom(teamsAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Получаем команды без цветов
        const response = await instance.get(
          `/teams?game=${encodeURIComponent(gameName)}`,
        );
        const teamsWithoutColors: ITeamBase[] = response.data;

        // Добавляем цвета
        const teamsWithColors = assignColorsToTeams(teamsWithoutColors);

        setTeams(teamsWithColors);
        console.log("Команды получены и цвета назначены:", teamsWithColors);
      } catch (error) {
        console.error("Ошибка при получении команд:", error);

        // Если нет команд, создаем дефолтные
        if (teams.length === 0) {
          const defaultTeams = assignColorsToTeams([
            { id: 1, name: "Masters", score: 1200 },
            { id: 2, name: "Ninjas", score: 950 },
            { id: 3, name: "Wizards", score: 800 },
            { id: 4, name: "Legends", score: 750 },
            { id: 5, name: "Heroes", score: 600 },
          ]);
          setTeams(defaultTeams);
        }
      }
    };

    fetchTeams();
  }, [gameName, setTeams, teams.length]);

  const handleBackToGame = () => {
    navigate("/game");
  };

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-900">
      <BackgroundCode />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 w-full max-w-4xl px-4">
        <Header name="Рейтинг команд" />

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
