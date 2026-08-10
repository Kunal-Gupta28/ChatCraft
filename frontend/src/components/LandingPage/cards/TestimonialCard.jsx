import { memo } from "react";
import { motion } from "framer-motion";
import { itemVariants } from "../../../data/AnimationData";
import { Quote } from "lucide-react";

const TestimonialCard = ({ quote, author }) => {
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl bg-[#090c15] p-6 border border-slate-800 hover:border-slate-700 backdrop-blur-xl transition-all shadow-md flex flex-col justify-between"
    >
      <div>
        <Quote size={20} className="text-slate-600 mb-3" />
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
          "{quote}"
        </p>
      </div>

      <p className="font-mono text-xs font-semibold text-slate-400 border-t border-slate-800/80 pt-3">
        — {author}
      </p>
    </motion.article>
  );
};

export default memo(TestimonialCard);
