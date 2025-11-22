import React from "react";
import { motion } from "framer-motion";
import { itemVariants } from "../../data/AnimationData";

const TestimonialCard = React.memo(({ t }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-gray-800/70 p-8 rounded-2xl border border-gray-700 hover:border-green-500 hover:-translate-y-2 transition-all backdrop-blur-md"
    >

      {/* quote */}
      <p className="text-gray-300 italic mb-6">"{t.quote}"</p>

      {/* author */}
      <p className="font-semibold text-blue-400">{t.author}</p>

      {/* title */}
      <p className="text-sm text-gray-500">{t.title}</p>
    </motion.div>
  );
});

export default TestimonialCard;
