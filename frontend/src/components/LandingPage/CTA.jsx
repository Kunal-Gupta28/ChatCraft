import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import ActionButton from "./ActionButton";
import { containerVariants, itemVariants } from "../../data/AnimationData";

const CTA = () => {
  return (
    <section className="py-16 bg-[#06080e] text-center relative overflow-hidden select-none border-t border-slate-800/60 font-sans">
      <motion.div
        className="max-w-4xl mx-auto px-6 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={containerVariants}
      >
        <div className="bg-[#090c15] border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center">
          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight"
          >
            Ready to Revolutionize Your Coding Workflow?
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed"
          >
            Experience the future of collaborative AI-assisted cloud development. Create your first project in seconds.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <ActionButton
              to="/auth/login"
              variant="primary"
              className="text-sm px-6 py-3 rounded-xl bg-slate-100 text-slate-950 font-bold hover:bg-white transition cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <Sparkles size={16} />
              <span>Get Started Free</span>
              <ArrowRight size={16} />
            </ActionButton>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default memo(CTA);
