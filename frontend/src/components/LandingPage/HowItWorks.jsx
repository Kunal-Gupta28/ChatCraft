import { motion } from "framer-motion";
import { howItWorks } from "../../data/LandingData";
import { containerVariants } from "../../data/AnimationData";
import HowCard from "./HowCard";

const HowItWorks = () => {
  return (
    <section className="bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How ChatCraft Works
        </h2>

        {/* cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {howItWorks.map((step, i) => (
            <HowCard key={i} step={step} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
