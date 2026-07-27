import { memo, forwardRef } from "react";

const Input = forwardRef(({
  value,
  onChange,
  placeholder,
  disabled,
  autoFocus,
  onKeyDown
}, ref) => {
  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      onKeyDown={onKeyDown}
      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 text-white"
    />
  );
});

Input.displayName = "Input";

export default memo(Input);