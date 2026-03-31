import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ActionButton from "./ActionButton";
import { containerVariants, itemVariants } from "../../data/AnimationData";

const CTA = () => {

  return (
    <section className="bg-gradient-to-r from-blue-700 to-purple-800 py-20 text-center">
      <motion.div
        className="max-w-4xl mx-auto px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={containerVariants}
      >
        {/* heading */}
        <motion.h2
          variants={itemVariants}
          className="text-5xl font-extrabold mb-6"
        >
          Ready to Revolutionize Your Workflow?
        </motion.h2>

        {/* paragraph */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-blue-100 mb-10"
        >
          Experience the future of collaborative AI development.
        </motion.p>

        {/* navigate to login page */}
        <ActionButton
          to="/auth/login"
          variant="secondary"
          className="text-lg px-8 py-4"
        >
          Get Started Free <ArrowRight className="ml-3 h-6 w-6" />
        </ActionButton>
      </motion.div>
    </section>
  );
};

export default CTA;
