import { motion } from "framer-motion";
import { item } from "../animations/animations";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

function Button({ onClick, children }: ButtonProps) {
  return (
    <motion.button
      className="h-20 w-lg cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-2xl text-gray-100 hover:from-blue-500 hover:to-blue-600"
      onClick={onClick}
      variants={item}
      whileHover={{
        scale: 1.05,
      }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}

export default Button;
