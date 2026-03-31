import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { containerVariants, itemVariants } from "../../data/AnimationData";
import ActionButton from "./ActionButton";

const Hero = () => {
  return (
    <main className="relative py-24 md:py-32 bg-gradient-to-br from-gray-950 to-gray-900 text-center">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold"
          >
            Craft, Collaborate, and Run.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              All with AI.
            </span>
          </motion.h1>

          {/* description paragraph */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-base md:text-lg text-gray-300 max-w-2xl mx-auto"
          >
            ChatCraft is a collaborative coding platform powered by AI — create,
            test, and run your projects directly in the browser.
          </motion.p>

          {/* navigate to login page */}
          <ActionButton
            to="/auth/login"
            variant="primary"
            className="mt-10 text-lg px-10 py-4"
          >
            Start Crafting <ArrowRight className="ml-2 h-5 w-5" />
          </ActionButton>
        </motion.div>
      </div>
    </main>
  );
};

export default Hero;
