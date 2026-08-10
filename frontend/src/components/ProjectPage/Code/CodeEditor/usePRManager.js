import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../../config/axios";
import { emitSocketEvent, receiveMessage } from "../../../../config/socket";

export const usePRManager = ({ project, currentUser, isOwner, setFileTree, triggerToast }) => {
  const localStorageKey = project?._id ? `chatcraft_draft_${project._id}` : null;
  const [modifiedFiles, setModifiedFiles] = useState(() => {
    if (!localStorageKey) return {};
    try {
      const saved = localStorage.getItem(localStorageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isBehindMain, setIsBehindMain] = useState(false);
  const [pendingPRs, setPendingPRs] = useState([]);
  const [isPRModalOpen, setIsPRModalOpen] = useState(false);

  useEffect(() => {
    if (!localStorageKey) return;
    try {
      if (Object.keys(modifiedFiles).length === 0) {
        localStorage.removeItem(localStorageKey);
      } else {
        localStorage.setItem(localStorageKey, JSON.stringify(modifiedFiles));
      }
    } catch {}
  }, [localStorageKey, modifiedFiles]);

  useEffect(() => {
    const cleanups = [
      receiveMessage("project-pr-received", (prPayload) => {
        setPendingPRs((prev) => [...prev.filter((p) => p.id !== prPayload.id), prPayload]);
        if (isOwner) triggerToast(`📬 New PR from ${prPayload.author?.username || "Collaborator"}: ${prPayload.title}`, "info");
      }),
      receiveMessage("project-pr-[#merged]", ({ prId }) => {
        setPendingPRs((prev) => prev.filter((p) => p.id !== prId));
        triggerToast("✅ PR Merged into Main branch!", "success");
      }),
      receiveMessage("project-pr-[#rejected]", ({ prId }) => {
        setPendingPRs((prev) => prev.filter((p) => p.id !== prId));
        triggerToast("❌ PR Proposal Declined", "warn");
      }),
      receiveMessage("project-files-updated", () => {
        if (!isOwner && Object.keys(modifiedFiles).length > 0) {
          setIsBehindMain(true);
        }
      })
    ];
    return () => cleanups.forEach((fn) => fn?.());
  }, [isOwner, modifiedFiles, triggerToast]);

  const handleSubmitPR = useCallback(({ title, description, proposedTree }) => {
    const prPayload = {
      id: `pr-${Date.now()}`,
      projectId: project?._id,
      title,
      description,
      proposedTree,
      author: { _id: currentUser?._id, username: currentUser?.username || "Collaborator" }
    };
    emitSocketEvent("project-pr-submit", prPayload);
    setPendingPRs((prev) => [...prev, prPayload]);
    triggerToast("🎉 PR Submitted Successfully! Awaiting Owner Review", "success");
  }, [currentUser?._id, currentUser?.username, project?._id, triggerToast]);

  const handleApprovePR = useCallback((prId, proposedTree) => {
    setFileTree(proposedTree);
    if (project?._id) {
      emitSocketEvent("project-files-apply", { projectId: project._id, fileTree: proposedTree });
      axiosInstance.put("/project/update-file-tree", { projectId: project._id, fileTree: proposedTree }).catch(() => {});
      emitSocketEvent("project-pr-approve", { projectId: project._id, prId });
    }
    setPendingPRs((prev) => prev.filter((p) => p.id !== prId));
    setIsPRModalOpen(false);
    triggerToast("🚀 Approved & Merged PR to Main branch!", "success");
  }, [project?._id, setFileTree, triggerToast]);

  const handleRejectPR = useCallback((prId) => {
    if (project?._id) {
      emitSocketEvent("project-pr-reject", { projectId: project._id, prId });
    }
    setPendingPRs((prev) => prev.filter((p) => p.id !== prId));
    if (pendingPRs.length <= 1) setIsPRModalOpen(false);
    triggerToast("PR Proposal Rejected", "warn");
  }, [pendingPRs.length, project?._id, triggerToast]);

  const handleSyncMain = useCallback(() => {
    setIsBehindMain(false);
    triggerToast("⚡ Synced with latest Main branch!", "info");
  }, [triggerToast]);

  const handleDiscardDraft = useCallback(() => {
    setModifiedFiles({});
    if (localStorageKey) localStorage.removeItem(localStorageKey);
    setIsBehindMain(false);
    triggerToast("🗑️ Local Draft Discarded", "info");
  }, [localStorageKey, triggerToast]);

  return {
    modifiedFiles, setModifiedFiles, isBehindMain, pendingPRs, isPRModalOpen,
    setIsPRModalOpen, handleSubmitPR, handleApprovePR, handleRejectPR, handleSyncMain, handleDiscardDraft
  };
};
