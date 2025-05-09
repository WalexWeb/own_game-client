import { motion } from "framer-motion";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

function Button({ onClick, children }: ButtonProps) {
  return (
    <motion.button
      className="relative w-full cursor-pointer overflow-hidden rounded-lg bg-gradient-to-r from-green-600 to-cyan-600 px-6 py-4 font-mono text-lg text-white"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-cyan-500/30"
        animate={{
          x: [-200, 300],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.button>
  );
}

export default Button;
