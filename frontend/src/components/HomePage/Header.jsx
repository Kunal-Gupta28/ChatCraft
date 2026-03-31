import { useNavigate } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import { useCallback, useMemo } from "react";
import axiosInstance from "../../config/axios";
import { useUser } from "../../contexts/user.context";

const Header = ({ setShowPopup, setShowAvatarPopup }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const username = user?.username || "User";

  // user's name first letter
  const firstLetter = useMemo(
    () => username.charAt(0).toUpperCase(),
    [username],
  );

  // user has profile picture
  const hasProfilePic = Boolean(user?.profilePic);

  // logout
  const handleLogout = useCallback(async () => {
    try {
      await axiosInstance.get("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.clear();
      navigate("/auth/login");
    }
  }, [navigate]);

  // new project popup
  const openNewProjectPopup = useCallback(() => {
    setShowPopup(true);
  }, [setShowPopup]);

  // avatar popup 
  const openAvatarPopup = useCallback(() => {
    setShowAvatarPopup(true);
  }, [setShowAvatarPopup]);

  return (
    <div className="h-[13%] lg:h-[10%] flex gap-6 sm:flex-row justify-between sm:items-center max-w-[85vw] mx-auto mb-6 lg:mb-10 relative z-10">
      {/* Greeting */}
      <div className="flex flex-col justify-between">
        <h1 className="text-2xl lg:text-4xl font-bold">
          Welcome,
          <br /> {username} 👋
        </h1>

        <p className="text-gray-400 text-sm sm:text-base mt-1 w-34 sm:w-38 md:w-48 lg:w-76">
          Manage and explore your projects below
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* New Project */}
        <button
          onClick={openNewProjectPopup}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 flex items-center justify-center gap-1 sm:gap-2 transition hover:scale-105 text-sm sm:text-base
          fixed bottom-6 right-6 sm:static w-14 h-14 sm:w-auto sm:h-auto rounded-full sm:rounded-lg
          [&>span]:hidden sm:[&>span]:inline z-50"
        >
          <Plus size={22} />
          <span>New Project</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-gray-700 text-gray-300 p-4 sm:py-2 rounded-lg hover:bg-gray-600 flex items-center gap-1 sm:gap-2 transition text-sm sm:text-base"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>

        {/* Avatar */}
        <div
          onClick={openAvatarPopup}
          className="cursor-pointer group w-12 h-12"
        >
          {hasProfilePic ? (
            <img
              src={user.profilePic}
              alt="profile"
              className="w-full h-full rounded-full border border-gray-700 object-cover group-hover:opacity-80 transition"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
              {firstLetter}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
