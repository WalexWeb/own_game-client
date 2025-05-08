import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function BackgroundStars() {
    const [stars, setStars] = useState<
    Array<{ id: number; x: number; y: number; size: number; opacity: number }>
  >([]);

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

  return (
    <>
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
    </>
  );
}

export default BackgroundStars;
