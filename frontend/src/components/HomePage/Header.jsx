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
    <div className="h-[13%] lg:h-[10%] flex gap-6 sm:flex-row justify-between sm:items-center max-w-[85vw] mx-auto mb-6 lg:mb-10 relative z-10">
      <div className="flex flex-col justify-between">
        {/* heading */}
        <h1 className="text-2xl lg:text-4xl font-bold ">
          Welcome,
          <br /> {username} 👋
        </h1>

        {/* paragraph */}
        <p className="text-gray-400 text-sm sm:text-base mt-1 w-34 sm:w-38 md:w-48 lg:w-76">
          Manage and explore your projects below
        </p>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* new project button */}
        <button
          onClick={() => setShowPopup(true)}
          className="
    bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg sm:rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition cursor-pointer hover:scale-105 text-sm sm:text-base
    /* Mobile: Floating Action Button */
    fixed bottom-6 right-6 sm:static sm:relative w-14 h-14 sm:w-auto sm:h-auto rounded-full sm:rounded-lg

    /* Hide label text on mobile */
    [&>span]:hidden sm:[&>span]:inline   z-50"
        >
          <Plus size={22} />
          <span>New Project</span>
        </button>

        {/* logout button */}
        <button
          onClick={handleLogout}
          className="bg-gray-700 text-gray-300 p-4 sm:py-2 rounded-lg hover:bg-gray-600 flex items-center gap-1 sm:gap-2 transition cursor-pointer text-sm sm:text-base"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>

        {/* show profile picture if present in user context if not then show First letter of the username */}
        <div
          onClick={() => setShowAvatarPopup(true)}
          className="cursor-pointer group w-14 h-14"
        >
          {user?.profilePic ? (
            <div className="w-full h-full rounded-full overflow-hidden flex justify-center items-center">
              <img
                src={user.profilePic}
                className="w-full h-full rounded-full border border-gray-700 object-cover group-hover:opacity-80 transition"
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-sm">
              {username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
