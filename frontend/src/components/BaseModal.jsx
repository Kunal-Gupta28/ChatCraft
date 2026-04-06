import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  initial: { scale: 0.9, opacity: 0, y: 20 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0.9, opacity: 0, y: 10 },
};

const BaseModal = ({
  open,
  onClose,
  children,
  className = "",
  zIndex = "z-50",
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`fixed inset-0 bg-black/60 flex items-center justify-center ${zIndex}`}
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-gray-900 p-6 rounded-2xl w-[90%] max-w-md border border-gray-700 ${className}`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BaseModal;