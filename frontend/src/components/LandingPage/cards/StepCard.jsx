import { memo } from "react";
import { motion } from "framer-motion";
import { itemVariants } from "../../../data/AnimationData";

const StepCard = ({ icon: Icon, title, description, stepNumber }) => {
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-2xl bg-slate-900/60 p-7 border border-slate-800/80 hover:border-purple-500/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 text-center relative group"
    >
      {stepNumber && (
        <span className="absolute top-4 right-5 text-2xl font-black text-slate-800 group-hover:text-purple-500/40 transition">
          0{stepNumber}
        </span>
      )}

      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition duration-300 shadow-md">
          <Icon size={26} />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-3 text-white tracking-tight group-hover:text-purple-300 transition">
        {title}
      </h3>

      <p className="text-slate-400 text-sm leading-relaxed">
        {description}
      </p>
    </motion.article>
  );
};

export default memo(StepCard);
