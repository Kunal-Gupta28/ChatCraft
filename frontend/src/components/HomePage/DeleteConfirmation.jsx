import { useState, useEffect, useRef } from "react";
import BaseModal from "../BaseModal";
import Button from "../Button";
import Input from "../Input";

const DeleteConfirmation = ({ open, onClose, onConfirm, projectName }) => {
  const [inputValue, setInputValue] = useState("");
  const deleteBtnRef = useRef(null);

  useEffect(() => {
    if (!open) setInputValue("");
  }, [open]);

  const trimmed = inputValue.trim();
  const isMatch = trimmed === projectName?.trim();

  useEffect(() => {
    if (isMatch) deleteBtnRef.current?.focus();
  }, [isMatch]);

  return (
    <BaseModal open={open} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4 text-red-400">
        Delete Project?
      </h2>

      <p className="text-gray-300 mb-3">This action cannot be undone.</p>

      <p className="text-gray-400 text-sm mb-4">
        Type:
        <span className="text-gray-200 font-semibold">
          {` "${projectName}"`}
        </span>
      </p>

      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={`Type "${projectName}"`}
        autoFocus
      />

      <div className="flex justify-end gap-3 mt-5">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button
          ref={deleteBtnRef}
          variant="danger"
          onClick={onConfirm}
          disabled={!isMatch}
        >
          Delete
        </Button>
      </div>
    </BaseModal>
  );
};

export default DeleteConfirmation;