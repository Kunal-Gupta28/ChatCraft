import { useNavigate } from "react-router-dom";

const ActionButton = ({
  children,
  to,
  onClick,
  className = "",
  variant = "primary",
  ...props
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  };

  const baseStyle =
    "font-semibold px-8 py-3 rounded-lg inline-flex items-center transition-all cursor-pointer";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:brightness-110 hover:scale-105",
    secondary:
      "bg-white text-purple-700 hover:bg-gray-100 shadow-lg hover:scale-105",
    header:
      "bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/50",
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ActionButton;