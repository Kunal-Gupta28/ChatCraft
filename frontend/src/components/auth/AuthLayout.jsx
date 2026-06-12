import { useNavigate } from "react-router-dom";

const AuthLayout = ({ title, children }) => {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 select-none">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md">

        <button
          onClick={() => navigate("/")}
          aria-label="Go back"
          className="mb-4 text-blue-400 text-2xl hover:text-blue-300 transition"
        >
          &larr;
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          {title}
        </h2>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
