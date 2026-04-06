const Button = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
}) => {
  const base = "px-4 py-2 rounded-lg transition";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500",
    danger: "bg-red-600 hover:bg-red-500",
    secondary: "bg-gray-700 hover:bg-gray-600",
  };

  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${
        disabled ? disabledStyle : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;