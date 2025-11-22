import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { useUser } from "../contexts/user.context";
import AuthForm from "../components/AuthForm/AuthForm";

const Login = () => {
  // react router dom
  const navigate = useNavigate();

  // context api
  const { setUser } = useUser();

  // state variables
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // login logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/login", form);

      if (res.status === 200) {
        const { user, token } = res.data;

        // setting the token value in local storage and user context api
        localStorage.setItem("token", token);
        setUser(user);

        // setting the user context api in localhost as string then navigating to home page
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/home");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      form={form}
      setForm={setForm}
      title="Login"
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
      footerText="Don't have an account?"
      footerLinkText="Register"
      fields={[
        {
          id: "email",
          label: "email",
          type: "email",
          value: form.email,
        },
        {
          id: "password",
          label: "password",
          type: "password",
          value: form.password,
        },
      ]}
    />
  );
};

export default Login;
