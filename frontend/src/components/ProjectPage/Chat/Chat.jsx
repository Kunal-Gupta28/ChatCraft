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
    <div className="flex items-center gap-2 px-4 pt-2 text-[11px] text-slate-400 shrink-0" role="status" aria-live="polite">
      <span className="flex items-center gap-0.5" aria-hidden="true">
        <span className="h-1 w-1 animate-bounce rounded-full bg-cyan-300 [animation-delay:-0.2s]" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-cyan-300 [animation-delay:-0.1s]" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-cyan-300" />
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
};

const AiThinkingIndicator = ({ isAiThinking, aiThinkingUser }) => {
  if (!isAiThinking) return null;
  const username = aiThinkingUser?.username || "Gemini AI";

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-[11px] text-cyan-300 bg-cyan-500/10 border-t border-cyan-500/20 shrink-0" role="status" aria-live="polite">
      <Bot size={13} className="animate-spin text-cyan-400" />
      <span className="truncate font-semibold">{username} is generating code...</span>
    </div>
  );
};

const ChatSearchBar = ({ query, filter, onQueryChange, onFilterChange, onClose }) => (
  <div className="border-b border-slate-800/80 bg-[#0b1020]/95 px-3 py-2.5 shrink-0">
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
          className="rounded-md p-0.5 text-slate-500 transition hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <X size={12} />
        </button>
      )}
    </div>

    <div className="mt-2 flex items-center gap-1 overflow-x-auto hide-scrollbar">
      {SEARCH_FILTERS.map((item) => {
        const isActive = filter === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onFilterChange(item.id)}
            className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold transition cursor-pointer shrink-0 ${
              isActive
                ? "border border-cyan-400/40 bg-cyan-500/20 text-cyan-200"
                : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

const Chat = ({ toggleChat, isFullWidthChat, onToggleFullscreen, handleKeyPress }) => {
  const { project } = useProject();
  const { messages } = useMessages();
  const { typingUsers, isAiThinking, aiThinkingUser } = useChat();

  const [showUsers, setShowUsers] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");

  const chatEndRef = useRef(null);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    chatEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages.length, scrollToBottom]);

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
    <div className="w-full h-full flex flex-col bg-[#080b11]/90 backdrop-blur-2xl border-r border-slate-800/80 overflow-x-hidden min-w-0 font-sans">
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
          <AiThinkingIndicator isAiThinking={isAiThinking} aiThinkingUser={aiThinkingUser} />
          <TypingIndicator users={typingUsers} />
          <ChatInput handleKeyPress={handleKeyPress} />
        </>
      )}
    </div>
  );
};

export default Chat;
