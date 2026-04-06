import { memo } from "react";

const Header = ({
  title,
  subtitle,
  leftIcon,
  onLeftClick,
  rightActions = [],
  centerContent,
  sticky = true,
}) => {
  return (
    <header
      className={`
        ${sticky ? "sticky top-0 z-10" : ""}
        h-[55px] flex items-center justify-between px-4 md:px-5
        border-b border-gray-800
        bg-gray-900/80 backdrop-blur-md
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-2 min-w-[40px]">
        {leftIcon && (
          <button
            onClick={onLeftClick}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            {leftIcon}
          </button>
        )}
      </div>

      {/* CENTER */}
      <div className="flex flex-col items-center justify-center flex-1 px-2 truncate">
        {centerContent ? (
          centerContent
        ) : (
          <>
            <span className="text-gray-100 font-semibold truncate">
              {title}
            </span>
            {subtitle && (
              <span className="text-xs text-gray-400 truncate">
                {subtitle}
              </span>
            )}
          </>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 min-w-[40px] justify-end">
        {rightActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`
              p-2 rounded-full transition
              text-gray-400 hover:text-white
              ${
                action.variant === "primary"
                  ? "hover:bg-blue-600/30 text-blue-400"
                  : "hover:bg-gray-800"
              }
            `}
          >
            {action.icon}
          </button>
        ))}
      </div>
    </header>
  );
};

export default memo(Header);