import { motion } from "framer-motion";

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
      className="group cursor-pointer rounded-lg border-2 border-green-400/20 bg-gray-800/50 p-4 text-center"
      whileHover={{
        y: -5,
        borderColor: "rgba(74, 222, 128, 0.5)",
        boxShadow: "0 10px 25px -5px rgba(74, 222, 128, 0.3)",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-2 text-4xl transition group-hover:text-green-400">
        {category.icon}
      </div>
      <div className="font-mono text-gray-300 group-hover:text-white">
        {category.name}
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-green-400 opacity-0 transition group-hover:opacity-100"></div>
    </motion.div>
  );
}

export default CategoryCard;
