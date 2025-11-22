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
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-950 z-[999]"> 
      {/* contaienr */}
      <motion.h1 
        className="text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg" 
        variants={simpleContainer}
        initial="hidden"
        animate="visible"
      >
        {/* characters animtion */}
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
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

export default PageLoader;