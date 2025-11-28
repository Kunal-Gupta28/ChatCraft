import { Users, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../../contexts/project.context";

const ChatHeader = ({ setShowUsers }) => {
  // react router dom
  const navigate = useNavigate();

  // context api
  const { project: currentProject } = useProject();

  return (
    <header className="h-[55px] flex items-center justify-between px-5 py-4 border-b border-gray-700 bg-gray-900/30 backdrop-blur-md">

      {/* navigate to home page */}
      <button
        onClick={() => navigate("/home")}
        className="text-2xl flex items-center gap-2 px-3 font-medium rounded-full text-gray-400 hover:bg-gray-700  hover:text-blue-400 transition cursor-pointer"
      >
          &larr;
      </button>

      {/* message icon and project name  */}
      <div className="flex items-center gap-2">
        <MessageCircle className="text-blue-400" size={22} />
        <h2 className="text-lg font-semibold text-gray-100 truncate max-w-[180px] md:max-w-[240px] select-none">
          {currentProject?.name || "Untitled"}
        </h2>
      </div>

      {/* users icon */}
      <button
        onClick={() => setShowUsers(true)}
        className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-blue-400 transition cursor-pointer"
      >
        <Users size={22} />
      </button>
    </header>
  );
};

export default ChatHeader;
