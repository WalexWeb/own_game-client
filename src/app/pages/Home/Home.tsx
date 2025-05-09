import { motion } from "framer-motion";
import Categories from "./Categories/Categories";
import Button from "../../components/ui/Button";
import BackgroundCode from "../../components/ui/BackgroundCode";
import Header from "../../components/layout/Header";
import { useAtom } from "jotai";
import { gameNameAtom } from "../../stores/gameStore";
import { instance } from "../../../api/instance";
import { useState } from "react";

const ITHomePage = () => {
  const [gameName, setGameName] = useAtom(gameNameAtom);
  const [currentGame, setCurrentGame] = useState(null);

  const createNewGame = async () => {
    try {
      const gameResponse = await instance.post("/game_service/games", {
        name: gameName,
      });

      setCurrentGame(gameResponse.data);
      console.log(currentGame);

      await createCategories(gameResponse.data.id);
    } catch (error) {
      console.error("Error creating new game:", error);
    }
  };

  const createCategories = async (gameId: number) => {
    const defaultCategories = [
      {
        name: "История",
        questions: [
          {
            text: "Этот город был столицей России до Санкт-Петербурга",
            price: 100,
            answer: "Москва",
          },
          {
            text: "Год основания Санкт-Петербурга",
            price: 200,
            answer: "1703",
          },
          {
            text: "Последний император России",
            price: 300,
            answer: "Николай II",
          },
          {
            text: "Какое событие произошло в России в 1917 году?",
            price: 400,
            answer: "Революция",
          },
        ],
      },
      {
        name: "География",
        questions: [
          { text: "Самая длинная река в мире", price: 100, answer: "Нил" },
          { text: "Самая высокая гора в мире", price: 200, answer: "Эверест" },
          {
            text: "Страна с самой большой территорией",
            price: 300,
            answer: "Россия",
          },
          {
            text: "Какой океан является самым большим?",
            price: 400,
            answer: "Тихий океан",
          },
        ],
      },
      {
        name: "Наука",
        questions: [
          {
            text: "Автор теории относительности",
            price: 100,
            answer: "Альберт Эйнштейн",
          },
          { text: "Химический символ золота", price: 200, answer: "Au" },
          {
            text: "Самая близкая к Земле звезда",
            price: 300,
            answer: "Солнце",
          },
          {
            text: "Какой элемент самый распространенный во Вселенной?",
            price: 400,
            answer: "Водород",
          },
        ],
      },
    ];

    await new Promise((resolve) => setTimeout(resolve, 2000));

    for (const category of defaultCategories) {
      try {
        const categoryResponse = await instance.post(
          `board_service/categories`,
          {
            name: category.name,
            game_id: gameId,
          },
        );

        for (const question of category.questions) {
          try {
            await instance.post(`board_service/questions`, {
              text: question.text,
              price: question.price,
              answer: question.answer,
              category_id: categoryResponse.data.id,
            });
          } catch (error) {
            console.error(
              `Ошибка при создании вопроса "${question.text}":`,
              error,
            );
          }
        }
      } catch (error) {
        console.error(`Ошибка при создании категории ${category.name}:`, error);
      }
    }
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-900">
      <BackgroundCode />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 w-full max-w-4xl px-4">
        <Header name="Своя игра" />

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
              Проверь свои знания
            </motion.h2>
            <p className="mx-auto max-w-md font-mono text-gray-300">
              IT-викторина для настоящих профессионалов
            </p>
          </motion.div>

          <motion.div
            className="mb-12 w-full max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div className="relative mb-6">
              <div className="absolute -inset-0.5 rounded-lg bg-green-500 opacity-75 blur transition group-hover:opacity-100"></div>
              <input
                type="text"
                placeholder="Введите название"
                onChange={(e) => setGameName(e.target.value)}
                className="relative w-full rounded-lg border-2 border-green-400/50 bg-gray-800 p-4 font-mono text-gray-100 focus:border-green-400 focus:outline-none"
              />
            </motion.div>

            <Button onClick={createNewGame}>Начать игру</Button>
          </motion.div>

          <Categories />
        </main>
      </div>

      {/* Пасхалка | версия */}
      <motion.div
        className="absolute bottom-8 left-8 font-mono text-sm text-green-400/50"
        animate={{
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      >
        v1.0.0 [ready]
      </motion.div>
    </div>
  );
};

export default ITHomePage;
