import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../config/axios";
import { useUser } from "../contexts/user.context";
import { useProject } from "../contexts/project.context";

import BackgroundBlobs from "../components/BackgroundBlobs";
import Header from "../components/HomePage/Header";
import SearchBar from "../components/HomePage/SearchBar";
import ProjectList from "../components/HomePage/ProjectList";
import CreateProjectModal from "../components/HomePage/CreateProjectModal";
import SuccessToast from "../components/HomePage/SuccessToast";
import AvatarPicker from "../components/HomePage/AvatarPicker";

const Home = () => {

  // context api
  const { user } = useUser();
  const { setProject } = useProject();

  // state variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allProject, setAllProject] = useState([]);
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);

  // fetching all projects and save it in allProject
  const fetchAllProjects = async () => {
    try {
      const { data } = await axiosInstance.get("/project/all");
      setAllProject(data.allProject);
    } catch (err) {
      console.log(err);
    }
  };

  // whenever user's values changes fetch the all project data
  useEffect(() => {
    fetchAllProjects();
  }, [user]);

  // create project
  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await axiosInstance.post("/project/create", {
        name: projectName,
      });

      setSuccess(true);
      setShowPopup(false);
      setProjectName("");
      fetchAllProjects();

      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // filter project by input
  const filteredProjects = allProject.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-gray-950 text-white px-6 py-10 relative overflow-hidden select-none"
    >
      {/* background Blobs */}
      <BackgroundBlobs />

      <Header
        setShowPopup={setShowPopup}
        setShowAvatarPopup={setShowAvatarPopup}
      />

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <ProjectList
        filteredProjects={filteredProjects}
        setProject={setProject}
      />

      <CreateProjectModal
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        projectName={projectName}
        setProjectName={setProjectName}
        handleCreateProject={handleCreateProject}
        loading={loading}
        error={error}
        setError={setError}
      />

      <AvatarPicker
        open={showAvatarPopup}
        onClose={() => setShowAvatarPopup(false)}
      />

      <SuccessToast success={success} />
    </motion.div>
  );
};

export default Home;
