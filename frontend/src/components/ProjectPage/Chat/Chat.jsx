import { useState, useEffect, useRef, lazy, Suspense, useCallback } from "react";
import { AtSign, Bot, Pin, Search, X } from "lucide-react";
import { useProject } from "../../../contexts/project.context";
import { useMessages } from "../../../contexts/Messages.context";
import { useChat } from "../../../contexts/chat.context";

import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import Header from "./Header";

// lazy load
const Collaborators = lazy(() => import("./collaborator/Collaborators"));

const SEARCH_FILTERS = [
  { id: "all", label: "All", icon: <Search size={11} /> },
  { id: "mentions", label: "Mentions", icon: <AtSign size={11} /> },
  { id: "pinned", label: "Pinned", icon: <Pin size={11} /> },
  { id: "ai", label: "AI", icon: <Bot size={11} /> },
];

const TypingIndicator = ({ users }) => {
  if (!users.length) return null;

  const names = users.slice(0, 2).map((user) => user.username || "A collaborator");
  const label =
    names.length === 1
      ? `${names[0]} is typing...`
      : users.length === 2
        ? `${names[0]} and ${names[1]} are typing...`
        : `${names[0]}, ${names[1]}, and ${users.length - 2} others are typing...`;

  return (
    <div className="flex items-center gap-2 px-4 pt-2 text-[11px] text-slate-400" role="status" aria-live="polite">
      <span className="flex items-center gap-0.5" aria-hidden="true">
        <span className="h-1 w-1 animate-bounce rounded-full bg-cyan-300 [animation-delay:-0.2s]" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-cyan-300 [animation-delay:-0.1s]" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-cyan-300" />
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
};

const ChatSearchBar = ({ query, filter, onQueryChange, onFilterChange, onClose }) => (
  <div className="border-b border-slate-800/80 bg-[#0b1020]/95 px-3 py-2.5">
    <div className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-950/70 px-2.5 py-1.5 focus-within:border-cyan-300/45">
      <Search size={14} className="shrink-0 text-slate-500" />
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search messages..."
        autoFocus
        className="min-w-0 flex-1 bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-500"
      />
      {query && (
        <button
          type="button"
          onClick={() => onQueryChange("")}
          className="rounded-md p-0.5 text-slate-500 transition hover:bg-slate-800 hover:text-white"
          aria-label="Clear search"
        >
          <X size={13} />
        </button>
      )}
      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-0.5 text-slate-500 transition hover:bg-slate-800 hover:text-white"
        aria-label="Close search"
      >
        <X size={14} />
      </button>
    </div>

    <div className="mt-2 flex items-center gap-1 overflow-x-auto hide-scrollbar">
      {SEARCH_FILTERS.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onFilterChange(id)}
          className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition ${
            filter === id
              ? "bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-300/25"
              : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  </div>
);

const AiThinkingIndicator = ({ isAiThinking }) => {
  if (!isAiThinking) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 mx-3 my-1.5 text-xs text-purple-300 bg-purple-950/60 border border-purple-800/60 rounded-xl w-fit shadow-md animate-pulse shrink-0" role="status" aria-live="polite">
      <Bot size={15} className="animate-spin text-purple-400 shrink-0" />
      <span className="font-semibold tracking-wide text-purple-200">Gemini AI is thinking & generating code...</span>
      <span className="flex items-center gap-1 ml-1" aria-hidden="true">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400" />
      </span>
    </div>
  );
};

const Chat = ({ toggleChat, isFullWidthChat, onToggleFullscreen }) => {
  const [showUsers, setShowUsers] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");

  const { handleSend, typingUsers, isAiThinking } = useChat();
  const chatEndRef = useRef(null);
  const prevLastIdRef = useRef(null);

  const { project } = useProject();
  const { messages } = useMessages();

  // Auto scroll to bottom ONLY when a new latest message arrives (sent or received)
  const lastMessage = messages[messages.length - 1];
  const lastMessageId = lastMessage?._id || lastMessage?.createdAt;

  useEffect(() => {
    if (lastMessageId && lastMessageId !== prevLastIdRef.current) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      prevLastIdRef.current = lastMessageId;
    }
  }, [lastMessageId]);

  // handle enter press
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchFilter("all");
  }, []);

  const toggleSearch = useCallback(() => {
    if (isSearchOpen) {
      closeSearch();
      return;
    }
    setIsSearchOpen(true);
  }, [closeSearch, isSearchOpen]);

  return (
    <div className="w-full h-full flex flex-col bg-[#080b11]/90 backdrop-blur-2xl border-r border-slate-800/80">
      {showUsers ? (
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full text-slate-400 text-xs font-mono">
              Loading collaborators...
            </div>
          }
        >
          <Collaborators setShowUsers={setShowUsers} />
        </Suspense>
      ) : (
        <>
          <Header
            projectName={project?.projectName || "Workspace Chat"}
            memberCount={project?.users?.length || 1}
            onToggleChat={toggleChat}
            onShowUsers={() => setShowUsers(true)}
            onToggleSearch={toggleSearch}
            isSearchOpen={isSearchOpen}
            isFullWidthChat={isFullWidthChat}
            onToggleFullscreen={onToggleFullscreen}
          />
          {isSearchOpen && (
            <ChatSearchBar
              query={searchQuery}
              filter={searchFilter}
              onQueryChange={setSearchQuery}
              onFilterChange={setSearchFilter}
              onClose={closeSearch}
            />
          )}
          <ChatMessages
            chatEndRef={chatEndRef}
            searchQuery={searchQuery}
            searchFilter={searchFilter}
          />
          <AiThinkingIndicator isAiThinking={isAiThinking} />
          <TypingIndicator users={typingUsers} />
          <ChatInput handleKeyPress={handleKeyPress} />
        </>
      )}
    </div>
  );
};

export default Chat;
