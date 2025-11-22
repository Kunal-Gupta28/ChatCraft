import { motion } from "framer-motion";
import { containerVariants } from "../../data/AnimationData";
import { features } from "../../data/LandingData";
import FeatureCard from "./FeatureCard";

const Features = () => {
  return (
    <section className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          A New Way to Build
        </h2>

        {/* Cards */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
