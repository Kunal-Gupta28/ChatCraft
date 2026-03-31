import { useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../config/axios";
import { useUser } from "../contexts/user.context";

const AuthPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { setUser } = useUser();

  const isLogin = useMemo(() => type === "login", [type]);

  const initialForm = useMemo(
    () =>
      isLogin
        ? { email: "", password: "" }
        : { username: "", email: "", password: "" },
    [isLogin]
  );

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fields = useMemo(
    () => (isLogin ? ["email", "password"] : ["username", "email", "password"]),
    [isLogin]
  );

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        const endpoint = isLogin ? "/login" : "/register";
        const { data } = await axiosInstance.post(endpoint, form);

        const { user, token } = data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);
        navigate("/home");
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          (isLogin
            ? "Invalid credentials. Please try again."
            : "Registration failed. Try again.");

        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [form, isLogin, navigate, setUser]
  );

  const inputType = (field) => {
    if (field === "password") return "password";
    if (field === "email") return "email";
    return "text";
  };

  return (
    <div className="h-[100dvh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 select-none">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <button
          onClick={() => navigate("/")}
          className="mb-4 text-blue-400 text-2xl hover:text-blue-300 transition"
        >
          &larr;
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          {isLogin ? "Login" : "Register"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-gray-300 mb-1 capitalize">
                {field}
              </label>

              <input
                id={field}
                type={inputType(field)}
                value={form[field]}
                onChange={handleChange}
                required
                placeholder={`Enter your ${field}`}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-800 border-gray-700 text-white"
              />
            </div>
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
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-300">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            onClick={() =>
              navigate(isLogin ? "/auth/register" : "/auth/login")
            }
            className="text-blue-400 hover:text-blue-300 ml-2"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;