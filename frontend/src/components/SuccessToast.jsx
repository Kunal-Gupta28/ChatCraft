import { memo, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, X } from "lucide-react";

const SuccessToast = ({ message, clearToast, onClose, duration = 1500 }) => {
  const dismiss = onClose || clearToast;

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      if (typeof dismiss === "function") dismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, dismiss, duration]);

  if (typeof document === "undefined" || !message) return null;

  return createPortal(
    <div
      onClick={() => typeof dismiss === "function" && dismiss()}
      title="Click to dismiss"
      className="fixed bottom-6 right-6 bg-[#10b981] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-[9999] border border-emerald-400/30 font-sans transition-all duration-200 animate-slideUp cursor-pointer hover:bg-emerald-600 active:scale-95 select-none"
    >
      <CheckCircle size={18} className="shrink-0 text-white" />
      <span className="text-xs font-semibold">{message}</span>
      <button
        type="button"
        aria-label="Dismiss toast"
        onClick={(e) => {
          e.stopPropagation();
          if (typeof dismiss === "function") dismiss();
        }}
        className="ml-1 text-emerald-100 hover:text-white p-0.5 rounded-lg hover:bg-emerald-700/50 transition cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>,
    document.body
  );
};

export default memo(SuccessToast);