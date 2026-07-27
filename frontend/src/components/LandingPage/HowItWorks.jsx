import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { howItWorks } from "../../data/LandingData";
import { containerVariants } from "../../data/AnimationData";
import StepCard from "./cards/StepCard";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#06080d] relative overflow-hidden select-none border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Tag */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
            <Zap size={13} />
            <span>3 Simple Steps</span>
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-extrabold text-center text-white tracking-tight mb-4">
          How ChatCraft Works
        </h2>
        <p className="text-slate-400 text-center text-sm sm:text-base max-w-xl mx-auto mb-16">
          From zero configuration to running a full-stack Node.js project in seconds.
        </p>

        {/* Step Cards Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
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

export default HowItWorks;
