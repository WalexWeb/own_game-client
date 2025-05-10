import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import BackgroundCode from "../components/ui/BackgroundCode";
import Header from "../components/layout/Header";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  categoriesAtom,
  gameNameAtom,
  startTextAtom,
  teamsAtom,
} from "../stores/gameStore";
import { useNavigate } from "react-router-dom";

interface IQuestion {
  id: number;
  text: string;
  price: number;
  answer: string;
  isAnswered: boolean;
}

interface ICategory {
  id: number;
  name: string;
  questions: IQuestion[];
}

const Game = () => {
  const [gameName] = useAtom(gameNameAtom);
  const [teams, setTeams] = useAtom(teamsAtom);
  const navigate = useNavigate();
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
    null,
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [showStartText, setShowStartText] = useAtom(startTextAtom);

  const demoCategories: ICategory[] = [
    {
      id: 1,
      name: "История",
      questions: [
        {
          id: 1,
          text: "Кто создал первый компьютер?",
          price: 100,
          answer: "test",
          isAnswered: false,
        },
        {
          id: 2,
          text: "Как работает event loop?",
          price: 200,
          answer: "test",
          isAnswered: false,
        },
        {
          id: 3,
          text: "Разница между let, const и var?",
          price: 300,
          answer: "test",
          isAnswered: false,
        },
      ],
    },
    {
      id: 2,
      name: "Люди",
      questions: [
        {
          id: 4,
          text: "Что такое Virtual DOM?",
          price: 100,
          answer: "test",
          isAnswered: false,
        },
        {
          id: 5,
          text: "Как работает useEffect?",
          price: 200,
          answer: "test",
          isAnswered: false,
        },
        {
          id: 6,
          text: "Разница между useState и useReducer?",
          price: 300,
          answer: "test",
          isAnswered: false,
        },
      ],
    },
    {
      id: 3,
      name: "Технологии",
      questions: [
        {
          id: 7,
          text: "Что такое дженерики?",
          price: 100,
          answer: "test",
          isAnswered: false,
        },
        {
          id: 8,
          text: "Для чего нужен never тип?",
          price: 200,
          answer: "test",
          isAnswered: false,
        },
        {
          id: 9,
          text: "Как работает type inference?",
          price: 300,
          answer: "test",
          isAnswered: false,
        },
      ],
    },
    {
      id: 4,
      name: "Интересные факты",
      questions: [
        {
          id: 10,
          text: "Что такое дженерики?",
          price: 100,
          answer: "test",
          isAnswered: false,
        },
        {
          id: 11,
          text: "Для чего нужен never тип?",
          price: 200,
          answer: "test",
          isAnswered: false,
        },
        {
          id: 12,
          text: "Как работает type inference?",
          price: 300,
          answer: "test",
          isAnswered: false,
        },
      ],
    },
  ];

  useEffect(() => {
    if (categories.length > 0) {
      setShowStartText(false);
    }
  }, [categories, setShowStartText]);

  const startGame = () => {
    setCategories(demoCategories);
    setShowStartText(false);
  };

  const handleQuestionClick = (question: IQuestion) => {
    if (question.isAnswered) return;
    setSelectedQuestion(question);
    setShowAnswer(false);
    setSelectedTeamId(null);
  };

  const revealAnswer = () => {
    setShowAnswer(true);
  };

  const markAsAnswered = () => {
    if (!selectedQuestion || !selectedTeamId) return;

    // 1. Обновляем счет команды
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === selectedTeamId
          ? { ...team, score: team.score + selectedQuestion.price }
          : team,
      ),
    );

    // 2. Помечаем вопрос как отвеченный
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        questions: category.questions.map((q) =>
          q.id === selectedQuestion.id ? { ...q, isAnswered: true } : q,
        ),
      })),
    );

    // 3. Сбрасываем выбранные значения
    setSelectedQuestion(null);
    setSelectedTeamId(null);
    setShowAnswer(false);
  };

  const handleLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-900">
      <BackgroundCode />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 w-full max-w-6xl px-4">
        <Header name={gameName || "Своя игра"} />

        {showStartText ? (
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
            {categories.length > 0 ? (
              <>
                <div className="gird-rows-2 grid grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex flex-col">
                      <div className="mb-2 rounded-lg bg-green-500/20 p-3 text-center font-mono font-bold text-green-400">
                        {category.name}
                      </div>
                      <div className="space-y-2">
                        {category.questions.map((question) => (
                          <motion.div
                            key={question.id}
                            whileHover={{
                              scale: question.isAnswered ? 1 : 1.05,
                            }}
                            whileTap={{ scale: question.isAnswered ? 1 : 0.95 }}
                            onClick={() => handleQuestionClick(question)}
                            className={`cursor-pointer rounded-lg p-4 text-center font-mono font-bold transition ${
                              question.isAnswered
                                ? "bg-gray-700 text-gray-500"
                                : "bg-gray-800 text-green-400 hover:bg-green-400/10"
                            }`}
                          >
                            {question.isAnswered ? "---" : question.price}
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

            {/* Модальное окно с вопросом */}
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
                          {selectedQuestion.answer}
                        </p>

                        {/* Выбор команды для начисления баллов */}
                        <div className="mt-4">
                          <h4 className="mb-2 font-mono font-bold text-green-400">
                            Начислить баллы команде:
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                            {teams.map((team) => (
                              <motion.div
                                key={team.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedTeamId(team.id)}
                                className={clsx(
                                  "cursor-pointer rounded-lg p-3 text-center font-mono font-bold transition",
                                  selectedTeamId === team.id
                                    ? "ring-2 ring-green-400"
                                    : "",
                                  team.colorClass,
                                )}
                              >
                                {team.name}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <Button onClick={() => setSelectedQuestion(null)}>
                          Закрыть
                        </Button>
                        <Button
                          onClick={markAsAnswered}
                          disabled={!selectedTeamId}
                        >
                          Подтвердить
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-end">
                      <Button onClick={revealAnswer}>Показать ответ</Button>
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
