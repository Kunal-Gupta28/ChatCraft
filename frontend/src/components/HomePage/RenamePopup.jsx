import { useState, useEffect, useRef, memo, useCallback } from "react";
import BaseModal from "../BaseModal";
import Button from "../Button";
import Input from "../Input";
import { Loader2 } from "lucide-react";

const RenamePopup = ({ renamePopup, onClose, onConfirm, renameMutation }) => {
  const [value, setValue] = useState(renamePopup.projectName || "");
  const inputRef = useRef(null);
  const isSameName = value.trim() === renamePopup.projectName;

  useEffect(() => {
    setValue(renamePopup.projectName || "");
  }, [renamePopup.projectName]);

  useEffect(() => {
    if (renamePopup.open) {
      inputRef.current?.select();
    }
  }, [renamePopup.open]);

  const handleKeyDown = useCallback((e) => {
    if (
      e.key === "Enter" &&
      value.trim() &&
      !isSameName &&
      !renameMutation.isPending
    ) {
      onConfirm(value.trim());
    }
  }, [value, isSameName, renameMutation.isPending, onConfirm]);

  const clickHandler = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isSameName || renameMutation.isPending) return;
    onConfirm(trimmed);
  }, [value, isSameName, renameMutation.isPending, onConfirm]);

  return (
    <BaseModal open={renamePopup.open} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Rename Project</h2>

      <Input
        onKeyDown={handleKeyDown}
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
          disabled={renameMutation.isPending || !value.trim() || isSameName}
          onClick={clickHandler}
        >
          {renameMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            "Save"
          )}
        </Button>
      </div>
      {renameMutation.isError && (
        <p className="text-red-400 text-sm mt-3">
          {renameMutation.error?.response?.data?.message ||
            "Something went wrong"}
        </p>
      )}
    </BaseModal>
  );
};

export default memo(RenamePopup);
