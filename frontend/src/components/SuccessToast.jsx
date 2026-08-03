import { memo, useEffect } from "react";
import { createPortal } from "react-dom";
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
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, clearToast]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {message && (
        <motion.div
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          className="fixed bottom-6 right-6 bg-[#10b981] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-[9999] border border-emerald-400/30"
        >
          <CheckCircle size={20} className="shrink-0 text-white" />
          <span className="text-sm font-semibold">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default memo(SuccessToast);