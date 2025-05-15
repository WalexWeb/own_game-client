import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import BackgroundCode from "../components/ui/BackgroundCode";
import Header from "../components/layout/Header";
import { useAtom } from "jotai";
import { useState } from "react";
import clsx from "clsx";
import { gameSetupAtom } from "../stores/gameStore";
import { useNavigate } from "react-router-dom";
import { instance } from "../../api/instance";

type Question = {
  id: number;
  text: string;
  price: number;
  answer: string;
  is_answered: boolean;
};

type Category = {
  id: number;
  name: string;
  questions: Question[];
};

type Team = {
  id: number;
  name: string;
  game_id: number;
  score: number;
  created_at: string;
  updated_at: string | null;
};

const Game = () => {
  const [gameSetup, setGameSetup] = useAtom(gameSetupAtom);
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const fetchTeams = async () => {
    if (!gameSetup.gameId) return;
    try {
      const response = await instance.get<Team[]>(
        `team_service/teams/${gameSetup.gameId}`,
      );
      setGameSetup((prev) => ({
        ...prev,
        teams: response.data,
      }));
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const fetchCategoriesAndQuestions = async () => {
    if (!gameSetup.gameId) return;

    try {
      setIsLoading(true);
      await fetchTeams();

      const categoriesResponse = await instance.get<Category[]>(
        `board_service/categories/game/${gameSetup.gameId}`,
      );

      const categoriesWithQuestions = await Promise.all(
        categoriesResponse.data.map(async (category) => {
          const questionsResponse = await instance.get<Question[]>(
            `board_service/questions/category/${category.id}`,
          );
          return {
            ...category,
            questions: questionsResponse.data.map((q) => ({
              ...q,
              is_answered: q.is_answered || false,
            })),
          };
        }),
      );

      setGameSetup((prev) => ({
        ...prev,
        categories: categoriesWithQuestions,
      }));
    } catch (error) {
      console.error("Error fetching game data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = async () => {
    await fetchCategoriesAndQuestions();
  };

  const handleQuestionClick = (question: Question) => {
    if (question.is_answered) return;
    setSelectedQuestion(question);
    setShowAnswer(false);
    setCurrentAnswer("");
  };

  const revealAnswer = async () => {
    if (!selectedQuestion) return;

    try {
      setIsLoading(true);
      const response = await instance.get(
        `board_service/questions/${selectedQuestion.id}/answer`,
      );
      setCurrentAnswer(response.data.answer);
      setShowAnswer(true);
    } catch (error) {
      console.error("Error fetching answer:", error);
    } finally {
      setIsLoading(false);
    }
  };

const awardPointsToTeam = async (teamId: number) => {
  console.log("Awarding points to team with id:", teamId); // Добавьте для отладки
  if (!selectedQuestion) return;

  try {
    setIsLoading(true);

    // 1. Помечаем вопрос как отвеченный
    await instance.patch(`board_service/questions/${selectedQuestion.id}`, {
      is_answered: true,
    });

    // 2. Начисляем баллы команде
    await instance.post("team_service/scores", {
      team_id: teamId,
      question_id: selectedQuestion.id,
      points: selectedQuestion.price,
    });

    // 3. Обновляем локальное состояние
    setGameSetup((prev) => {
      const updatedTeams = prev.teams?.map((team) =>
        team.id === teamId
          ? { ...team, score: (team.score || 0) + selectedQuestion.price }
          : team
      );

      const updatedCategories = prev.categories?.map((category) => ({
        ...category,
        questions: category.questions.map((q) =>
          q.id === selectedQuestion.id ? { ...q, is_answered: true } : q
        ),
      }));

      return {
        ...prev,
        teams: updatedTeams || [],
        categories: updatedCategories || [],
      };
    });

    // Также обновляем локальное состояние teams
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? { ...team, score: (team.score || 0) + selectedQuestion.price }
          : team
      )
    );

    setSelectedQuestion(null);
    setShowAnswer(false);
  } catch (error) {
    console.error("Error awarding points:", error);
  } finally {
    setIsLoading(false);
  }
};

  const handleLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-900">
      <BackgroundCode />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,0,0.03)_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 w-full max-w-6xl px-4">
        <Header name={gameSetup.gameName || "Своя игра"} />

        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="font-mono text-green-400">Загрузка...</div>
          </div>
        )}

        {gameSetup.step === "gameName" ? (
          <main className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-12 text-center"
            >
              <motion.h2
                className="mb-4 font-mono text-3xl font-bold text-green-400 md:text-4xl"
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
              <p className="mx-auto max-w-md font-mono text-gray-300">
                Выберите категории и отвечайте на вопросы за баллы
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button onClick={startGame}>Начать игру</Button>
            </motion.div>
          </main>
        ) : (
          <div className="mt-8">
            {gameSetup.categories.length > 0 ? (
              <>
                <div className="gird-rows-2 grid grid-cols-2 gap-4">
                  {gameSetup.categories.map((category) => (
                    <div key={category.id} className="flex flex-col">
                      <div className="mb-2 rounded-lg bg-green-500/20 p-3 text-center font-mono font-bold text-green-400">
                        {category.name}
                      </div>
                      <div className="space-y-2">
                        {category.questions.map((question) => (
                          <motion.div
                            key={question.id}
                            whileHover={{
                              scale: question.is_answered ? 1 : 1.05,
                            }}
                            whileTap={{
                              scale: question.is_answered ? 1 : 0.95,
                            }}
                            onClick={() => handleQuestionClick(question)}
                            className={`cursor-pointer rounded-lg p-4 text-center font-mono font-bold transition ${
                              question.is_answered
                                ? "bg-gray-700 text-gray-500"
                                : "bg-gray-800 text-green-400 hover:bg-green-400/10"
                            }`}
                          >
                            {question.is_answered ? "---" : question.price}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleLeaderboard}
                    className={clsx(
                      "cursor-pointer rounded-lg border-2 px-6 py-3 font-mono transition",
                      "border-green-400/50 bg-gray-800 text-green-400",
                      "hover:border-green-400 hover:bg-green-400/10",
                      "focus:ring-2 focus:ring-green-400/50 focus:outline-none",
                    )}
                  >
                    Рейтинг команд
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center font-mono text-gray-300">
                Нет доступных категорий
              </div>
            )}

            {selectedQuestion && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                <div className="relative w-full max-w-2xl rounded-lg bg-gray-800 p-8 shadow-xl">
                  <h3 className="mb-6 font-mono text-2xl font-bold text-green-400">
                    Вопрос за {selectedQuestion.price} баллов
                  </h3>
                  <p className="mb-8 font-mono text-xl text-gray-100">
                    {selectedQuestion.text}
                  </p>

                  {showAnswer ? (
                    <>
                      <div className="mb-6 rounded-lg bg-gray-700 p-4">
                        <h4 className="mb-2 font-mono font-bold text-green-400">
                          Ответ:
                        </h4>
                        <p className="font-mono text-gray-100">
                          {currentAnswer || selectedQuestion.answer}
                        </p>

                        <div className="mt-4">
                          <h4 className="mb-2 font-mono font-bold text-green-400">
                            Начислить баллы команде:
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                            {gameSetup.teams.map((team) => (
                              <motion.div
                                key={team.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => awardPointsToTeam(team.id)}
                                className="cursor-pointer rounded-lg p-3 text-center font-mono font-bold text-gray-300 hover:bg-green-400/10"
                              >
                                {team.name}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <Button onClick={() => setSelectedQuestion(null)}>
                          Закрыть
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-center">
                      <Button onClick={revealAnswer} disabled={isLoading}>
                        {isLoading ? "Загрузка..." : "Показать ответ"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
