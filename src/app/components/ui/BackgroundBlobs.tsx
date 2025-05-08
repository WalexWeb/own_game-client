import { motion } from "framer-motion";

function BackgroundBlobs() {
  return (
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
  );
}

export default BackgroundBlobs;
