import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, LogOut } from "lucide-react";
import { useCallback, useMemo, memo } from "react";
import axiosInstance from "../../config/axios";
import { useUser } from "../../contexts/user.context";

const Header = ({ setCreatePopup, setAvatarPopup }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setUser } = useUser();

  const username = user?.username || "";

  const firstLetter = useMemo(
    () => username?.charAt(0)?.toUpperCase() || "U",
    [username],
  );

  const hasProfilePic = Boolean(user?.profilePic);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => axiosInstance.get("/logout"),

    onSuccess: () => {
      queryClient.clear();
      localStorage.removeItem("token");
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
    setCreatePopup(true);
  }, [setCreatePopup]);

  const openAvatarPopup = useCallback(() => {
    setAvatarPopup(true);
  }, [setAvatarPopup]);

  return (
    <header className="w-full flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-6 lg:mb-8 relative z-10 shrink-0">
      {/* Greeting */}
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          Welcome back,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 capitalize">
            {username || "Developer"}
          </span>{" "}
          👋
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
          Manage and explore your collaborative cloud workspaces below
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* New Project */}
        <button
          onClick={openNewProjectPopup}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition hover:scale-[1.02] shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer border border-blue-500/30"
        >
          <Plus size={18} />
          <span>New Project</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="bg-slate-900/90 text-slate-300 px-3.5 sm:px-4 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white flex items-center gap-1.5 transition text-xs sm:text-sm font-medium border border-slate-800 disabled:opacity-50 cursor-pointer"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </span>
        </button>

        {/* Avatar */}
        <div
          onClick={openAvatarPopup}
          className="cursor-pointer group relative w-10 h-10 sm:w-11 sm:h-11 shrink-0"
        >
          {hasProfilePic ? (
            <img
              src={user.profilePic}
              alt="profile"
              className="w-full h-full rounded-full border-2 border-indigo-500/50 group-hover:border-indigo-400 object-cover transition shadow-md"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-900 via-slate-800 to-slate-900 border border-indigo-500/40 flex items-center justify-center text-slate-100 font-bold text-sm group-hover:border-indigo-400 transition shadow-md">
              {firstLetter}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default memo(Header);