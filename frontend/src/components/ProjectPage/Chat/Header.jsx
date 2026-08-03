import { memo } from "react";
import { Users, X, Maximize2, Minimize2, MessageSquareCode, ArrowLeft, Search } from "lucide-react";

const Header = ({
  projectName,
  memberCount,
  onToggleChat,
  onShowUsers,
  onToggleSearch,
  isSearchOpen,
  isFullWidthChat,
  onToggleFullscreen,
  title,
  leftIcon,
  onLeftClick,
  onBack,
  rightActions = [],
}) => {
  const displayTitle = title || projectName || "Workspace Chat";
  const handleBack = onLeftClick || onBack;

  return (
    <header className="h-[46px] flex items-center justify-between px-3 border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-2xl select-none shrink-0">
      {/* Left: Back Button or Status Dot + Title */}
      <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
        {handleBack ? (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back"
            title="Back"
            className="p-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer shrink-0 shadow-xs"
          >
            {leftIcon || <ArrowLeft size={14} />}
          </button>
        ) : (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-xs shadow-emerald-400/50" />
        )}

        <div className="flex items-center gap-2 truncate">
          {!title && (
            <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <MessageSquareCode size={13} />
            </div>
          )}
          <span className="truncate text-xs font-extrabold text-white tracking-wide">
            {displayTitle}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {rightActions && rightActions.length > 0 &&
          rightActions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              onClick={action.onClick}
              title={action.title}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition cursor-pointer text-xs font-semibold shadow-xs ${
                action.variant === "primary"
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
              }`}
            >
              {action.icon}
              {action.label && <span>{action.label}</span>}
            </button>
          ))
        }

        {!title && onShowUsers && (
          <button
            type="button"
            onClick={onShowUsers}
            title="View Collaborators"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer text-xs font-semibold shadow-xs"
          >
            <Users size={12} className="text-blue-400" />
            <span>{memberCount}</span>
          </button>
        )}

        {!title && onToggleSearch && (
          <button
            type="button"
            onClick={onToggleSearch}
            title={isSearchOpen ? "Close search" : "Search chat"}
            aria-label={isSearchOpen ? "Close search" : "Search chat"}
            className={`p-1.5 rounded-lg border transition cursor-pointer shadow-xs ${
              isSearchOpen
                ? "bg-cyan-400/10 border-cyan-300/35 text-cyan-200"
                : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
            }`}
          >
            <Search size={13} />
          </button>
        )}

        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            title={isFullWidthChat ? "Minimize Widget" : "Expand Fullscreen"}
            className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer shadow-xs"
          >
            {isFullWidthChat ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        )}

        {onToggleChat && (
          <button
            type="button"
            onClick={onToggleChat}
            title="Close Chat"
            className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer shadow-xs"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </header>
  );
};

export default memo(Header);
