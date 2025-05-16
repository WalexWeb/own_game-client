import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import BackgroundCode from "../../components/ui/BackgroundCode";
import Header from "../../components/layout/Header";
import { useAtom } from "jotai";
import { gameSetupAtom } from "../../stores/gameStore";
import { instance } from "../../../api/instance";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [setup, setSetup] = useAtom(gameSetupAtom);
  const [currentValue, setCurrentValue] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    price: 100,
    answer: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentGameId, setCurrentGameId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toCategoriesStep = () => {
    setSetup((prev) => ({ ...prev, step: "categories" }));
  };
  const createNewGame = async (gameName: string) => {
    try {
      setIsLoading(true);
      const gameResponse = await instance.post("/game_service/games", {
        name: gameName,
      });
      setCurrentGameId(gameResponse.data.id);
      setSetup((prev) => ({ ...prev, gameId: gameResponse.data.id }));
      setIsLoading(false);
      console.log(gameResponse.data);
      return gameResponse.data.id;
    } catch (error) {
      console.error("Error creating new game:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const addCategory = async () => {
    if (currentValue.trim() && currentGameId) {
      try {
        setIsLoading(true);
        const categoryResponse = await instance.post(
          "/board_service/categories",
          {
            name: currentValue,
            game_id: currentGameId,
          },
        );

        setSetup((prev) => {
          const currentCategories = Array.isArray(prev.categories)
            ? prev.categories
            : [];

          return {
            ...prev,
            categories: [
              ...currentCategories,
              {
                id: categoryResponse.data.id,
                name: currentValue,
                questions: [],
              },
            ],
          };
        });
        setCurrentValue("");
        console.log(categoryResponse);
      } catch (error) {
        console.error("Error adding category:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const addQuestion = async () => {
    if (
      selectedCategory !== null &&
      currentQuestion.text.trim() &&
      setup.categories[selectedCategory]?.id
    ) {
      try {
        setIsLoading(true);
        const questionResponse = await instance.post(
          "/board_service/questions",
          {
            text: currentQuestion.text,
            price: currentQuestion.price,
            answer: currentQuestion.answer,
            category_id: setup.categories[selectedCategory].id,
          },
        );

        setSetup((prev) => {
          const updatedCategories = [...prev.categories];
          updatedCategories[selectedCategory].questions.push({
            // @ts-ignore
            id: questionResponse.data.id,
            text: currentQuestion.text,
            price: currentQuestion.price,
            answer: currentQuestion.answer,
          });
          return { ...prev, categories: updatedCategories };
        });
        setCurrentQuestion({ text: "", price: 100, answer: "" });
        console.log(currentQuestion);
      } catch (error) {
        console.error("Error adding question:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toTeamsStep = () => {
    setSetup((prev) => ({ ...prev, step: "teams" }));
    setCurrentValue("");
  };

  const addTeam = async () => {
    if (currentValue.trim() && currentGameId) {
      try {
        setIsLoading(true);
        const teamResponse = await instance.post("/team_service/teams", {
          name: currentValue,
          game_id: currentGameId,
          score: 0,
        });

        // @ts-ignore
        setSetup((prev) => {
          const currentTeams = Array.isArray(prev.teams) ? prev.teams : [];
          return {
            ...prev,
            teams: [
              ...currentTeams,
              {
                name: currentValue,
                score: 0,
              },
            ],
          };
        });
        setCurrentValue("");
        console.log(teamResponse.data);
      } catch (error) {
        console.error("Error adding team:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toReviewStep = () => {
    setSetup((prev) => ({ ...prev, step: "review" }));
  };

  const completeSetup = async () => {
    try {
      setIsLoading(true);
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
                setSetup((prev) => ({ ...prev, gameName: e.target.value }))
              }
              className="mb-4 w-lg rounded-lg border-2 border-green-400/50 bg-gray-800 p-3 font-mono text-gray-100 focus:border-green-400 focus:outline-none sm:p-4 md:mb-6"
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
                    disabled={!currentValue.trim()}
                    className="w-auto"
                  >
                    Добавить
                  </Button>
                </div>
              </div>

              {setup.categories.length > 0 && (
                <div className="space-y-4 rounded-lg bg-gray-800/50 p-4">
                  <h3 className="font-mono text-lg text-green-400 sm:text-2xl">
                    Вопросы
                  </h3>
                  <select
                    onChange={(e) =>
                      setSelectedCategory(Number(e.target.value))
                    }
                    className="mb-4 w-full rounded-lg border-2 border-green-400/50 bg-gray-800 p-3 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                  >
                    <option value="">Выберите категорию</option>
                    {setup.categories.map((cat, index) => (
                      <option key={index} value={index}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  {selectedCategory !== null && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={currentQuestion.text}
                        onChange={(e) =>
                          setCurrentQuestion((prev) => ({
                            ...prev,
                            text: e.target.value,
                          }))
                        }
                        placeholder="Текст вопроса"
                        className="w-full rounded-lg border-2 border-green-400/50 bg-gray-800 p-3 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          value={currentQuestion.price}
                          onChange={(e) =>
                            setCurrentQuestion((prev) => ({
                              ...prev,
                              price: Number(e.target.value),
                            }))
                          }
                          placeholder="Стоимость"
                          className="rounded-lg border-2 border-green-400/50 bg-gray-800 p-3 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={currentQuestion.answer}
                          onChange={(e) =>
                            setCurrentQuestion((prev) => ({
                              ...prev,
                              answer: e.target.value,
                            }))
                          }
                          placeholder="Ответ"
                          className="rounded-lg border-2 border-green-400/50 bg-gray-800 p-3 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                        />
                      </div>
                      <Button
                        onClick={addQuestion}
                        className="w-full"
                        disabled={!currentQuestion.text.trim()}
                      >
                        Добавить вопрос
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col">
                <Button
                  onClick={() =>
                    setSetup((prev) => ({ ...prev, step: "gameName" }))
                  }
                  className="h-16"
                >
                  Назад
                </Button>
                <Button
                  onClick={toTeamsStep}
                  className="h-16"
                  disabled={setup.categories.length === 0}
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
              <div className="space-y-4 rounded-lg items-center bg-gray-800/50 p-4">
                <div className="flex flex-col gap-4 items-center sm:flex-col">
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    placeholder="Название команды"
                    className="flex h-15 w-full rounded-lg border-2 border-green-400/50 bg-gray-800 p-3 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                  />
                  <Button onClick={addTeam} className="w-full" disabled={!currentValue.trim()}>
                    Добавить
                  </Button>
                </div>

                {setup.teams?.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-mono text-lg text-green-400 sm:text-xl">
                      Добавленные команды:
                    </h3>
                    <ul className="space-y-2">
                      {Array.isArray(setup.teams) &&
                        setup.teams.map((team, index) => (
                          <li key={index} className="font-mono text-gray-300">
                            {team.name}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-col sm:justify-between">
                <Button
                  onClick={() =>
                    setSetup((prev) => ({ ...prev, step: "categories" }))
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
                <div className="rounded-lg bg-gray-800/50 p-4">
                  <h3 className="mb-3 font-mono text-lg font-bold text-green-400 sm:text-xl">
                    Игра:
                  </h3>
                  <p className="font-mono text-gray-300">{setup.gameName}</p>
                </div>

                <div className="rounded-lg bg-gray-800/50 p-4 md:col-span-2">
                  <h3 className="mb-3 font-mono text-lg font-bold text-green-400 sm:text-xl">
                    Категории:
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {setup.categories.map((cat, index) => (
                      <div key={index} className="font-mono text-gray-300">
                        <h4 className="font-bold text-green-400">{cat.name}</h4>
                        <p className="text-sm text-gray-400">
                          ({cat.questions.length} вопросов)
                        </p>
                        <ul className="mt-2 space-y-1">
                          {cat.questions.map((q, qIndex) => (
                            <li key={qIndex} className="text-xs sm:text-sm">
                              <span className="text-green-400">{q.price}</span>{" "}
                              баллов: {q.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-gray-800/50 p-4">
                  <h3 className="mb-3 font-mono text-lg font-bold text-green-400 sm:text-xl">
                    Команды:
                  </h3>
                  <ul className="space-y-2">
                    {Array.isArray(setup.teams) &&
                      setup.teams.map((team, index) => (
                        <li key={index} className="font-mono text-gray-300">
                          {team.name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button
                  onClick={() =>
                    setSetup((prev) => ({ ...prev, step: "teams" }))
                  }
                >
                  Назад
                </Button>
                <Button onClick={completeSetup}>Создать игру</Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
