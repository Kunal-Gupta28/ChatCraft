import { memo, useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Bot, Sparkles, MessageSquareCode, AtSign, ChevronDown, Loader2 } from "lucide-react";
import ChatMessageBubble from "./ChatMessageBubble";
import { useUser } from "../../../contexts/user.context";
import { useMessages } from "../../../contexts/Messages.context";
import axiosInstance from "../../../config/axios";
import { mergeMessages } from "../../../utils/mergeMessages";

const getStoredReadMentionIds = (userId) => {
  if (!userId) return new Set();
  try {
    const stored = localStorage.getItem(`chatcraft_read_mentions_${userId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch (e) {
    console.warn("Failed to load read mentions from localStorage", e);
  }
  return new Set();
};

const saveStoredReadMentionIds = (userId, setObj) => {
  if (!userId) return;
  try {
    const arr = Array.from(setObj);
    const trimmed = arr.slice(-500);
    localStorage.setItem(`chatcraft_read_mentions_${userId}`, JSON.stringify(trimmed));
  } catch (e) {
    console.warn("Failed to save read mentions to localStorage", e);
  }
};

const ChatMessages = ({ chatEndRef, searchQuery = "", searchFilter = "all" }) => {
  const { projectId } = useParams();
  const { user: currentUser } = useUser();
  const { messages, setMessages } = useMessages();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const containerRef = useRef(null);
  const initialScrollDone = useRef(false);

  const [readMentionIds, setReadMentionIds] = useState(() =>
    getStoredReadMentionIds(currentUser?._id)
  );
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const isSearchActive = Boolean(searchQuery.trim()) || searchFilter !== "all";

  // Sync read mention IDs on user load or project change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setLoadingEarlier(false);
    initialScrollDone.current = false;
    if (currentUser?._id) {
      setReadMentionIds(getStoredReadMentionIds(currentUser._id));
    }
  }, [projectId, currentUser?._id]);

  useEffect(() => {
    if (!isSearchActive || !projectId) {
      setSearchResults([]);
      setIsSearching(false);
      return undefined;
    }

    let cancelled = false;
    const searchTimeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data } = await axiosInstance.get(`/project/messages/${projectId}`, {
          params: {
            page: 1,
            limit: 100,
            search: searchQuery.trim(),
            filter: searchFilter,
          },
        });
        if (!cancelled) setSearchResults(data?.messages || []);
      } catch (error) {
        if (!cancelled) setSearchResults([]);
        console.error("Failed to search messages:", error);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 750);

    return () => {
      cancelled = true;
      clearTimeout(searchTimeout);
    };
  }, [isSearchActive, projectId, searchFilter, searchQuery]);

  // Always scroll to last message on room entry or initial message load
  useEffect(() => {
    if (messages.length > 0 && !initialScrollDone.current) {
      initialScrollDone.current = true;
      requestAnimationFrame(() => {
        if (chatEndRef?.current) {
          chatEndRef.current.scrollIntoView({ behavior: "auto" });
        } else if (containerRef?.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    }
  }, [messages, chatEndRef]);

  const currentUserId = currentUser?._id;
  const displayedMessages = isSearchActive ? searchResults : messages;

  const renderedMessages = useMemo(() => {
    const userIdStr = String(currentUserId || "");
    const username = currentUser?.username;
    return displayedMessages.map((msg) => {
      const senderIdStr = String(msg.senderId?._id || msg.senderId || "");
      const isMine =
        (userIdStr && senderIdStr === userIdStr) ||
        (username && msg.senderName === username);
      return {
        ...msg,
        isMine,
      };
    });
  }, [displayedMessages, currentUserId, currentUser?.username]);

  // Calculate unread messages mentioning the logged in user
  const unreadMentionMessages = useMemo(() => {
    if (!currentUser?.username) return [];
    const regex = new RegExp(`@${currentUser.username}\\b`, "i");
    const userIdStr = String(currentUserId || "");
    return messages.filter(
      (m) =>
        m._id &&
        !readMentionIds.has(String(m._id)) &&
        String(m.senderId?._id || m.senderId || "") !== userIdStr &&
        regex.test(m.message || "")
    );
  }, [messages, currentUser?.username, currentUserId, readMentionIds]);

  const [activeMentionIndex, setActiveMentionIndex] = useState(0);

  const markMentionAsRead = useCallback((msgId) => {
    if (!msgId || !currentUser?._id) return;
    setReadMentionIds((prev) => {
      const idStr = String(msgId);
      if (prev.has(idStr)) return prev;
      const next = new Set(prev);
      next.add(idStr);
      saveStoredReadMentionIds(currentUser._id, next);
      return next;
    });
  }, [currentUser?._id]);

  const handleScrollToMention = useCallback(() => {
    if (unreadMentionMessages.length === 0) return;
    const targetMsg =
      unreadMentionMessages[activeMentionIndex % unreadMentionMessages.length];
    if (targetMsg) {
      const targetId = targetMsg._id;
      if (targetId) {
        const el = document.getElementById(`msg-${targetId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          markMentionAsRead(targetId);
        }
      }
    }
    setActiveMentionIndex((prev) => (prev + 1) % unreadMentionMessages.length);
  }, [unreadMentionMessages, activeMentionIndex, markMentionAsRead]);

  // IntersectionObserver to auto-mark mentions as read when user views them in chat
  useEffect(() => {
    if (unreadMentionMessages.length === 0 || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const msgId = entry.target.dataset.msgId;
            if (msgId) {
              markMentionAsRead(msgId);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.5,
      }
    );

    unreadMentionMessages.forEach((msg) => {
      if (msg._id) {
        const el = document.getElementById(`msg-${msg._id}`);
        if (el) {
          el.dataset.msgId = String(msg._id);
          observer.observe(el);
        }
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [unreadMentionMessages, markMentionAsRead]);

  // Detect scroll to top for earlier message chunk loading
  const handleScroll = useCallback(
    async (e) => {
      const container = e.currentTarget;
      if (!container || !projectId || isSearchActive) return;

      if (container.scrollTop <= 25 && hasMore && !loadingEarlier && messages.length > 0) {
        setLoadingEarlier(true);
        const prevScrollHeight = container.scrollHeight;
        const nextPage = page + 1;

        try {
          const { data } = await axiosInstance.get(
            `/project/messages/${projectId}`,
            {
              params: {
                page: nextPage,
                limit: 20,
              },
            }
          );

          const earlierMessages = data?.messages || [];
          const pagination = data?.pagination || {};

          if (earlierMessages.length > 0) {
            setMessages((current) => mergeMessages(current, earlierMessages));
            setPage(nextPage);
            setHasMore(pagination.hasMore ?? (earlierMessages.length === 20));

            // Maintain exact scroll position after prepending earlier messages
            requestAnimationFrame(() => {
              if (containerRef.current) {
                const newScrollHeight = containerRef.current.scrollHeight;
                containerRef.current.scrollTop = newScrollHeight - prevScrollHeight;
              }
            });
          } else {
            setHasMore(false);
          }
        } catch (err) {
          console.error("Failed to load earlier messages:", err);
        } finally {
          setLoadingEarlier(false);
        }
      }
    },
    [hasMore, isSearchActive, loadingEarlier, messages.length, page, projectId, setMessages]
  );

  return (
    <section
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 hide-scrollbar bg-[#080b11]/90 select-none relative"
    >
      {/* Loading Earlier Messages Spinner Animation */}
      {!isSearchActive && loadingEarlier && (
        <div className="flex items-center justify-center py-2 select-none">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-lg backdrop-blur-xl animate-pulse">
            <Loader2 size={15} className="animate-spin text-blue-400 shrink-0" />
            <span>Loading earlier messages...</span>
          </div>
        </div>
      )}

      {/* Beginning of Chat History Indicator */}
      {!isSearchActive && !hasMore && messages.length > 0 && (
        <div className="flex items-center justify-center py-1.5 text-[11px] text-slate-500 font-mono select-none">
          <span>• Beginning of message history •</span>
        </div>
      )}

      {/* Sticky Mention Counter & Quick Scroll Pill */}
      {unreadMentionMessages.length > 0 && (
        <div className="sticky top-0 z-20 flex justify-center py-1 select-none">
          <button
            type="button"
            onClick={handleScrollToMention}
            title="Click to scroll to next mention"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111827]/90 border border-slate-700/70 text-slate-300 hover:text-white hover:bg-slate-800/90 transition cursor-pointer text-[11px] font-medium shadow-lg shadow-black/25 backdrop-blur-2xl"
          >
            <AtSign size={12} className="text-cyan-300" />
            <span>
              Mention {((activeMentionIndex - 1 + unreadMentionMessages.length) % unreadMentionMessages.length) + 1} of {unreadMentionMessages.length}
            </span>
            <ChevronDown size={12} className="text-slate-500 ml-0.5" />
          </button>
        </div>
      )}

      {isSearching ? (
        <div className="flex h-full items-center justify-center text-xs text-slate-500">
          <Loader2 size={15} className="mr-2 animate-spin text-cyan-300" />
          Searching messages...
        </div>
      ) : displayedMessages.length === 0 ? (
        isSearchActive ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-slate-500">
            <MessageSquareCode size={24} className="mb-2 text-slate-600" />
            <p className="text-xs font-medium text-slate-400">No matching messages</p>
            <p className="mt-1 text-[11px]">Try another keyword or filter.</p>
          </div>
        ) : (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-400 select-none my-auto">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 shadow-lg shadow-purple-500/10 animate-pulse">
            <Bot size={28} />
          </div>

          <h4 className="text-base font-extrabold text-white mb-1.5 tracking-tight">
            Workspace AI Assistant
          </h4>

          <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
            Chat in real-time with teammates or type <code className="bg-slate-800 text-purple-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono text-[11px]">@ai</code> to ask Gemini to write code or answer questions.
          </p>

          {/* Prompt Suggestion Cards */}
          <div className="flex flex-col gap-2 w-full max-w-xs text-left">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <Sparkles size={14} className="text-purple-400 shrink-0" />
              <span><code className="text-purple-300 font-mono">@ai</code> create an express server app.js</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <MessageSquareCode size={14} className="text-blue-400 shrink-0" />
              <span><code className="text-blue-300 font-mono">@username</code> can you review this file?</span>
            </div>
          </div>
        </div>
        )
      ) : (
        renderedMessages.map((msg, index) => (
          <ChatMessageBubble
            key={msg._id ?? msg.id ?? `msg-${msg.createdAt || index}-${msg.senderName}`}
            msg={msg}
            isMine={msg.isMine}
          />
        ))
      )}
      <div ref={chatEndRef} />
    </section>
  );
};

export default memo(ChatMessages);
