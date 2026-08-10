import { memo } from "react";
import { motion } from "framer-motion";
import { itemVariants } from "../../../data/AnimationData";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-xl bg-[#090c15] p-6 border border-slate-800 hover:border-slate-700 backdrop-blur-xl transition-all duration-200 shadow-md group flex flex-col justify-between"
    >
      <div>
        <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300 mb-4 transition-colors">
          <Icon size={18} />
        </div>

        <h3 className="text-sm font-bold mb-2 text-white tracking-tight group-hover:text-slate-200 transition">
          {title}
        </h3>

        <p className="text-slate-400 text-xs leading-relaxed font-sans">
          {description}
        </p>
      </div>
    </motion.article>
  );
};

export default memo(FeatureCard);
