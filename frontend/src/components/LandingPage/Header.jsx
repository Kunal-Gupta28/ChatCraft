import { Zap } from "lucide-react";
import ActionButton from "./ActionButton";

const Header = () => {
  return (
    <header className=" mx-auto px-6 2xl:px-[4%] py-5 flex justify-between items-center relative z-10">
      <div className="text-2xl md:text-3xl font-bold flex items-center">
        {/* logo */}
        <Zap className="text-blue-400 mr-2" />
        ChatCraft
      </div>

      {/* navigate to login page */}
      <ActionButton to="/auth/login" variant="header" className="px-5 py-2">
        Get Started
      </ActionButton>
    </header>
  );
};

export default Header;
