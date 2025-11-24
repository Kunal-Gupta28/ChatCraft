import { useNavigate } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import axiosInstance from "../../config/axios";
import { useUser } from "../../contexts/user.context";

const Header = ({ setShowPopup, setShowAvatarPopup }) => {
  const navigate = useNavigate();

  // context api
  const { user } = useUser();
  const username = user?.username;

  // clear the local storage and navigate to login page
  const handleLogout = async () => {
    try {
      const response = await axiosInstance.get("/logout");
      if (response.status === 200) {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between items-center max-w-[85vw] mx-auto mb-12 relative z-10">
      <div>
        {/* heading */}
        <h1 className="text-4xl font-bold">Welcome, {username} 👋</h1>

        {/* paragraph */}
        <p className="text-gray-400 mt-1">
          Manage and explore your projects below.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* show profile picture if present in user context if not then show First letter of the username */}
        <div
          onClick={() => setShowAvatarPopup(true)}
          className="cursor-pointer group"
        >
          {user?.profilePic ? (
            <div className="w-10 h-10 rounded-full overflow-hidden flex justify-center items-center">
              <img
                src={user.profilePic}
                className="w-20 h-20 rounded-full border border-gray-700 object-cover group-hover:opacity-80 transition"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-sm">
              {username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* new project button */}
        <button
          onClick={() => setShowPopup(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition cursor-pointer"
        >
          <Plus size={18} />
          New Project
        </button>

        {/* logout button */}
        <button
          onClick={handleLogout}
          className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2 transition cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
