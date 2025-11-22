import React from "react";
import { motion } from "framer-motion";
import { itemVariants } from "../../data/AnimationData";

const HowCard = React.memo(({ step }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="text-center p-6 rounded-xl border border-gray-800 hover:border-purple-500 bg-gray-900/70 backdrop-blur-md transition-transform hover:-translate-y-2"
    >

      {/* icon */}
      <div className="flex justify-center mb-4">
        <step.icon className="w-16 h-16 p-3 rounded-full bg-purple-900/50 border border-purple-700 text-purple-400" />
      </div>

      {/* title */}
      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>

      {/* description */}
      <p className="text-gray-300">{step.description}</p>
    </motion.div>
  );
});

export default HowCard;
