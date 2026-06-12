const AuthInput = ({
  id,
  type,
  label,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-gray-300 mb-1 capitalize"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        autoComplete={id}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-800 border-gray-700 text-white"
      />
    </div>
  );
};

export default AuthInput;