import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { containerVariants } from "../../data/AnimationData";
import { features } from "../../data/LandingData";
import FeatureCard from "./cards/FeatureCard";

const Features = () => {
  return (
    <section id="features" className="w-full py-24 bg-[#080b11] relative overflow-hidden select-none">
      <div className="w-full max-w-[92vw] 2xl:max-w-[88vw] mx-auto px-4 relative z-10">
        {/* Section Tag */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Sparkles size={13} />
            <span>Built for Modern Developers</span>
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-extrabold text-center text-white tracking-tight mb-4">
          A Better Way to Build Software
        </h2>
        <p className="text-slate-400 text-center text-sm sm:text-base max-w-xl mx-auto mb-16">
          Everything you need to prompt AI, code collaboratively, and run full-stack Node.js projects right inside your browser.
        </p>

        {/* Feature Cards Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
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

export default Features;
