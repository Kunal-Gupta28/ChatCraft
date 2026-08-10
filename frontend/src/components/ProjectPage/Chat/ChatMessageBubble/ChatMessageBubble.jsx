import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { useUser } from "../../../../contexts/user.context";
import { useProject } from "../../../../contexts/project.context";
import { useChat } from "../../../../contexts/chat.context";
import { useCodeEditor } from "../../../../contexts/codeEditor.context";
import { sendMessage } from "../../../../config/socket";
import { getFileTreeDiffs } from "../../../../utils/fileTree";

import {
  checkIsApplied, markAsApplied, checkIsCancelled, markAsCancelled,
  unmarkAsCancelled, stopAllAudios
} from "./helpers.jsx";
import AIMessageCard from "./AIMessageCard";
import UserMessageCard from "./UserMessageCard";
import CollaboratorMessageCard from "./CollaboratorMessageCard";

const ChatMessageBubble = ({ msg, isMine }) => {
  const { user: currentUser } = useUser();
  const { project } = useProject();
  const { fileTree, setActiveSuggestion } = useCodeEditor();
  const {
    startEditMessage,
    handleDeleteMessage,
    handleTogglePinMessage,
    startReplyMessage,
    handleToggleReaction,
  } = useChat();

  const currentProjectId = project?._id;
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCodeSuggestion, setShowCodeSuggestion] = useState(false);
  const [isApplyingSuggestion, setIsApplyingSuggestion] = useState(false);
  const [applySuggestionError, setApplySuggestionError] = useState("");
  const [isSuggestionApplied, setIsSuggestionApplied] = useState(() => checkIsApplied(msg, currentProjectId));
  const [isCancelled, setIsCancelled] = useState(() => checkIsCancelled(msg, currentProjectId));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isPinned = Boolean(msg.isPinned);

  const formattedTime = useMemo(() => {
    if (!msg?.createdAt) return "";
    const date = new Date(msg.createdAt);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [msg?.createdAt]);

  const isAI = msg.senderName === "AI" || msg.senderName === "Gemini";
  const isAudioMessage = msg.type === "audio" && Boolean(msg.audioUrl);

  const codeSuggestionObj = useMemo(() => {
    if (msg?.codeSuggestion?.fileTree) return msg.codeSuggestion;
    if (msg?.fileTree) return { fileTree: msg.fileTree, buildCommand: msg.buildCommand, startCommand: msg.startCommand };
    return null;
  }, [msg]);

  const hasCodeSuggestion = Boolean(codeSuggestionObj?.fileTree);

  const isDiffEmpty = useMemo(() => {
    if (!hasCodeSuggestion || !fileTree || !codeSuggestionObj?.fileTree) return false;
    try {
      const diffs = getFileTreeDiffs(fileTree, codeSuggestionObj.fileTree);
      return diffs.length === 0;
    } catch {
      return false;
    }
  }, [hasCodeSuggestion, fileTree, codeSuggestionObj?.fileTree]);

  const isApplied = isSuggestionApplied || isDiffEmpty || checkIsApplied(msg, currentProjectId);

  const matchedUser = useMemo(() => {
    if (isMine) return currentUser;
    return project?.users?.find(
      (u) => String(u._id) === String(msg.senderId) || u.username === msg.senderName
    );
  }, [isMine, currentUser, project?.users, msg.senderId, msg.senderName]);

  const avatarPic = matchedUser?.profilePic;
  const initial = (isMine ? currentUser?.username : msg.senderName)?.charAt(0)?.toUpperCase() || "U";

  useEffect(() => {
    setShowMenu(false);
    setShowReactions(false);
    setIsDeleting(false);
    setShowCodeSuggestion(false);
    setIsApplyingSuggestion(false);
    setApplySuggestionError("");
    setIsSuggestionApplied(checkIsApplied(msg, currentProjectId));
    setIsCancelled(checkIsCancelled(msg, currentProjectId));
  }, [msg._id, msg.id, msg, currentProjectId]);

  const handleStartEdit = useCallback(() => {
    startEditMessage({ id: msg._id ?? msg.id, message: msg.message });
  }, [startEditMessage, msg]);

  const handleDelete = useCallback(() => {
    setShowMenu(false);
    setShowReactions(false);
    setIsDeleting(true);
    setTimeout(() => {
      handleDeleteMessage(msg._id ?? msg.id);
    }, 160);
  }, [handleDeleteMessage, msg._id, msg.id]);

  const handleCopy = useCallback(() => {
    setShowMenu(false);
    setShowReactions(false);
    if (!msg.message) return;
    navigator.clipboard.writeText(msg.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }, [msg.message]);

  const handleTogglePin = useCallback(() => {
    setShowMenu(false);
    setShowReactions(false);
    handleTogglePinMessage(msg._id ?? msg.id);
  }, [handleTogglePinMessage, msg._id, msg.id]);

  const handleReaction = useCallback(
    (emoji) => {
      setShowReactions(false);
      handleToggleReaction(msg._id ?? msg.id, emoji);
    },
    [handleToggleReaction, msg._id, msg.id],
  );

  const handleSpeakMessage = useCallback(() => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    stopAllAudios();

    const cleanText = (msg.message || "")
      .replace(/```[\s\S]*?```/g, "Code snippet generated.")
      .replace(/[*_#`]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const sweetVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Samantha") ||
          v.name.includes("Victoria") ||
          v.name.includes("Google US English") ||
          v.name.includes("Zira") ||
          v.name.includes("Karen") ||
          v.name.includes("Female"))
    ) || voices.find((v) => v.lang.startsWith("en"));

    if (sweetVoice) utterance.voice = sweetVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [msg.message, isSpeaking]);

  const handleApplySuggestion = useCallback(
    async ({ fileTree: suggestedFileTree, buildCommand, startCommand }) => {
      setIsApplyingSuggestion(true);
      setApplySuggestionError("");

      try {
        await sendMessage("project-files-apply", {
          fileTree: suggestedFileTree,
          buildCommand,
          startCommand,
        });
        markAsApplied(msg, currentProjectId);
        setIsSuggestionApplied(true);
        setShowCodeSuggestion(false);
      } catch (error) {
        setApplySuggestionError(error.message || "Could not apply the AI suggestion.");
      } finally {
        setIsApplyingSuggestion(false);
      }
    },
    [msg, currentProjectId],
  );

  const openReviewModal = useCallback(() => {
    setApplySuggestionError("");
    if (typeof setActiveSuggestion === "function") {
      setActiveSuggestion({
        suggestion: codeSuggestionObj,
        onApply: async (payload) => {
          await handleApplySuggestion(payload);
          markAsApplied(msg, currentProjectId);
          setIsSuggestionApplied(true);
        },
        onCancel: () => {
          markAsCancelled(msg, currentProjectId);
          setIsCancelled(true);
        },
        onClose: () => {},
      });
    }
  }, [codeSuggestionObj, handleApplySuggestion, msg, currentProjectId, setActiveSuggestion]);

  const handleUncancelAndReview = useCallback(() => {
    unmarkAsCancelled(msg, currentProjectId);
    setIsCancelled(false);
    openReviewModal();
  }, [msg, currentProjectId, openReviewModal]);

  if (isAI) {
    return (
      <AIMessageCard
        msg={msg}
        formattedTime={formattedTime}
        currentUser={currentUser}
        isSpeaking={isSpeaking}
        handleSpeakMessage={handleSpeakMessage}
        hasCodeSuggestion={hasCodeSuggestion}
        isApplied={isApplied}
        isCancelled={isCancelled}
        openReviewModal={openReviewModal}
        handleUncancelAndReview={handleUncancelAndReview}
        showMenu={showMenu}
        showReactions={showReactions}
        isDeleting={isDeleting}
      />
    );
  }

  if (isMine) {
    return (
      <UserMessageCard
        msg={msg}
        isMine={isMine}
        isAudioMessage={isAudioMessage}
        isPinned={isPinned}
        copied={copied}
        formattedTime={formattedTime}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        showReactions={showReactions}
        setShowReactions={setShowReactions}
        handleCopy={handleCopy}
        handleTogglePin={handleTogglePin}
        handleStartEdit={handleStartEdit}
        handleDelete={handleDelete}
        handleReaction={handleReaction}
        startReplyMessage={startReplyMessage}
        currentUser={currentUser}
        isDeleting={isDeleting}
      />
    );
  }

  return (
    <CollaboratorMessageCard
      msg={msg}
      isMine={isMine}
      isAudioMessage={isAudioMessage}
      isPinned={isPinned}
      copied={copied}
      formattedTime={formattedTime}
      showMenu={showMenu}
      setShowMenu={setShowMenu}
      showReactions={showReactions}
      setShowReactions={setShowReactions}
      handleCopy={handleCopy}
      handleTogglePin={handleTogglePin}
      handleStartEdit={handleStartEdit}
      handleDelete={handleDelete}
      handleReaction={handleReaction}
      startReplyMessage={startReplyMessage}
      currentUser={currentUser}
      avatarPic={avatarPic}
      initial={initial}
      isDeleting={isDeleting}
      showCodeSuggestion={showCodeSuggestion}
      setShowCodeSuggestion={setShowCodeSuggestion}
      codeSuggestionObj={codeSuggestionObj}
      fileTree={fileTree}
      handleApplySuggestion={handleApplySuggestion}
      isApplyingSuggestion={isApplyingSuggestion}
      applySuggestionError={applySuggestionError}
    />
  );
};

export default memo(ChatMessageBubble);
