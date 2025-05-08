import { motion } from "framer-motion";
import { item } from "../../../components/animations/animations";

interface ICategory {
  category: {
    id: number;
    name: string;
    icon: string;
  };
}

function CategoryCard({ category }: ICategory) {
  return (
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
  );
}

export default CategoryCard;
