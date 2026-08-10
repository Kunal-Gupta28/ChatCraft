import { useState, useCallback, useMemo } from "react";
import { emitSocketEvent } from "../../../../config/socket";

export const useMentions = ({ project, currentUser, inputMessage, setInputMessage, isTypingRef, typingTimeoutRef }) => {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const mentionCandidates = useMemo(() => [
    { username: "ai", name: "Gemini AI Companion", isAI: true },
    ...(project?.users
      ?.filter(
        (u) =>
          String(u._id || "") !== String(currentUser?._id || "") &&
          u.username !== currentUser?.username
      )
      ?.map((u) => ({
        username: u.username,
        name: u.username,
        isAI: false,
        profilePic: u.profilePic,
      })) || []),
  ], [currentUser?.username, currentUser?._id, project?.users]);

  const filteredMentions = useMemo(() => {
    if (!mentionQuery) return mentionCandidates;
    return mentionCandidates.filter(
      (c) =>
        c.username.toLowerCase().includes(mentionQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(mentionQuery.toLowerCase())
    );
  }, [mentionCandidates, mentionQuery]);

  const handleTypingNotice = useCallback(
    (isTyping) => {
      if (isTyping && isTypingRef.current === true) return;
      isTypingRef.current = isTyping;
      emitSocketEvent("project-typing", { isTyping });
    },
    [isTypingRef]
  );

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (isTypingRef.current) {
      isTypingRef.current = false;
      emitSocketEvent("project-typing", { isTyping: false });
    }
  }, [isTypingRef, typingTimeoutRef]);

  const handleInputChange = useCallback(
    (e) => {
      const val = e.target.value;
      setInputMessage(val);

      if (val.trim()) {
        handleTypingNotice(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          stopTyping();
        }, 3000);
      } else {
        stopTyping();
      }

      const cursor = e.target.selectionStart ?? val.length;
      const textBeforeCursor = val.slice(0, cursor);
      const lastAt = textBeforeCursor.lastIndexOf("@");

      if (lastAt !== -1 && (lastAt === 0 || /\s/.test(val[lastAt - 1]))) {
        const query = textBeforeCursor.slice(lastAt + 1);
        if (!/\s/.test(query)) {
          setShowMentions(true);
          setMentionQuery(query);
          setSelectedIndex(0);
          return;
        }
      }
      setShowMentions(false);
    },
    [handleTypingNotice, stopTyping, setInputMessage, typingTimeoutRef]
  );

  const selectMention = useCallback(
    (item) => {
      if (!item) return;
      const lastAt = inputMessage.lastIndexOf("@");

      if (lastAt !== -1) {
        const before = inputMessage.slice(0, lastAt);
        setInputMessage(`${before}@${item.username} `);
      } else {
        setInputMessage(`${inputMessage}@${item.username} `);
      }

      setShowMentions(false);
      setMentionQuery("");
    },
    [inputMessage, setInputMessage]
  );

  return {
    showMentions, setShowMentions, mentionQuery, selectedIndex, setSelectedIndex,
    filteredMentions, handleInputChange, selectMention, stopTyping
  };
};
