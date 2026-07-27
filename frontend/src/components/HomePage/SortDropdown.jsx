import { useState, useRef, useEffect, memo, useCallback } from "react";
import { ArrowUpDown, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SORT_OPTIONS = [
  { id: "date-newest", label: "Date (Newest First)", shortLabel: "Newest" },
  { id: "date-oldest", label: "Date (Oldest First)", shortLabel: "Oldest" },
  { id: "name-asc", label: "Name (A - Z)", shortLabel: "A - Z" },
  { id: "name-desc", label: "Name (Z - A)", shortLabel: "Z - A" },
  { id: "members-desc", label: "Members (Most)", shortLabel: "Most Members" },
  { id: "members-asc", label: "Members (Fewest)", shortLabel: "Fewest Members" },
];

const SortDropdown = ({ sortBy, onSortChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption =
    SORT_OPTIONS.find((opt) => opt.id === sortBy) || SORT_OPTIONS[0];

  const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (id) => {
      onSortChange(id);
      setOpen(false);
    },
    [onSortChange],
  );

  return (
    <div className="relative z-40 shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleOpen}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 text-gray-200 border border-gray-700 transition cursor-pointer text-xs sm:text-sm font-medium whitespace-nowrap"
      >
        <ArrowUpDown size={16} className="text-blue-400 shrink-0" />
        <span className="hidden sm:inline">{currentOption.label}</span>
        <span className="sm:hidden">{currentOption.shortLabel}</span>
        <ChevronDown
          size={14}
          className={`text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl shadow-black/80 py-1 z-50 overflow-hidden"
          >
            <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800 select-none">
              Sort Projects By
            </div>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm text-left transition cursor-pointer ${sortBy === opt.id
                    ? "bg-blue-600/20 text-blue-400 font-medium"
                    : "text-gray-300 hover:bg-gray-800"
                  }`}
              >
                <span>{opt.label}</span>
                {sortBy === opt.id && (
                  <Check size={14} className="text-blue-400 shrink-0" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(SortDropdown);
