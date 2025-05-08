import { motion } from "framer-motion";
import { container } from "../../../components/animations/animations";
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
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <h3 className="mb-6 text-3xl font-medium text-gray-300">Категории</h3>
      <motion.div
        className="grid grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category) => (
          <CategoryCard category={category} key={category.id} />
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Categories;
