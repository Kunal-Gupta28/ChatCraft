import { useState, useCallback, memo, useEffect, useMemo } from "react";
import { MessageSquare, Pin } from "lucide-react";
import Chat from "./Chat/Chat";
import CodeEditor from "./Code/CodeEditor";
import { useProject } from "../../contexts/project.context";
import { useMessages } from "../../contexts/Messages.context";
import { useUser } from "../../contexts/user.context";

const ResponsiveLayout = ({ editorPresence = [] }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullWidthChat, setIsFullWidthChat] = useState(false);
  const { project } = useProject();
  const { messages } = useMessages();
  const { user } = useUser();

  const projectId = project?._id;
  const currentUserId = user?._id;
  const currentUsername = user?.username;
  const projectUsers = useMemo(() => project?.users || [], [project?.users]);

  const [lastSeenTimestamp, setLastSeenTimestamp] = useState(0);

  // Sync lastSeenTimestamp from localStorage when projectId loads
  useEffect(() => {
    if (!projectId) return;
    const saved = localStorage.getItem(`chat_last_seen_${projectId}`);
    if (saved) {
      setLastSeenTimestamp(parseInt(saved, 10));
    }
  }, [projectId]);

  const markChatAsSeen = useCallback(() => {
    const now = Date.now();
    setLastSeenTimestamp(now);
    if (projectId) {
      localStorage.setItem(`chat_last_seen_${projectId}`, String(now));
    }
  }, [projectId]);

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  // Update lastSeenTimestamp whenever chat drawer is open
  useEffect(() => {
    if (isChatOpen) {
      markChatAsSeen();
    }
  }, [isChatOpen, messages.length, markChatAsSeen]);

  // Compute unseen messages count (only messages sent by other users after lastSeenTimestamp)
  const unreadCount = useMemo(() => {
    if (isChatOpen) return 0;
    return messages.filter((m) => {
      const sender = typeof m.senderId === "object" ? m.senderId?._id : (m.senderId || m.sender?._id || m.sender);
      const isOtherUser = currentUserId ? String(sender) !== String(currentUserId) : true;
      const msgTime = new Date(m.createdAt || Date.now()).getTime();
      return isOtherUser && msgTime > lastSeenTimestamp;
    }).length;
  }, [messages, isChatOpen, lastSeenTimestamp, currentUserId]);

  // Get users who sent unseen messages
  const unreadUsers = useMemo(() => {
    if (isChatOpen) return [];
    const unseenMsgs = messages.filter((m) => {
      const sender = typeof m.senderId === "object" ? m.senderId?._id : (m.senderId || m.sender?._id || m.sender);
      const isOtherUser = currentUserId ? String(sender) !== String(currentUserId) : true;
      const msgTime = new Date(m.createdAt || Date.now()).getTime();
      return isOtherUser && msgTime > lastSeenTimestamp;
    });

    const userMap = new Map();
    unseenMsgs.forEach((m) => {
      const senderId = typeof m.senderId === "object" ? m.senderId?._id : (m.senderId || m.sender?._id || m.sender);
      if (senderId && !userMap.has(String(senderId))) {
        const senderObj = typeof m.senderId === "object"
          ? m.senderId
          : projectUsers.find((u) => String(u._id) === String(senderId)) || {
              _id: senderId,
              username: m.senderName || "User",
            };
        userMap.set(String(senderId), senderObj);
      }
    });

    return Array.from(userMap.values());
  }, [messages, isChatOpen, lastSeenTimestamp, currentUserId, projectUsers]);

  // Check if any unseen message contains a @mention for current user
  const hasUnseenMention = useMemo(() => {
    if (isChatOpen || !currentUsername) return false;
    const mentionRegex = new RegExp(`@${currentUsername}\\b`, "i");

    return messages.some((m) => {
      const sender = typeof m.senderId === "object" ? m.senderId?._id : (m.senderId || m.sender?._id || m.sender);
      const isOtherUser = currentUserId ? String(sender) !== String(currentUserId) : true;
      const msgTime = new Date(m.createdAt || Date.now()).getTime();
      const isUnseen = isOtherUser && msgTime > lastSeenTimestamp;
      return isUnseen && mentionRegex.test(String(m.message || ""));
    });
  }, [messages, isChatOpen, lastSeenTimestamp, currentUserId, currentUsername]);

  // Check if there are any UNSEEN pinned messages (newer than lastSeenTimestamp)
  const hasUnseenPinnedMessage = useMemo(() => {
    if (isChatOpen) return false;
    return messages.some((m) => {
      if (!m.isPinned) return false;
      const pinTime = new Date(m.pinnedAt || m.updatedAt || m.createdAt || Date.now()).getTime();
      return pinTime > lastSeenTimestamp;
    });
  }, [messages, isChatOpen, lastSeenTimestamp]);

  // If there are unread messages, display the unread senders' avatars, otherwise display project users
  const displayAvatars = unreadUsers.length > 0 ? unreadUsers : projectUsers;

  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full flex flex-col p-2 sm:p-2.5 overflow-hidden bg-[#05070d] text-white relative select-none">
      {/* Main Full-Width Code Editor & Live Preview Panel */}
      <section className="bg-[#080b11]/90 border border-slate-800/80 rounded-2xl backdrop-blur-2xl shadow-2xl overflow-hidden flex-1 min-w-0 flex flex-col">
        <CodeEditor
          toggleChat={toggleChat}
          isChatVisible={isChatOpen}
          editorPresence={editorPresence}
        />
      </section>

      {/* Floating Chat Drawer Window (Expanded State) */}
      {isChatOpen ? (
        <section
          className={`fixed z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            isFullWidthChat
              ? "inset-3 sm:inset-6 bg-[#090d16]/98 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl"
              : "bottom-7 right-7 w-[360px] sm:w-[410px] h-[580px] max-h-[85vh] bg-[#090d16]/98 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl"
          } flex flex-col overflow-hidden ring-1 ring-blue-500/20`}
        >
          <div className="flex-1 min-h-0">
            <Chat
              toggleChat={toggleChat}
              isChatVisible={isChatOpen}
              isFullWidthChat={isFullWidthChat}
              onToggleFullscreen={() => setIsFullWidthChat((prev) => !prev)}
            />
          </div>
        </section>
      ) : (
        /* Floating Pill Button & Speech Cloud Container (Collapsed State) */
        <div className="fixed bottom-7 right-7 z-50 flex flex-col items-end">
          {/* Floating Speech Cloud / Notification Bubble */}
          {(hasUnseenMention || hasUnseenPinnedMessage) && (
            <div className="mb-2.5 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#0f1524]/95 border border-amber-400/60 shadow-2xl shadow-amber-500/20 backdrop-blur-2xl text-[11px] font-extrabold text-slate-100 select-none animate-bounce relative">
              {/* Arrow pointing down to pill button */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#0f1524] border-r border-b border-amber-400/60 rotate-45" />

              {hasUnseenMention && (
                <div className="flex items-center gap-1 text-amber-300">
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-400/20 border border-amber-400/50 text-amber-300 font-mono text-[10px]">
                    @{currentUsername}
                  </span>
                  <span>mentioned you</span>
                </div>
              )}

              {hasUnseenMention && hasUnseenPinnedMessage && (
                <span className="text-slate-600 font-bold">•</span>
              )}

              {hasUnseenPinnedMessage && (
                <div className="flex items-center gap-1 text-amber-300">
                  <Pin size={11} className="fill-amber-400 text-amber-400 shrink-0" />
                  <span>Pinned</span>
                </div>
              )}
            </div>
          )}

          {/* Floating Pill Button */}
          <button
            type="button"
            onClick={() => {
              markChatAsSeen();
              setIsFullWidthChat(false);
              setIsChatOpen(true);
            }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#0d121f]/95 border border-slate-700/80 ring-1 ring-blue-500/20 shadow-2xl shadow-black/80 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-2xl group"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/30">
                <MessageSquare size={16} />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -left-1 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-extrabold border-2 border-[#0d121f] min-w-[18px] text-center shadow-md animate-bounce">
                  {unreadCount}
                </span>
              )}
            </div>

            <span className="text-xs font-extrabold text-white tracking-wide group-hover:text-blue-300 transition">
              Messages
            </span>

            {/* Avatars Stack (Unread senders if unread messages exist, else project members) */}
            {displayAvatars.length > 0 && (
              <div className="flex items-center -space-x-2 overflow-hidden ml-1">
                {displayAvatars.slice(0, 3).map((u, idx) => (
                  <img
                    key={u._id || idx}
                    src={
                      u.profilePic ||
                      `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`
                    }
                    alt={u.username}
                    title={
                      unreadUsers.length > 0
                        ? `Unread message from ${u.username}`
                        : u.username
                    }
                    className={`inline-block h-6 w-6 rounded-full ring-2 ring-[#0d121f] object-cover ${
                      unreadUsers.length > 0 ? "ring-red-500/80" : ""
                    }`}
                  />
                ))}
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(ResponsiveLayout);
