import clsx from "clsx";
import { motion } from "framer-motion";

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
};

function Button({ onClick, children, disabled, className }: ButtonProps) {
  const baseStyles =
    "relative mb-6 cursor-pointer overflow-hidden rounded-lg bg-gradient-to-r from-green-600 to-cyan-600 px-6 py-4 font-mono text-lg text-white";

  return (
    <motion.button
      className={clsx(
        className,
        baseStyles,
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
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
