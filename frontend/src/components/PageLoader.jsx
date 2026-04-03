import { memo, useMemo } from "react";
import { motion } from "framer-motion";

// container animation
const simpleContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

// characters animation
const simpleCharacter = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200,
    },
  },
};

const PageLoader = () => {
  const text = "ChatCraft";

  // memoize split (small but clean optimization)
  const characters = useMemo(() => text.split(""), [text]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-950 z-[999]">
      {/* container */}
      <motion.h1
        className="text-6xl sm:text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg select-none"
        variants={simpleContainer}
        initial="hidden"
        animate="visible"
      >
        {/* characters animation */}
        {characters.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            className="inline-block"
            variants={simpleCharacter}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
};

export default memo(PageLoader);