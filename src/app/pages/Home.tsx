import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const HomePage = () => {
  const [stars, setStars] = useState<
    Array<{ id: number; x: number; y: number; size: number; opacity: number }>
  >([]);
  const [categories, setCategories] = useState([
    { id: 1, name: "История", icon: "🏛️" },
    { id: 2, name: "Интересные факты", icon: "🔬" },
    { id: 3, name: "Технологии", icon: "💻" },
    { id: 4, name: "Люди", icon: "📚" },
  ]);

  // Генерация звёзд для фона
  useEffect(() => {
    const newStars = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.8 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 2,
      duration: Math.random() * 4 + 1,
    }));
    setStars(newStars);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Анимированные звёзды на фоне */}
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}vw`,
              top: `${star.y}vh`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              filter: `blur(${star.size * 0.1}px) drop-shadow(0 0 ${star.size * 0.3}px rgba(255, 255, 255, ${star.opacity}))`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Градиентные свечения */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8 }}
      >
        <motion.div
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-500 opacity-20 blur-[100px] filter"
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute right-1/3 bottom-1/3 h-64 w-64 rounded-full bg-purple-500 opacity-20 blur-[100px] filter"
          animate={{
            scale: [1, 1.7, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </motion.div>

      <div className="z-10">
        {/* Шапка */}
        <motion.header
          className="flex items-center justify-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="bg-gradient-to-r from-cyan-400 to-indigo-600 bg-clip-text text-9xl font-extrabold text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%"],
            }}
            transition={{
              duration: 8,
              repeatType: "reverse",
            }}
          >
            СВОЯ ИГРА
          </motion.h1>
        </motion.header>

        {/* Основной контент */}
        <main className="mt-10 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="mb-6 text-5xl font-bold text-blue-400">
              Проверь свои знания
            </h2>
            <p className="mb-12 text-xl text-gray-300">
              Классическая викторина в современном формате
            </p>
          </motion.div>

          <motion.div
            className="mb-16 flex flex-col justify-center gap-8"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <input
              type="text"
              placeholder="Введите название"
              className="rounded-lg border-solid border-blue-500 p-4 text-xl text-gray-100 outline-2 outline-offset-2 outline-blue-500 outline-solid"
            />

            <motion.button
              className="h-20 w-lg cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-2xl text-gray-100 hover:from-blue-500 hover:to-blue-600"
              variants={item}
              whileHover={{
                scale: 1.05,
              }}
              transition={{ duration: 0.2 }}
              whileTap={{ scale: 0.95 }}
            >
              Начать игру
            </motion.button>
          </motion.div>

          {/* Категории */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="mb-6 text-3xl font-medium text-gray-300">
              Категории
            </h3>
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 text-lg text-gray-300 backdrop-blur-sm transition-all hover:border-cyan-400/30 hover:bg-white/10"
                  variants={item}
                  whileHover={{
                    y: -5,
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="mb-2 text-4xl transition group-hover:text-cyan-400">
                    {category.icon}
                  </div>
                  <div className="font-medium">{category.name}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
