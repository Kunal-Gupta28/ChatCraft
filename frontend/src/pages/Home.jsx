import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../config/axios";
import {
  Plus,
  LogOut,
  Search,
  Folder,
  Users,
  ArrowRight,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";
import AvatarPicker from "../components/AvatarPicker";
import { useUser } from "../contexts/user.context";
import { useProject } from "../contexts/project.context";

const Home = () => {
  const { user } = useUser();
  const { setProject } = useProject();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allProject, setAllProject] = useState([]);
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const username = user?.username;

  const fetchAllProjects = async () => {
    try {
      const { data } = await axiosInstance.get("/project/all");
      setAllProject(data.allProject);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, [user]);

  const handleCreateProject = () => {
    if (!projectName.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    axiosInstance
      .post("/project/create", { name: projectName })
      .then(() => {
        setSuccess(true);
        setShowPopup(false);
        setProjectName("");
        fetchAllProjects();
        setTimeout(() => setSuccess(false), 2500);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const filteredProjects = allProject.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.get("/logout");
      if (response.status == 200) {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-gray-950 text-white px-6 py-10 relative overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute top-0 -left-20 w-[300px] h-[300px] bg-gradient-to-r from-blue-700 to-purple-700 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 -right-20 w-[300px] h-[300px] bg-gradient-to-bl from-green-500 to-cyan-500 rounded-full blur-3xl opacity-15" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex justify-between items-center max-w-[85vw] mx-auto mb-12 relative z-10"
      >
        <div>
          <h1 className="text-4xl font-bold text-white">
            Welcome, {username} 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Manage and explore your projects below.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Profile Picture */}
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

          <button
            onClick={() => setShowPopup(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition"
          >
            <Plus size={18} />
            New Project
          </button>

          <button
            onClick={handleLogout}
            className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="max-w-[85vw] mx-auto mb-8 relative z-10">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="Search projects by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-12 bg-gray-800 border border-gray-700 rounded-xl outline-none text-gray-200"
          />
        </div>
      </div>

      {/* Project List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[85vw] mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 relative z-10"
      >
        <AnimatePresence>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <motion.div
                key={project._id}
                variants={itemVariants}
                onClick={() => navigate("/project", setProject(project))}
                className="bg-gray-800/70 p-6 rounded-2xl shadow-lg cursor-pointer border border-gray-700 hover:border-blue-500 transition hover:-translate-y-2 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Folder className="text-blue-400" size={24} />
                  <h2 className="text-xl font-semibold truncate">
                    {project.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm mb-5">
                  <Users size={16} />
                  <span>{project.users.length} member(s)</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-400">Open Project</span>
                  <ArrowRight
                    size={18}
                    className="text-gray-500 group-hover:text-blue-400 transition"
                  />
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full text-center text-gray-400 mt-[25vh]"
            >
              <p>No projects found 🫤</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-gray-900 p-8 rounded-2xl shadow-xl min-w-[400px] border border-gray-700 relative"
            >
              <button
                onClick={() => {
                  setShowPopup(false);
                  setProjectName("");
                  setError(null);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                Create New Project
              </h3>

              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(event) =>
                  event.key === "Enter" && handleCreateProject()
                }
                placeholder="Enter project name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg mb-5 outline-none text-white"
                disabled={loading}
                autoFocus
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setProjectName("");
                    setError(null);
                  }}
                  className="px-5 py-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition"
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateProject}
                  disabled={loading || !projectName.trim()}
                  className={`px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2 min-w-[110px] ${
                    loading || !projectName.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105 transition"
                  }`}
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    "Create"
                  )}
                </button>
              </div>

              {error && <p className="text-red-400 mt-4">{error}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AvatarPicker
        open={showAvatarPopup}
        onClose={() => setShowAvatarPopup(false)}
      />

      {/* Toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 bg-green-700/90 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle size={20} />
            <span>Project created successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
