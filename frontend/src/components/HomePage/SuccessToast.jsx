import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

// animation variants extracted outside component to avoid re-creation
const toastVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 15 },
};

const transition = { duration: 0.3, ease: "easeOut" };

const SuccessToast = ({ success }) => {
  if (!success) return null; // early return avoids unnecessary AnimatePresence render

  return (
    <AnimatePresence>
      <motion.div
        variants={toastVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        className="fixed bottom-6 right-6 bg-green-700/90 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3"
      >
        <CheckCircle size={20} />
        <span>Project created successfully!</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(SuccessToast);
