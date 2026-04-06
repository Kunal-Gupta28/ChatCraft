import { useState, useEffect, useRef } from "react";
import BaseModal from "../BaseModal";
import Button from "../Button";
import Input from "../Input";
import { useProject } from "../../contexts/project.context";

const RenameProjectPopup = ({ open, onClose, onConfirm }) => {
  const { project } = useProject();
  const projectName = project?.projectName || "";

  const [value, setValue] = useState(projectName);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setValue(projectName);
  }, [open, projectName]);

  useEffect(() => {
    inputRef.current?.select();
  }, [open]);

  const trimmed = value.trim();
  const isDisabled = !trimmed || trimmed === projectName.trim();

  return (
    <BaseModal open={open} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Rename Project</h2>

      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="New name"
        autoFocus
      />

      <div className="flex justify-end gap-3 mt-5">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="primary"
          disabled={isDisabled}
          onClick={() => onConfirm(trimmed)}
        >
          Save
        </Button>
      </div>
    </BaseModal>
  );
};

export default RenameProjectPopup;