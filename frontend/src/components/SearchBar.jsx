import { memo, useCallback } from "react";
import { Search } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className={`relative w-[87.5%] mx-auto ${className}`}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800/80 text-gray-100 placeholder-gray-500 
        border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 
        outline-none transition-all duration-200"
      />
    </div>
  );
};

export default memo(SearchBar);