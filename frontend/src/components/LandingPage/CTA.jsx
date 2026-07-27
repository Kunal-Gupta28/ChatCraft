import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import ActionButton from "./ActionButton";
import { containerVariants, itemVariants } from "../../data/AnimationData";

const CTA = () => {
  return (
    <section className="py-20 bg-[#080b11] text-center relative overflow-hidden select-none border-t border-slate-800/60">
      <motion.div
        className="max-w-5xl mx-auto px-6 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={containerVariants}
      >
        <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-indigo-500/30 rounded-3xl p-10 sm:p-16 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight"
          >
            Ready to Revolutionize Your Coding Workflow?
          </motion.h2>

          {/* Paragraph */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl mx-auto"
          >
            Experience the future of collaborative AI-assisted cloud development. Create your first project in seconds.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <ActionButton
              to="/auth/login"
              variant="primary"
              className="text-base px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer border border-blue-400/30"
            >
              <Sparkles size={18} />
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </ActionButton>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
