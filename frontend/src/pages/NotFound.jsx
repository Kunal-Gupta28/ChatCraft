import { memo } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
      
      <h1 className="text-8xl md:text-9xl font-bold text-gray-800 dark:text-white select-none">
        404
      </h1>

      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        aria-label="Go back to home"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-all duration-150"
      >
        Go Home
      </Link>
    </div>
  );
};

export default memo(NotFound);