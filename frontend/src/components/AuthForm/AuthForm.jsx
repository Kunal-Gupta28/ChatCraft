import { useNavigate } from "react-router-dom";

const AuthForm = ({
  form,
  setForm,
  title,
  error,
  loading,
  fields,
  onSubmit,
  footerText,
  footerLinkText,
}) => {
  const navigate = useNavigate();

  // handle the change in input of form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 select-none">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md transition-transform duration-300">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-4 text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer 
                     hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
        >
          &larr; Back
        </button>

        {/* heading */}
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          {title}
        </h2>

        {/* display the error when occurs */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* form */}
        <form onSubmit={onSubmit}>
          {fields.map((field) => (
            <div key={field.id} className="mb-4">
              
              {/* label */}
              <label
                htmlFor={field.id}
                className="block text-gray-700 dark:text-gray-300 mb-1 capitalize"
              >
                {field.label}
              </label>

              {/* input */}
              <input
                id={field.id}
                type={field.type}
                value={field.value}
                onChange={handleChange}
                required
                placeholder={`Enter your ${field.label}`}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                           focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          ))}

          {/* submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium transition cursor-pointer ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Please wait..." : title}
          </button>
        </form>

        {/* footer navigation */}
        <div className="mt-6 text-center text-gray-700 dark:text-gray-300">
          <span>{footerText}</span>{" "}
          
          {/* Login/Register button */}
          <button
            onClick={() => {
              footerLinkText === "Register"
                ? navigate("/register")
                : navigate("/login");
            }}
            className="text-blue-600 dark:text-blue-400 cursor-pointer 
                       hover:text-blue-800 dark:hover:text-blue-300
                       transition duration-200"
          >
            {footerLinkText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
