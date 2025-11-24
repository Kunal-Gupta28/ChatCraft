import { Search } from "lucide-react";

const CollaboratorsSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <>
      {/* Search Bar */}
      <div className="px-6 py-3 border-b border-gray-800 bg-gray-900/40 backdrop-blur-md flex items-center gap-3">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 text-gray-400" size={18} />

          {/* input field */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search member..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800/80 text-gray-100 placeholder-gray-500 
                 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 
                 outline-none transition-all duration-200"
          />
        </div>
      </div>
    </>
  );
};

export default CollaboratorsSearch;
