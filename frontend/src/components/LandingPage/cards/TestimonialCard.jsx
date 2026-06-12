import { memo } from "react";
import { motion } from "framer-motion";
import { itemVariants } from "../../../data/AnimationData";

const TestimonialCard = ({ quote, author }) => {
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="rounded-2xl bg-gray-800/70 p-6 border border-gray-700 hover:border-green-500 backdrop-blur-md"
    >
      <p className="text-gray-300 italic mb-6 leading-relaxed">"{quote}"</p>

      <p className="font-semibold text-green-400">{author}</p>
    </motion.article>
  );
};

export default memo(TestimonialCard);
