import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import BackgroundCode from "../components/ui/BackgroundCode";
import Header from "../components/layout/Header";
import Button from "../components/ui/Button";
import { gameSetupAtom } from "../stores/gameStore";
import { useAtomValue } from "jotai";
import { IQuestion, ITeam } from "../../types/IQuestion";
import axios from "axios";

const Game = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const gameSetup = useAtomValue(gameSetupAtom);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
    null,
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);

  // Загрузка данных игры
  useEffect(() => {
    if (gameSetup.gameId) {
      fetchGameData();
      fetchTeams();
    }
  }, [gameSetup.gameId]);

  // Логика таймера
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (timerActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      // Таймер истек - автоматически показываем ответ
      revealAnswer();
    }

    return () => clearInterval(interval);
  }, [timerActive, isPaused, timeLeft]);

  const fetchGameData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/games/${gameSetup.gameId}`);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching game data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/games/${gameSetup.gameId}/ranking`,
      );
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleQuestionClick = async (question: IQuestion) => {
    if (question.answered) return;

    setSelectedQuestion(question);
    setShowAnswer(false);
    setCurrentAnswer("");
    setTimerActive(true);
    setTimeLeft(60);
    setIsPaused(false);
  };

  const stopTimer = () => {
    setTimerActive(false);
    setIsPaused(false);
    setTimeLeft(60);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const revealAnswer = async () => {
    if (!selectedQuestion) return;

    try {
      setIsLoading(true);
      stopTimer();

      const response = await axios.get(
        `${API_URL}/questions/${selectedQuestion.id}/answer`,
      );
      setCurrentAnswer(response.data);
      setShowAnswer(true);
    } catch (error) {
      console.error("Error fetching answer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resolveQuestion = async (teamId?: number) => {
    if (!selectedQuestion) return;

    try {
      setIsLoading(true);

      const resolveData = teamId ? { teamId } : {};
      await axios.post(
        `${API_URL}/questions/${selectedQuestion.id}/resolve`,
        resolveData,
      );

      // Обновляем данные
      await fetchGameData();
      await fetchTeams();

      setSelectedQuestion(null);
      setShowAnswer(false);
      setCurrentAnswer("");
    } catch (error) {
      console.error("Error resolving question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaderboard = () => {
    navigate("/leaderboard");
  };

  const finishGame = async () => {
    try {
      await axios.post(`${API_URL}/games/${gameSetup.gameId}/finish`);
      navigate("/");
    } catch (error) {
      console.error("Error finishing game:", error);
    }
  };

  // Функция для сортировки вопросов по баллам
  const getSortedQuestions = (questions: IQuestion[]) => {
    return [...questions].sort((a, b) => a.points - b.points);
  };

  // Форматирование времени для таймера
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Цвет таймера в зависимости от оставшегося времени
  const getTimerColor = () => {
    if (timeLeft > 30) return "text-green-400";
    if (timeLeft > 10) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-auto bg-gray-900">
      <BackgroundCode />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 w-full max-w-6xl px-4 py-8">
        <Header name={gameSetup.gameName} />

        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="font-mono text-green-400">Загрузка...</div>
          </div>
        )}

        <div className="mt-8">
          {categories.length > 0 ? (
            <>
              {/* Сетка вопросов */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex flex-col">
                    <div className="mb-3 rounded-lg text-3xl bg-green-500/20 p-3 text-center font-mono font-bold text-green-400">
                      {category.name}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {getSortedQuestions(category.questions).map(
                        (question: IQuestion) => (
                          <motion.div
                            key={question.id}
                            whileHover={{
                              scale: question.answered ? 1 : 1.05,
                            }}
                            whileTap={{ scale: question.answered ? 1 : 0.95 }}
                            onClick={() =>
                              !question.answered &&
                              handleQuestionClick(question)
                            }
                            className={clsx(
                              "rounded-lg p-4 text-center font-mono font-bold transition",
                              question.answered
                                ? "cursor-not-allowed bg-gray-700 text-gray-500"
                                : "cursor-pointer bg-gray-800 text-2xl text-green-400 hover:bg-green-400/10",
                            )}
                          >
                            {question.answered ? "---" : question.points}
                          </motion.div>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Панель управления */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button onClick={handleLeaderboard}>Рейтинг команд</Button>
                <Button onClick={finishGame}>
                  Завершить игру
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center font-mono text-gray-300">
              Нет доступных категорий или вопросы закончились
            </div>
          )}

          {/* Модальное окно вопроса */}
          {selectedQuestion && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="relative w-full max-w-2xl rounded-lg bg-gray-800 p-6 shadow-xl">
                {/* Таймер */}
                {timerActive && !showAnswer && (
                  <div className="mb-6 text-center">
                    <div
                      className={clsx(
                        "inline-block rounded-full bg-gray-700/80 px-6 py-3 font-mono text-3xl font-bold transition-colors",
                        getTimerColor(),
                      )}
                    >
                      {formatTime(timeLeft)}
                    </div>
                    <div className="mt-3 flex justify-center gap-3">
                      <Button
                        onClick={togglePause}
                      >
                        {isPaused ? "Продолжить" : "Пауза"}
                      </Button>
                      <Button
                        onClick={revealAnswer}
                      >
                        Показать ответ
                      </Button>
                    </div>
                    {isPaused && (
                      <div className="mt-2 text-center font-mono text-sm text-yellow-400">
                        Таймер на паузе
                      </div>
                    )}
                  </div>
                )}

                <h3 className="mb-4 font-mono text-xl font-bold text-green-400">
                  Вопрос за {selectedQuestion.points} баллов
                </h3>

                <div className="mb-6 rounded-lg bg-gray-700/50 p-4">
                  <p className="text-center font-mono text-2xl text-gray-100">
                    {selectedQuestion.questionText}
                  </p>
                </div>

                {showAnswer ? (
                  <>
                    <div className="mb-6 rounded-lg bg-gray-700 p-4">
                      <h4 className="mb-3 text-center font-mono text-xl font-bold text-green-400">
                        Ответ:
                      </h4>
                      <p className="text-center font-mono text-2xl text-gray-100">
                        {currentAnswer}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="mb-3 text-center font-mono text-lg font-bold text-green-400">
                        Начислить баллы команде:
                      </h4>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {teams.map((team: ITeam) => (
                          <motion.button
                            key={team.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => resolveQuestion(team.id)}
                            className="cursor-pointer rounded-lg bg-gray-700 p-4 text-center font-mono text-gray-100 transition hover:bg-green-400/20"
                          >
                            <div className="font-bold">{team.name}</div>
                            <div className="text-sm text-green-400">
                              {team.score} баллов
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={() => resolveQuestion()}
                      >
                        Никто не ответил
                      </Button>
                      <Button
                        onClick={() => {
                          stopTimer();
                          setSelectedQuestion(null);
                        }}
                      >
                        Закрыть
                      </Button>
                    </div>
                  </>
                ) : (
                  !timerActive && (
                    <div className="flex justify-center gap-4">
                      <Button onClick={revealAnswer} disabled={isLoading}>
                        {isLoading ? "Загрузка..." : "Показать ответ"}
                      </Button>
                      <Button
                        onClick={() => {
                          stopTimer();
                          setSelectedQuestion(null);
                        }}
                      >
                        Отмена
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
