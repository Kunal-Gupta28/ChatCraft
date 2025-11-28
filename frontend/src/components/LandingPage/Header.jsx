import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className=" mx-auto px-6 2xl:px-[4%] py-5 flex justify-between items-center relative z-10">
      <div className="text-2xl md:text-3xl font-bold flex items-center">
        {/* logo */}
        <Zap className="text-blue-400 mr-2" />
        ChatCraft
      </div>

      {/* navigate to login page */}
      <button
        onClick={() => navigate("/login")}
        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg transition-all shadow-lg hover:shadow-blue-500/50 cursor-pointer"
      >
        Get Started
      </button>
    </header>
  );
};

export default Header;