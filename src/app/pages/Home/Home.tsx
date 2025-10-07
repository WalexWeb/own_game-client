import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import BackgroundCode from "../../components/ui/BackgroundCode";
import Header from "../../components/layout/Header";
import { useAtom } from "jotai";
import { gameSetupAtom } from "../../stores/gameStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Home = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [setup, setSetup] = useAtom(gameSetupAtom);
  const [currentValue, setCurrentValue] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: "",
    points: 100,
    answerText: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Создание новой игры
  const createNewGame = async (gameName: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/games`, {
        title: gameName,
        status: "CREATED",
      });

      setSetup((prev: typeof setup) => ({
        ...prev,
        gameId: response.data.id,
        gameName: gameName,
      }));

      console.log("Game created:", response.data);
      return response.data.id;
    } catch (error) {
      console.error("Error creating new game:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Добавление категории
  const addCategory = async () => {
    if (currentValue.trim() && setup.gameId) {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${API_URL}/games/${setup.gameId}/categories`,
          {
            name: currentValue,
          },
        );

        setSetup((prev: typeof setup) => {
          const currentCategories = Array.isArray(prev.categories)
            ? prev.categories
            : [];

          return {
            ...prev,
            categories: [
              ...currentCategories,
              {
                id: response.data.id,
                name: currentValue,
                questions: [],
              },
            ],
          };
        });
        setCurrentValue("");
        console.log("Category added:", response.data);
      } catch (error) {
        console.error("Error adding category:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Добавление вопроса
  const addQuestion = async () => {
    if (
      selectedCategory !== null &&
      currentQuestion.questionText.trim() &&
      setup.categories[selectedCategory]?.id
    ) {
      try {
        setIsLoading(true);
        const categoryId = setup.categories[selectedCategory].id;

        const response = await axios.post(
          `${API_URL}/categories/${categoryId}/questions`,
          {
            questionText: currentQuestion.questionText,
            points: currentQuestion.points,
            answerText: currentQuestion.answerText,
          },
        );

        setSetup((prev: typeof setup) => {
          const updatedCategories = [...prev.categories];
          updatedCategories[selectedCategory].questions.push({
            id: response.data.id,
            questionText: currentQuestion.questionText,
            points: currentQuestion.points,
            answerText: currentQuestion.answerText,
            answered: false,
            categoryId: categoryId,
          });
          return { ...prev, categories: updatedCategories };
        });

        setCurrentQuestion({ questionText: "", points: 100, answerText: "" });
        console.log("Question added:", response.data);
      } catch (error) {
        console.error("Error adding question:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Добавление команды
  const addTeam = async () => {
    if (currentValue.trim() && setup.gameId) {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${API_URL}/games/${setup.gameId}/teams`,
          {
            name: currentValue,
          },
        );

        setSetup((prev: typeof setup) => {
          const currentTeams = Array.isArray(prev.teams) ? prev.teams : [];
          return {
            ...prev,
            teams: [
              ...currentTeams,
              {
                id: response.data.id,
                name: currentValue,
                score: 0,
              },
            ],
          };
        });
        setCurrentValue("");
        console.log("Team added:", response.data);
      } catch (error) {
        console.error("Error adding team:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Навигация по шагам
  const toCategoriesStep = () => {
    setSetup((prev: typeof setup) => ({ ...prev, step: "categories" }));
  };

  const toTeamsStep = () => {
    setSetup((prev: typeof setup) => ({ ...prev, step: "teams" }));
    setCurrentValue("");
  };

  const toReviewStep = () => {
    setSetup((prev: typeof setup) => ({ ...prev, step: "review" }));
  };

  const completeSetup = async () => {
    try {
      setIsLoading(true);

      // Активируем игру (меняем статус на ACTIVE)
      await axios.post(`${API_URL}/games/${setup.gameId}/start`);

      navigate("/start");
    } catch (error) {
      console.error("Error completing setup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGame = async () => {
    try {
      const gameId = await createNewGame(setup.gameName);
      if (gameId) {
        toCategoriesStep();
      }
    } catch (error) {
      console.error("Failed to start game creation:", error);
    }
  };

  // Получение общего количества вопросов
  const getTotalQuestions = () => {
    return setup.categories.reduce(
      (total: number, category: { questions: any[] }) => total + category.questions.length,
      0,
    );
  };

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-auto bg-gray-900 md:h-screen">
      <BackgroundCode />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 w-full px-4 py-8 md:max-w-4xl lg:max-w-6xl">
        <Header name="Создание игры" />

        {/* Название игры */}
        {setup.step === "gameName" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto flex w-full max-w-md flex-col items-center px-4"
          >
            <motion.h2 className="mb-4 text-center font-mono text-2xl font-bold text-green-400 sm:text-3xl md:mb-8">
              Введите название игры
            </motion.h2>
            <input
              type="text"
              value={setup.gameName}
              onChange={(e) =>
                setSetup((prev: typeof setup) => ({ ...prev, gameName: e.target.value }))
              }
              className="mb-4 w-full rounded-lg border-2 border-green-400/50 bg-gray-800 p-3 font-mono text-gray-100 focus:border-green-400 focus:outline-none sm:p-4 md:mb-6"
              placeholder="Название игры"
            />
            <Button
              onClick={handleStartGame}
              disabled={!setup.gameName.trim() || isLoading}
            >
              {isLoading ? "Создание..." : "Продолжить"}
            </Button>
          </motion.div>
        )}

        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="font-mono text-green-400">Загрузка...</div>
          </div>
        )}

        {/* Категории и вопросы */}
        {setup.step === "categories" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4"
          >
            <motion.h2 className="mb-6 text-center font-mono text-3xl font-bold text-green-400 sm:text-4xl md:mb-8">
              Добавьте категории и вопросы
            </motion.h2>

            <div className="mx-auto max-w-2xl space-y-6">
              {/* Добавление категории */}
              <div className="space-y-4 rounded-lg bg-gray-800/50 p-4">
                <h3 className="font-mono text-lg text-green-400 sm:text-2xl">
                  Категории
                </h3>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    placeholder="Название категории"
                    className="h-15 flex-1 rounded-lg border-2 border-green-400/50 bg-gray-800 p-3 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                  />
                  <Button
                    onClick={addCategory}
                    disabled={!currentValue.trim() || isLoading}
                    className="w-auto"
                  >
                    Добавить
                  </Button>
                </div>

                {/* Список добавленных категорий */}
                {setup.categories.length > 0 && (
                  <div className="mt-4">
                    <h4 className="mb-2 font-mono text-green-400">
                      Добавленные категории:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {setup.categories.map((cat: { id: number; name: string; questions: any[] }) => (
                        <span
                          key={cat.id}
                          className="rounded bg-green-400/20 px-3 py-1 font-mono text-sm text-green-400"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Добавление вопросов */}
              {setup.categories.length > 0 && (
                <div className="space-y-4 rounded-lg bg-gray-800/50 p-4">
                  <h3 className="font-mono text-lg text-green-400 sm:text-2xl">
                    Вопросы
                  </h3>

                  <select
                    value={selectedCategory ?? ""}
                    onChange={(e) =>
                      setSelectedCategory(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="mb-4 w-full rounded-lg border-2 border-green-400/50 bg-gray-800 p-3 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                  >
                    <option value="">Выберите категорию</option>
                    {setup.categories.map((cat: { id: number; name: string; questions: any[] }, index: number) => (
                      <option key={cat.id} value={index}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  {selectedCategory !== null && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={currentQuestion.questionText}
                        onChange={(e) =>
                          setCurrentQuestion((prev) => ({
                            ...prev,
                            questionText: e.target.value,
                          }))
                        }
                        placeholder="Текст вопроса"
                        className="w-full rounded-lg border-2 border-green-400/50 bg-gray-800 p-3 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          value={currentQuestion.points}
                          onChange={(e) =>
                            setCurrentQuestion((prev) => ({
                              ...prev,
                              points: Number(e.target.value),
                            }))
                          }
                          placeholder="Баллы"
                          min="1"
                          className="rounded-lg border-2 border-green-400/50 bg-gray-800 p-3 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={currentQuestion.answerText}
                          onChange={(e) =>
                            setCurrentQuestion((prev) => ({
                              ...prev,
                              answerText: e.target.value,
                            }))
                          }
                          placeholder="Ответ"
                          className="rounded-lg border-2 border-green-400/50 bg-gray-800 p-3 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                        />
                      </div>
                      <Button
                        onClick={addQuestion}
                        className="w-full"
                        disabled={
                          !currentQuestion.questionText.trim() || isLoading
                        }
                      >
                        Добавить вопрос
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Статистика */}
              {setup.categories.length > 0 && (
                <div className="rounded-lg bg-gray-800/50 p-4">
                  <h3 className="mb-2 font-mono text-lg text-green-400">
                    Статистика:
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="font-mono text-gray-300">
                      Категорий:{" "}
                      <span className="text-green-400">
                        {setup.categories.length}
                      </span>
                    </div>
                    <div className="font-mono text-gray-300">
                      Вопросов:{" "}
                      <span className="text-green-400">
                        {getTotalQuestions()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Навигация */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() =>
                    setSetup((prev: typeof setup) => ({ ...prev, step: "gameName" }))
                  }
                >
                  Назад
                </Button>
                <Button
                  onClick={toTeamsStep}
                  disabled={
                    setup.categories.length === 0 || getTotalQuestions() === 0
                  }
                >
                  Перейти к командам
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Команды */}
        {setup.step === "teams" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto w-full px-4"
          >
            <motion.h2 className="mb-6 text-center font-mono text-2xl font-bold text-green-400 sm:text-3xl md:mb-8">
              Добавьте команды
            </motion.h2>

            <div className="mx-auto max-w-md space-y-6">
              <div className="space-y-4 rounded-lg bg-gray-800/50 p-4">
                <div className="flex flex-col gap-4 sm:flex-col">
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    placeholder="Название команды"
                    className="flex h-15 w-full rounded-lg border-2 border-green-400/50 bg-gray-800 p-3 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                  />
                  <Button
                    onClick={addTeam}
                    className="w-full"
                    disabled={!currentValue.trim() || isLoading}
                  >
                    Добавить
                  </Button>
                </div>

                {/* Список команд */}
                {setup.teams?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="mb-2 font-mono text-lg text-green-400 sm:text-xl">
                      Добавленные команды:
                    </h3>
                    <ul className="space-y-2">
                      {Array.isArray(setup.teams) &&
                        setup.teams.map((team: { id: number; name: string; score: number }) => (
                          <li key={team.id} className="font-mono text-gray-300">
                            {team.name}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() =>
                    setSetup((prev: typeof setup) => ({ ...prev, step: "categories" }))
                  }
                >
                  Назад
                </Button>
                <Button
                  onClick={toReviewStep}
                  disabled={!setup.teams || setup.teams.length === 0}
                >
                  Просмотр и завершение
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Просмотр и завершение */}
        {setup.step === "review" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto w-full px-4"
          >
            <motion.h2 className="mb-6 text-center font-mono text-2xl font-bold text-green-400 sm:text-3xl md:mb-8">
              Проверьте данные
            </motion.h2>

            <div className="mx-auto max-w-4xl space-y-8">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Информация об игре */}
                <div className="rounded-lg bg-gray-800/50 p-4">
                  <h3 className="mb-3 font-mono text-lg font-bold text-green-400 sm:text-xl">
                    Игра:
                  </h3>
                  <p className="font-mono text-gray-300">{setup.gameName}</p>
                  <p className="font-mono text-sm text-gray-400">
                    ID: {setup.gameId}
                  </p>
                </div>

                {/* Категории и вопросы */}
                <div className="rounded-lg bg-gray-800/50 p-4 md:col-span-2">
                  <h3 className="mb-3 font-mono text-lg font-bold text-green-400 sm:text-xl">
                    Категории и вопросы:
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {setup.categories.map((cat) => (
                      <div key={cat.id} className="font-mono text-gray-300">
                        <h4 className="font-bold text-green-400">{cat.name}</h4>
                        <p className="text-sm text-gray-400">
                          ({cat.questions.length} вопросов)
                        </p>
                        <ul className="mt-2 space-y-1">
                          {cat.questions.map((q) => (
                            <li key={q.id} className="text-xs sm:text-sm">
                              <span className="text-green-400">{q.points}</span>{" "}
                              баллов: {q.questionText}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Команды */}
                <div className="rounded-lg bg-gray-800/50 p-4 md:col-span-3">
                  <h3 className="mb-3 font-mono text-lg font-bold text-green-400 sm:text-xl">
                    Команды:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(setup.teams) &&
                      setup.teams.map((team: { id: number; name: string; score: number }) => (
                        <span
                          key={team.id}
                          className="rounded bg-green-400/20 px-3 py-1 font-mono text-gray-300"
                        >
                          {team.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              {/* Итоговая статистика */}
              <div className="rounded-lg bg-gray-800/50 p-4">
                <h3 className="mb-3 font-mono text-lg font-bold text-green-400">
                  Итоговая статистика:
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="font-mono text-gray-300">
                    Категорий:{" "}
                    <span className="text-green-400">
                      {setup.categories.length}
                    </span>
                  </div>
                  <div className="font-mono text-gray-300">
                    Вопросов:{" "}
                    <span className="text-green-400">
                      {getTotalQuestions()}
                    </span>
                  </div>
                  <div className="font-mono text-gray-300">
                    Команд:{" "}
                    <span className="text-green-400">
                      {setup.teams?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button
                  onClick={() =>
                    setSetup((prev: typeof setup) => ({ ...prev, step: "teams" }))
                  }
                >
                  Назад
                </Button>
                <Button onClick={completeSetup} disabled={isLoading}>
                  {isLoading ? "Создание..." : "Начать игру"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
