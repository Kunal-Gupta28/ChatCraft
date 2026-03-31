import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import axiosInstance from "../../config/axios";
import {useUser} from '../../contexts/user.context'

const avatarOptions = [
  "/assets/1.webp",
  "/assets/2.webp",
  "/assets/3.webp",
  "/assets/4.webp",
  "/assets/5.webp",
  "/assets/6.webp",
  "/assets/7.webp",
  "/assets/8.webp",
  "/assets/9.webp",
  "/assets/10.webp",
  "/assets/11.webp",
  "/assets/12.webp",
];

const AvatarPicker = ({ open, onClose }) => {
  
  // context api
  const {user, setUser} = useUser();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    setSelected(null);
    onClose();
  }, [onClose]);

  const handleSelect = useCallback((avatar) => {
    setSelected(avatar);
  }, []);

  const handleSave = useCallback(async () => {
    if (!selected || loading) return;
    try {
      setLoading(true);
      const res = await axiosInstance.put('/setAvatar', {
        avatar: selected,
        userId: user._id,
      });

      if (res.status === 200) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setSelected(null);
        onClose();
      }
    } catch (err) {
      console.error("Failed to update avatar", err);
    } finally {
      setLoading(false);
    }
  }, [selected, user?._id, setUser, onClose, loading]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-700 relative"
          >
            {/* Close Button */}
            <button
              aria-label="Close"
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition cursor-pointer"
              onClick={handleClose}
            >
              <X size={24} />
            </button>

            {/* heading  */}
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-white">
              Choose Your Profile Picture
            </h2>

            {/* Avatar Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
              {avatarOptions?.map((avatar) => (
                <motion.div
                  key={avatar}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(avatar)}
                  className="relative cursor-pointer rounded-xl overflow-hidden border border-gray-700 hover:border-blue-400 transition"
                >
                  {/* Avatar Image */}
                  <img
                    src={avatar}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover"
                  />

                  {/* Checkmark at Top Right */}
                  {selected === avatar && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-1 right-1 bg-blue-600 rounded-full p-1 shadow-md"
                    >
                      <Check size={14} className="text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Save Button */}
            <button
              disabled={!selected || loading}
              onClick={handleSave}
              className={`w-full py-3 rounded-xl font-semibold transition
                ${
                  selected && !loading
                    ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AvatarPicker;
