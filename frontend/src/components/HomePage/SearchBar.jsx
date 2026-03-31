import { Search } from "lucide-react";
import { useCallback } from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const inputHandler = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  return (
    <div className="max-w-[85vw] h-[5%] mx-auto mb-4 relative z-10 ">
      <div className="relative">

        {/* magnifing glass */}
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          <Search size={20} />
        </span>

        {/* input field */}
        <input
          type="text"
          placeholder="Search projects by name..."
          value={searchTerm}
          onChange={inputHandler}
          className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl outline-none"
        />
      </div>
    </div>
  );
};

export default SearchBar;
