import React from "react";
import { motion } from "framer-motion";
import { itemVariants } from "../../data/AnimationData";

const Card = ({ data, role }) => {
  const { icon: Icon, title, description, quote, author } = data;

  const isFeature = role === "featureCard";
  const isTestimonial = role === "testimonialCard";

  // Base style (shared across all cards)
  const baseClass =
    "rounded-2xl backdrop-blur-md transition-all hover:-translate-y-2 border";

  // Variants
  const variants = {
    feature: "bg-gray-800/70 p-6 border-gray-700 hover:border-blue-500",
    default:
      "bg-gray-900/70 p-6 border-gray-700 hover:border-purple-500 text-center",
    testimonial: "bg-gray-800/70 p-3 border-gray-700 hover:border-green-500",
  };

  const cardClass = `${baseClass} ${
    isTestimonial
      ? variants.testimonial
      : isFeature
        ? variants.feature
        : variants.default
  }`;

  // Icon styles
  const iconBgClass = isFeature
    ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white"
    : "bg-purple-900/50 border border-purple-700 text-purple-400";

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={cardClass}
    >
      {/* icon */}
      <div
        className={`${isFeature ? "" : "flex justify-center"} w-full h-16 mb-4`}
      >
        {Icon && (
          <Icon className={`w-14 h-14 p-3 rounded-full ${iconBgClass}`} />
        )}
      </div>

      {/* testimonial content */}
      {isTestimonial && (
        <>
          <p className="text-gray-300 italic mb-6">"{quote}"</p>
          <p className="font-semibold text-blue-400">{author}</p>
        </>
      )}

      {/* title */}
      <h3
        className={`${
          isTestimonial ? "text-xs text-gray-500" : ""
        } text-xl font-semibold mb-3`}
      >
        {title}
      </h3>

      {/* description */}
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

export default React.memo(Card);
