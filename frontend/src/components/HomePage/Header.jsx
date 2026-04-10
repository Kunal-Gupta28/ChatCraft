import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, LogOut } from "lucide-react";
import { useCallback, useMemo } from "react";
import axiosInstance from "../../config/axios";
import { useUser } from "../../contexts/user.context";

const Header = ({ setShowPopup, setShowAvatarPopup }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setUser } = useUser();

  const username = user?.username || "";

  const firstLetter = useMemo(
    () => username.charAt(0).toUpperCase(),
    [username],
  );

  const hasProfilePic = Boolean(user?.profilePic);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => axiosInstance.get("/logout"),

    onSuccess: () => {
      queryClient.clear();
      localStorage.removeItem('token')
      setUser(null);
      navigate("/auth/login", { replace: true });
    },

    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const openNewProjectPopup = useCallback(() => {
    setShowPopup(true);
  }, [setShowPopup]);

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

        <p className="text-gray-400 text-sm sm:text-base mt-1">
          Manage and explore your projects below
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* New Project */}
        <button
          onClick={openNewProjectPopup}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition hover:scale-105"
        >
          <Plus size={22} />
          <span>New Project</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2 transition disabled:opacity-50"
        >
          <LogOut size={18} />
          <span>
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </span>
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
              className="w-full h-full rounded-full border border-gray-700 object-cover"
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