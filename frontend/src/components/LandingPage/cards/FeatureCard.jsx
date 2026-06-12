import { memo } from "react";
import { motion } from "framer-motion";
import { itemVariants } from "../../../data/AnimationData";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="rounded-2xl bg-gray-800/70 p-6 border border-gray-700 hover:border-blue-500 backdrop-blur-md"
    >
      <div className="mb-5">
        <Icon className="w-14 h-14 p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-700 text-white" />
      </div>

      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>

      <p className="text-gray-300 leading-relaxed">{description}</p>
    </motion.article>
  );
};

export default memo(FeatureCard);
