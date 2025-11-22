import React from "react";
import { motion } from "framer-motion";
import { itemVariants } from "../../data/AnimationData";

const FeatureCard = React.memo(({ feature }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all hover:-translate-y-2"
    >

      {/* icon */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 w-14 h-14 rounded-full flex items-center justify-center mb-5 shadow-md">
        <feature.icon className="w-7 h-7" />
      </div>

      {/* title */}
      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>

      {/* description */}
      <p className="text-gray-300">{feature.description}</p>
    </motion.div>
  );
});

export default FeatureCard;
