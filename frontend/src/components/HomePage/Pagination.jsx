import { memo, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate intelligent page numbers with ellipses
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis-left");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis-right");
    }

    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  const handlePrev = useCallback(() => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  }, [currentPage, totalPages, onPageChange]);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-2 border-t border-gray-800/80 mt-auto shrink-0 select-none text-xs text-gray-400">
      {/* Items Range Counter */}
      <div className="flex items-center gap-2">
        <Layers size={14} className="text-blue-400 shrink-0" />
        <span>
          Showing <strong className="text-white font-semibold">{startItem}</strong> –{" "}
          <strong className="text-white font-semibold">{endItem}</strong> of{" "}
          <strong className="text-blue-400 font-bold">{totalItems}</strong> projects
        </span>
      </div>

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Page Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage === 1}
          aria-label="Previous Page"
          className="p-1.5 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/80 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1 shadow-xs"
        >
          <ChevronLeft size={16} />
          <span className="hidden md:inline font-medium pr-1">Prev</span>
        </button>

        {/* Dynamic Page Buttons */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, idx) => {
            if (typeof page === "string") {
              return (
                <span
                  key={`${page}-${idx}`}
                  className="px-2 py-1 text-gray-500 font-mono text-[11px]"
                >
                  •••
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center border ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400/50 text-white shadow-md shadow-blue-500/20"
                    : "bg-gray-800/60 border-gray-700/60 text-gray-300 hover:bg-gray-700/80 hover:text-white"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
          className="p-1.5 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/80 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1 shadow-xs"
        >
          <span className="hidden md:inline font-medium pl-1">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Per Page Selector */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-gray-400">Show:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-gray-800/80 border border-gray-700 text-gray-200 text-xs rounded-xl px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value={9}>9 / page</option>
          <option value={18}>18 / page</option>
          <option value={27}>27 / page</option>
          <option value={36}>36 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>
    </div>
  );
};

export default memo(Pagination);
