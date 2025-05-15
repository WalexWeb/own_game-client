import { motion } from "framer-motion";

function Header({ name }: { name: string }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-12"
    >
      <motion.h1
        className="w-full bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-center font-mono text-8xl font-bold text-transparent"
        animate={{
          textShadow: [
            "0 0 10px rgba(74, 222, 128, 0.3)",
            "0 0 20px rgba(34, 211, 238, 0.5)",
            "0 0 10px rgba(74, 222, 128, 0.3)",
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      >
        {`<${name}/>`}
      </motion.h1>
    </motion.header>
  );
}

export default Header;
