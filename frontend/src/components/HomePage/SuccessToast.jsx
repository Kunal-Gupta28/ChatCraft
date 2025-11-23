import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

const SuccessToast = ({ success }) => (
  <AnimatePresence>
    {success && (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-6 right-6 bg-green-700/90 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3"
      >
        <CheckCircle size={20} />
        <span>Project created successfully!</span>
      </motion.div>
    )}
  </AnimatePresence>
);

export default SuccessToast;
