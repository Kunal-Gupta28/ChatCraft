import { memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

// animation configs (outside to avoid re-creation)
const toastVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 15, scale: 0.95 },
};

const transition = { duration: 0.25, ease: "easeOut" };

const SuccessToast = ({ message, clearToast }) => {
  // auto-dismiss logic (centralized)
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      clearToast();
    }, 2500);

    return () => clearTimeout(timer);
  }, [message, clearToast]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          className="fixed bottom-6 right-6 bg-green-600/90 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50"
        >
          <CheckCircle size={20} className="shrink-0" />
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(SuccessToast);