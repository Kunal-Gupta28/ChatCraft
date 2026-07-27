import { memo, forwardRef } from "react";

const Button = forwardRef(({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
  type = "button",
}, ref) => {
  const base =
    "px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center cursor-pointer";

  const variants = {
    primary: `
      bg-blue-600 text-white
      hover:bg-blue-500
      disabled:bg-blue-600
      disabled:text-white
    `,

    secondary: `
      bg-gray-700 text-white
      hover:bg-gray-600
      disabled:bg-gray-700
      disabled:text-gray-400
    `,

    danger: `
      bg-red-600 text-white
      hover:bg-red-500
      disabled:bg-red-600
      disabled:text-white
    `,
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${base}
        ${variants[variant]}
         w-24 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default memo(Button);