import { memo, useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Bot, Sparkles, MessageSquareCode, Loader2 } from "lucide-react";
import ChatMessageBubble from "../ChatMessageBubble";
import { useUser } from "../../../../contexts/user.context";
import { useMessages } from "../../../../contexts/Messages.context";
import axiosInstance from "../../../../config/axios";
import { mergeMessages } from "../../../../utils/mergeMessages";

import UnreadMentionsBanner from "./UnreadMentionsBanner";

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
    if (!isSearchActive) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const response = await axiosInstance.get("/messages/search", {
          params: {
            projectId,
            query: searchQuery,
            filter: searchFilter,
          },
        });
        if (isMounted) {
          setSearchResults(response.data?.messages || []);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [projectId, searchQuery, searchFilter, isSearchActive]);

  const displayMessages = isSearchActive ? searchResults : messages;

  const currentUsername = useMemo(() => currentUser?.username || "", [currentUser]);

  const unreadMentionMessages = useMemo(() => {
    if (!currentUsername || isSearchActive) return [];
    return messages.filter((msg) => {
      const msgId = msg._id || msg.id;
      if (!msgId || readMentionIds.has(msgId)) return false;
      if (msg.isMine) return false;
      const text = typeof msg.message === "string" ? msg.message : "";
      return text.includes(`@${currentUsername}`);
    });
  }, [messages, currentUsername, readMentionIds, isSearchActive]);

  const handleScrollToMention = useCallback(() => {
    if (unreadMentionMessages.length === 0) return;
    const targetMsg = unreadMentionMessages[0];
    const targetId = targetMsg._id || targetMsg.id;
    const el = document.getElementById(`msg-${targetId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setReadMentionIds((prev) => {
      const next = new Set(prev);
      next.add(targetId);
      saveStoredReadMentionIds(currentUser?._id, next);
      return next;
    });
  }, [unreadMentionMessages, currentUser?._id]);

  const handleDismissMentions = useCallback(() => {
    setReadMentionIds((prev) => {
      const next = new Set(prev);
      unreadMentionMessages.forEach((m) => {
        const id = m._id || m.id;
        if (id) next.add(id);
      });
      saveStoredReadMentionIds(currentUser?._id, next);
      return next;
    });
  }, [unreadMentionMessages, currentUser?._id]);

  useEffect(() => {
    if (displayMessages.length > 0 && !initialScrollDone.current && !isSearchActive) {
      initialScrollDone.current = true;
      requestAnimationFrame(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "auto" });
      });
    }
  }, [displayMessages.length, isSearchActive, chatEndRef]);

  const renderedMessages = useMemo(() => {
    return displayMessages.map((m) => {
      const isMine =
        Boolean(m.isMine) ||
        String(m.sender?._id || m.senderId || m.sender) === String(currentUser?._id);
      return { ...m, isMine };
    });
  }, [displayMessages, currentUser?._id]);

  const fetchEarlierMessages = useCallback(async () => {
    if (loadingEarlier || !hasMore || !projectId || isSearchActive) return;
    setLoadingEarlier(true);

    const prevScrollHeight = containerRef.current?.scrollHeight || 0;
    const nextPage = page + 1;

    try {
      const response = await axiosInstance.get(`/messages/${projectId}`, {
        params: { page: nextPage, limit: 30 },
      });

      const earlier = response.data?.messages || [];
      if (earlier.length === 0) {
        setHasMore(false);
      } else {
        setMessages((existing) => mergeMessages(existing, earlier));
        setPage(nextPage);

        requestAnimationFrame(() => {
          if (containerRef.current) {
            const newScrollHeight = containerRef.current.scrollHeight;
            containerRef.current.scrollTop = newScrollHeight - prevScrollHeight;
          }
        });
      }
    } catch (error) {
      console.error("Failed to load earlier messages:", error);
    } finally {
      setLoadingEarlier(false);
    }
  }, [loadingEarlier, hasMore, projectId, isSearchActive, page, setMessages]);

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop } = e.currentTarget;
      if (scrollTop <= 40 && hasMore && !loadingEarlier && !isSearchActive) {
        fetchEarlierMessages();
      }
    },
    [fetchEarlierMessages, hasMore, loadingEarlier, isSearchActive],
  );

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto overflow-x-hidden w-full min-w-0 p-3 space-y-2.5 bg-[#06090f] font-sans relative custom-scrollbar"
    >
      <UnreadMentionsBanner
        unreadCount={unreadMentionMessages.length}
        onScrollToMention={handleScrollToMention}
        onDismissMentions={handleDismissMentions}
      />

      {loadingEarlier && (
        <div className="flex items-center justify-center py-2 text-xs font-mono text-cyan-400 gap-2">
          <Loader2 size={14} className="animate-spin" />
          <span>Loading earlier messages...</span>
        </div>
      )}

      {isSearching && (
        <div className="flex items-center justify-center py-8 text-xs font-mono text-slate-400 gap-2">
          <Loader2 size={14} className="animate-spin text-cyan-400" />
          <span>Searching chat messages...</span>
        </div>
      )}

      {!isSearching && renderedMessages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center py-16 px-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
            <MessageSquareCode size={24} />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            {isSearchActive ? "No matching messages found" : "Welcome to the Project Workspace"}
          </h4>
          <p className="text-xs text-slate-400 max-w-xs font-mono">
            {isSearchActive
              ? "Try adjusting your search query or filter criteria."
              : "Start collaborating with your team or type @ai to generate full-stack code suggestions."}
          </p>
        </div>
      )}

      {renderedMessages.map((msg) => (
        <ChatMessageBubble key={msg._id || msg.id} msg={msg} isMine={msg.isMine} />
      ))}

      <div ref={chatEndRef} className="h-1" />
    </div>
  );
};

export default memo(ChatMessages);
