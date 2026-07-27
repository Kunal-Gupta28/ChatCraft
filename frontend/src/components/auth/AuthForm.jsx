import { memo } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
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
        <div className="bg-red-950/80 border border-red-800/80 text-red-300 px-4 py-2.5 rounded-xl mb-5 text-xs font-medium text-center flex items-center justify-center gap-2">
          <AlertCircle size={15} className="shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
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
          className={`w-full mt-2 py-3 rounded-xl text-white font-semibold transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
            loading
              ? "bg-blue-600/60 cursor-not-allowed opacity-60"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20 active:scale-[0.99]"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Please wait...</span>
            </>
          ) : (
            buttonText
          )}
        </button>
      </form>
    </>
  );
};

export default memo(AuthForm);