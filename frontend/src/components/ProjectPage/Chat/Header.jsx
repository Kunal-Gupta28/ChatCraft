import { memo } from "react";
import { Home, Users, PanelLeftClose, MessageSquareCode } from "lucide-react";

const Header = ({
  // Chat header props
  projectName,
  memberCount,
  onBack,
  onToggleChat,
  onShowUsers,
  // Custom header props
  title,
  leftIcon,
  onLeftClick,
  rightActions = [],
}) => {
  const displayTitle = title || projectName || "Workspace Chat";
  const handleBack = onLeftClick || onBack;

  return (
    <header className="h-[54px] flex items-center justify-between px-3.5 border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-2xl select-none shrink-0">
      {/* Left: Back/Home Button + Title */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
        {handleBack && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back"
            title="Back"
            className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer shrink-0 shadow-xs"
          >
            {leftIcon || <Home size={15} />}
          </button>
        )}

        <div className="flex items-center gap-2 truncate">
          {!title && (
            <div className="w-6.5 h-6.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <MessageSquareCode size={14} />
            </div>
          )}
          <span className="truncate text-xs sm:text-sm font-extrabold text-white tracking-wide">
            {displayTitle}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Custom Right Actions (e.g. + Add Member button) */}
        {rightActions && rightActions.length > 0 &&
          rightActions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              onClick={action.onClick}
              title={action.title}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition cursor-pointer text-xs font-semibold shadow-xs ${
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

        {/* Default Chat Header Right Buttons (Members Pill & Hide Chat) */}
        {!title && onShowUsers && (
          <button
            type="button"
            onClick={onShowUsers}
            title="View Project Members"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer text-xs font-semibold shadow-xs"
          >
            <Users size={13} className="text-blue-400" />
            <span>{memberCount}</span>
          </button>
        )}

        {!title && onToggleChat && (
          <button
            type="button"
            onClick={onToggleChat}
            title="Hide Chat Sidebar"
            aria-label="Hide Chat Sidebar"
            className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer shadow-xs"
          >
            <PanelLeftClose size={16} />
          </button>
        )}
      </div>
    </header>
  );
};

export default memo(Header);