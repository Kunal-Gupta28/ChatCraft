import BaseModal from "../BaseModal";
import Button from "../Button";
import Input from "../Input";
import { Loader2 } from "lucide-react";

const CreateProjectModal = ({
  showPopup,
  setShowPopup,
  projectName,
  setProjectName,
  handleCreateProject,
  loading,
  error,
  setError,
}) => {
  const handleClose = () => {
    setShowPopup(false);
    setProjectName("");
    setError(null);
  };

  return (
    <BaseModal open={showPopup} onClose={handleClose}>
      <h3 className="text-2xl font-bold mb-6">Create Project</h3>

      <Input
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Enter project name"
        disabled={loading}
        autoFocus
      />

      <div className="flex justify-end gap-3 mt-5">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>

        <Button
          onClick={handleCreateProject}
          disabled={loading || !projectName.trim()}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Create"}
        </Button>
      </div>

      {error && <p className="text-red-400 mt-3">{error}</p>}
    </BaseModal>
  );
};

export default CreateProjectModal;