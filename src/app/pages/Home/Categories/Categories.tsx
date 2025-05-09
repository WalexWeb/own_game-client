import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";

function Categories() {
  const categories = [
    { id: 1, name: "История", icon: "🏛️" },
    { id: 2, name: "Интересные факты", icon: "🔬" },
    { id: 3, name: "Технологии", icon: "💻" },
    { id: 4, name: "Люди", icon: "📚" },
  ];

  return (
    <motion.div
      className="w-full max-w-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      <h3 className="mb-6 text-center font-mono text-2xl text-gray-300">
        Категории
      </h3>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard category={category} key={category.id} />
        ))}
      </div>
    </motion.div>
  );
}

export default Categories;
