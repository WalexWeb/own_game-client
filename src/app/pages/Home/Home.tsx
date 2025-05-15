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
    <div className="relative h-screen w-screen items-center overflow-hidden justify-center bg-gray-900">
      <BackgroundCode />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 w-full px-4">
        <Header name="Создание игры" />

        {/* Название игры */}
        {setup.step === "gameName" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <motion.h2 className="mb-8 font-mono text-3xl font-bold text-green-400">
              Введите название игры
            </motion.h2>
            <input
              type="text"
              value={setup.gameName}
              onChange={(e) =>
                setSetup((prev) => ({ ...prev, gameName: e.target.value }))
              }
              className="mb-6 w-lg rounded-lg border-2 border-green-400/50 bg-gray-800 p-4 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
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
            className="flex flex-col items-center"
          >
            <motion.h2 className="mb-8 font-mono text-3xl font-bold text-green-400">
              Добавьте категории и вопросы
            </motion.h2>

            <div className="mb-6 w-lg space-y-4">
              <div>
                <h3 className="mb-2 font-mono text-xl text-green-400">
                  Категории
                </h3>
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder="Название категории"
                  className="mb-6 w-lg rounded-lg border-2 border-green-400/50 bg-gray-800 p-4 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                />
                <Button onClick={addCategory} disabled={!currentValue.trim()}>
                  Добавить
                </Button>
              </div>

              {setup.categories.length > 0 && (
                <div>
                  <h3 className="mb-2 font-mono text-xl text-green-400">
                    Вопросы
                  </h3>
                  <select
                    onChange={(e) =>
                      setSelectedCategory(Number(e.target.value))
                    }
                    className="mb-2 w-full rounded-lg border-2 border-green-400/50 bg-gray-800 p-4 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                  >
                    <option value="">Выберите категорию</option>
                    {setup.categories.map((cat, index) => (
                      <option key={index} value={index}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  {selectedCategory !== null && (
                    <div className="space-y-2">
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
                        className="w-full rounded-lg border-2 border-green-400/50 bg-gray-800 p-4 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                      />
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
                        className="w-full rounded-lg border-2 border-green-400/50 bg-gray-800 p-4 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
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
                        className="w-full rounded-lg border-2 border-green-400/50 bg-gray-800 p-4 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
                      />
                      <Button
                        onClick={addQuestion}
                        disabled={!currentQuestion.text.trim()}
                      >
                        Добавить вопрос
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <Button
                onClick={toTeamsStep}
                disabled={setup.categories.length === 0}
              >
                Перейти к командам
              </Button>
              <Button
                onClick={() =>
                  setSetup((prev) => ({ ...prev, step: "gameName" }))
                }
              >
                Назад
              </Button>
            </div>
          </motion.div>
        )}

        {/* Команды */}
        {setup.step === "teams" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <motion.h2 className="mb-8 font-mono text-3xl font-bold text-green-400">
              Добавьте команды
            </motion.h2>

            <input
              type="text"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              placeholder="Название команды"
              className="mb-6 w-lg rounded-lg border-2 border-green-400/50 bg-gray-800 p-4 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
            />
            <Button onClick={addTeam} disabled={!currentValue.trim()}>
              Добавить
            </Button>

            {setup.teams?.length > 0 && (
              <div>
                <h3 className="font-mono text-xl text-green-400">
                  Добавленные команды:
                </h3>
                <ul className="mb-6 space-y-2">
                  {setup.teams.map((team, index) => (
                    <li key={index} className="font-mono text-gray-300">
                      {team.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button
              onClick={toReviewStep}
              disabled={!setup.teams || setup.teams.length === 0}
            >
              Просмотр и завершение
            </Button>
            <Button
              onClick={() =>
                setSetup((prev) => ({ ...prev, step: "categories" }))
              }
            >
              Назад
            </Button>
          </motion.div>
        )}

        {/* Просмотр и завершение */}
        {setup.step === "review" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <motion.h2 className="mb-8 font-mono text-3xl font-bold text-green-400">
              Проверьте данные
            </motion.h2>

            <div className="mb-8 grid w-screen max-w-md grid-cols-3 justify-center space-y-6 gap-x-96">
              <div>
                <h3 className="mb-2 font-mono text-xl text-green-400">Игра:</h3>
                <p className="font-mono text-gray-300">{setup.gameName}</p>
              </div>

              <div>
                <h3 className="mb-2 font-mono text-xl text-green-400">
                  Категории:
                </h3>
                <ul className="grid grid-cols-3 justify-center gap-x-36">
                  {setup.categories.map((cat, index) => (
                    <li key={index} className="font-mono text-gray-300">
                      <span className="font-bold">{cat.name}</span> (
                      {cat.questions.length} вопросов)
                      <ul className="mt-1 ml-4">
                        {cat.questions.map((q, qIndex) => (
                          <li key={qIndex} className="text-sm">
                            {q.price} баллов: {q.text}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-2 font-mono text-xl text-green-400">
                  Команды:
                </h3>
                <ul className="space-y-2">
                  {setup.teams.map((team, index) => (
                    <li key={index} className="font-mono text-gray-300">
                      {team.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setSetup((prev) => ({ ...prev, step: "teams" }))}
              >
                Назад
              </Button>
              <Button onClick={completeSetup}>Создать игру</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
