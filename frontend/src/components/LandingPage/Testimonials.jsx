import { motion } from "framer-motion";
import { testimonials } from "../../data/LandingData";
import { containerVariants } from "../../data/AnimationData";
import TestimonialCard from "./TestimonialCard";

const Testimonials = () => {
  return (
    <section className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          What Our Users Say
        </h2>

        {/* cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
