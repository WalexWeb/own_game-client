import { motion } from "framer-motion";

function Header({ name }: { name: string }) {
  return (
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
        {name.toUpperCase()}
      </motion.h1>
    </motion.header>
  );
}

export default Header;
