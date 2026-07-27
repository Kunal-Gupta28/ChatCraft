import { memo, useCallback } from "react";
import BaseModal from "../BaseModal";
import Button from "../Button";
import Input from "../Input";
import { Loader2 } from "lucide-react";

const CreatePopup = ({
  createPopup,
  setCreatePopup,
  projectName,
  setProjectName,
  handleCreateProject,
  createMutation
}) => {
  const handleClose = useCallback(() => {
    setCreatePopup(false);
    setProjectName("");
    createMutation.reset();
  }, [setCreatePopup, setProjectName, createMutation]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && projectName.trim() && !createMutation.isPending) {
      handleCreateProject();
    }
  }, [projectName, createMutation.isPending, handleCreateProject]);

  return (
    <BaseModal open={createPopup} onClose={handleClose}>
      <h3 className="text-2xl font-bold mb-6 text-white">
        Create Project
      </h3>

      <Input
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter project name"
        disabled={createMutation.isPending}
        autoFocus
      />

      <div className="flex justify-end gap-3 mt-5">
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={createMutation.isPending}
        >
          Cancel
        </Button>

        <Button
          onClick={handleCreateProject}
          disabled={createMutation.isPending || !projectName.trim()}
        >
          {createMutation.isPending ? ( <Loader2 className="w-4 h-4 animate-spin text-white" /> ) : ( "Create" )}
        </Button>
      </div>

      {createMutation.isError && (
        <p className="text-red-400 text-sm mt-3">
          {createMutation.error?.response?.data?.message  || "Something went wrong"}
        </p>
      )}
    </BaseModal>
  );
};

export default memo(CreatePopup);