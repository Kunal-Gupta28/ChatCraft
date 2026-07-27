import { memo } from "react";
import { motion } from "framer-motion";
import { itemVariants } from "../../../data/AnimationData";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-2xl bg-slate-900/60 p-7 border border-slate-800/80 hover:border-blue-500/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group flex flex-col justify-between"
    >
      <div>
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition duration-300 shadow-md">
          <Icon size={24} />
        </div>

        <h3 className="text-xl font-bold mb-3 text-white tracking-tight group-hover:text-blue-300 transition">
          {title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </motion.article>
  );
};

export default memo(FeatureCard);
