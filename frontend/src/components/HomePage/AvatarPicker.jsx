import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../config/axios";
import { useUser } from "../../contexts/user.context";

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
  const queryClient = useQueryClient();
  const { user, setUser } = useUser();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    setSelected(null);
    onClose();
  }, [onClose]);

  const handleSelect = useCallback((avatar) => {
    setSelected(avatar);
  }, []);

  // save handler
  const handleSave = useCallback(async () => {
    if (!selected || loading) return;
    try {
      setLoading(true);

      const res = await axiosInstance.put("/setAvatar", {
        avatar: selected,
      });

      if (res.status === 200) {
        const updatedUser = {
          ...(user || {}),
          ...(res.data?.user || {}),
          profilePic: res.data?.user?.profilePic || selected,
        };

        // Update React Query cache so Home.jsx useEffect doesn't overwrite with old cached data
        queryClient.setQueryData(["user"], updatedUser);

        // Update Redux state
        setUser(updatedUser);

        setSelected(null);
        onClose();
      }
    } catch (err) {
      console.error("Failed to update avatar", err);
    } finally {
      setLoading(false);
    }
  }, [selected, user, setUser, queryClient, onClose, loading]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-lg relative backdrop-blur-2xl"
          >
            {/* Close Button */}
            <button
              aria-label="Close"
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
              onClick={handleClose}
            >
              <X size={22} />
            </button>

            {/* Heading */}
            <h2 className="text-xl sm:text-2xl font-extrabold mb-6 text-center text-white tracking-tight">
              Choose Your Profile Picture
            </h2>

            {/* Avatar Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5 mb-6">
              {avatarOptions?.map((avatar) => (
                <motion.div
                  key={avatar}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(avatar)}
                  className={`relative cursor-pointer rounded-2xl overflow-hidden border transition-all ${
                    selected === avatar
                      ? "border-blue-500 ring-2 ring-blue-500/30 shadow-lg"
                      : "border-slate-800 hover:border-slate-600"
                  }`}
                >
                  <img
                    src={avatar}
                    alt="avatar option"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover"
                  />

                  {selected === avatar && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-1.5 right-1.5 bg-blue-600 rounded-full p-1 shadow-md"
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
              className={`w-full py-3 rounded-xl font-semibold transition cursor-pointer text-sm shadow-lg ${
                selected && !loading
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20 active:scale-[0.99]"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
              }`}
            >
              {loading ? "Saving..." : "Save Avatar"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AvatarPicker;
