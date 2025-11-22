import { motion } from "framer-motion";

export default function LoadingAnimation() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-[9999]">
      <div className="flex items-center gap-2 bg-neutral-800 px-4 py-2 rounded-2xl shadow-lg border border-neutral-700">
        <Dot delay={0} />
        <Dot delay={0.2} />
        <Dot delay={0.4} />
      </div>
    </div>
  );
}

function Dot({ delay }) {
  return (
    <motion.div
      className="w-3 h-3 bg-white rounded-full"
      animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}
