import { memo } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { howItWorks } from "../../data/LandingData";
import { containerVariants } from "../../data/AnimationData";
import StepCard from "./cards/StepCard";

const HowItWorks = ({ showHeader = true }) => {
  return (
    <section id="how-it-works" className="py-12 bg-[#06080e] relative overflow-hidden select-none border-t border-slate-800/60 font-sans">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {showHeader && (
          <>
            {/* Section Tag */}
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-mono">
                <Zap size={13} />
                <span>3 Simple Steps</span>
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-4xl font-extrabold text-center text-white tracking-tight mb-2">
              How ChatCraft Works
            </h2>
            <p className="text-slate-400 text-center text-xs sm:text-sm max-w-lg mx-auto mb-12">
              From zero configuration to running a full-stack Node.js project in seconds.
            </p>
          </>
        )}

        {/* Step Cards Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {howItWorks.map((step, index) => (
            <StepCard key={step.title} {...step} stepNumber={index + 1} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(HowItWorks);
