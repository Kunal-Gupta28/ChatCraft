import { memo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { containerVariants } from "../../data/AnimationData";
import { features } from "../../data/LandingData";
import FeatureCard from "./cards/FeatureCard";

const Features = ({ showHeader = true }) => {
  return (
    <section id="features" className="w-full py-12 bg-[#06080e] relative overflow-hidden select-none font-sans">
      <div className="w-full max-w-5xl mx-auto px-6 relative z-10">
        {showHeader && (
          <>
            {/* Section Tag */}
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-mono">
                <Sparkles size={13} />
                <span>Built for Modern Developers</span>
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-4xl font-extrabold text-center text-white tracking-tight mb-2">
              A Better Way to Build Software
            </h2>
            <p className="text-slate-400 text-center text-xs sm:text-sm max-w-lg mx-auto mb-12">
              Everything you need to prompt AI, code collaboratively, and run full-stack Node.js projects right inside your browser.
            </p>
          </>
        )}

        {/* Feature Cards Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Features);
