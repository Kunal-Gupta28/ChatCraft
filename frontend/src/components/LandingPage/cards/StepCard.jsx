import { memo } from "react";
import { motion } from "framer-motion";
import { itemVariants } from "../../../data/AnimationData";

const StepCard = ({ icon: Icon, title, description, stepNumber }) => {
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-xl bg-[#090c15] p-6 border border-slate-800 hover:border-slate-700 backdrop-blur-xl transition-all duration-200 shadow-md text-left relative group"
    >
      {stepNumber && (
        <span className="text-[11px] font-mono font-semibold text-slate-400 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded">
          Step 0{stepNumber}
        </span>
      )}

      <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300 my-4">
        <Icon size={18} />
      </div>

      <h3 className="text-sm font-bold mb-2 text-white tracking-tight">
        {title}
      </h3>

      <p className="text-slate-400 text-xs leading-relaxed font-sans">
        {description}
      </p>
    </motion.article>
  );
};

export default memo(StepCard);
