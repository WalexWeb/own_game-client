import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CodeLine {
  id: number;
  content: string;
  x: number;
  y: number;
  speed: number;
  opacity: number;
}

interface BinaryParticle {
  id: number;
  value: string;
  x: number;
  y: number;
  size: number;
  speed: number;
}

function BackgroundCode() {
  const [lines, setLines] = useState<CodeLine[]>([]);
  const [binaryParticles, setBinaryParticles] = useState<BinaryParticle[]>([]);

  useEffect(() => {
    const generateCodeLine = (): string => {
      const keywords = [
        "function",
        "const",
        "return",
        "if",
        "else",
        "for",
        "while",
      ];
      const vars = ["x", "data", "result", "i", "temp", "value"];
      const operators = ["=", "+", "-", "*", "/", "=>", "=="];

      return `${keywords[Math.floor(Math.random() * keywords.length)]} ${
        vars[Math.floor(Math.random() * vars.length)]
      } ${operators[Math.floor(Math.random() * operators.length)]} ${
        Math.random() > 0.5
          ? vars[Math.floor(Math.random() * vars.length)]
          : Math.floor(Math.random() * 10)
      };`;
    };

    const codeLines: CodeLine[] = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      content: generateCodeLine(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
    }));

    const particles: BinaryParticle[] = Array.from({ length: 100 }).map(
      (_, i) => ({
        id: i,
        value: Math.random() > 0.5 ? "1" : "0",
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1 + 0.5,
        speed: Math.random() * 3 + 1,
      }),
    );

    setLines(codeLines);
    setBinaryParticles(particles);
  }, []);

  if (lines.length === 0 || binaryParticles.length === 0) {
    return null;
  }

  return (
    <>
      <div className="absolute inset-0 overflow-hidden font-mono text-xs text-green-400/30 md:text-sm">
        {lines.map((line) => (
          <motion.div
            key={`line-${line.id}`}
            className="absolute whitespace-nowrap"
            style={{
              left: `${line.x}%`,
              top: `${line.y}%`,
              opacity: line.opacity,
            }}
            animate={{
              y: [0, "100vh"],
            }}
            transition={{
              duration: line.speed * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {line.content}
          </motion.div>
        ))}
      </div>

      {/* Бинарные частицы */}
      {binaryParticles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute font-mono text-green-400/50"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size}rem`,
          }}
          animate={{
            y: [0, "100vh"],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: particle.speed * 5,
            repeat: Infinity,
            delay: Math.random() * 10,
          }}
        >
          {particle.value}
        </motion.div>
      ))}
    </>
  );
}

export default BackgroundCode;
