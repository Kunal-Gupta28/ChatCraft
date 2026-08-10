import { memo } from "react";
import { motion } from "framer-motion";
import { testimonials } from "../../data/LandingData";
import { containerVariants } from "../../data/AnimationData";
import TestimonialCard from "./cards/TestimonialCard";
import { MessageSquareQuote } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="bg-[#06080e] py-16 border-t border-slate-800/60 select-none font-sans">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-mono">
            <MessageSquareQuote size={13} />
            <span>Developer Testimonials</span>
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-center text-white tracking-tight mb-2">
          What Developers Say
        </h2>
        <p className="text-slate-400 text-center text-xs sm:text-sm max-w-lg mx-auto mb-12">
          Real feedback from developers using ChatCraft for real-time cloud collaboration.
        </p>

        {/* Cards Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {testimonials.map((t) => (
            <TestimonialCard key={t.author} {...t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Testimonials);
