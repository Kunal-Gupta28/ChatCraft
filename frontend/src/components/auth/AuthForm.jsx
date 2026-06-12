import AuthInput from "./AuthInput";

const AuthForm = ({
  fields,
  form,
  onChange,
  onSubmit,
  loading,
  buttonText,
  error,
}) => {
  return (
    <>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        {fields.map((field) => (
          <AuthInput
            key={field.name}
            id={field.name}
            type={field.type}
            label={field.label}
            value={form[field.name]}
            onChange={onChange}
            placeholder={field.placeholder}
          />
        ))}

        <button
        type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-medium transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Please wait..." : buttonText}
        </button>
      </form>
    </>
  );
};

export default AuthForm;