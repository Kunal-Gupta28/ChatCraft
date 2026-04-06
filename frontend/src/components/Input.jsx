const Input = ({
  value,
  onChange,
  placeholder,
  disabled,
  autoFocus,
}) => {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 text-white"
    />
  );
};

export default Input;