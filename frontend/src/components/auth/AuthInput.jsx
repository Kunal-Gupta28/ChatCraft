import { useState, memo } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const getFieldIcon = (name) => {
  switch (name) {
    case "username":
      return <User size={17} className="text-slate-400 shrink-0" />;
    case "email":
      return <Mail size={17} className="text-slate-400 shrink-0" />;
    case "password":
      return <Lock size={17} className="text-slate-400 shrink-0" />;
    default:
      return null;
  }
};

const AuthInput = ({
  id,
  type,
  label,
  value,
  onChange,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-slate-300 mb-1.5 capitalize tracking-wide"
      >
        {label}
      </label>

      <div className="relative flex items-center">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          {getFieldIcon(id)}
        </div>

        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          required
          autoComplete={id}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-[#0b0f17]/90 border border-slate-800 rounded-xl 
                     text-slate-100 placeholder-slate-500 text-xs sm:text-sm
                     focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label="Toggle password visibility"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(AuthInput);