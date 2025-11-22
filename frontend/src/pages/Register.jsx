import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { useUser } from "../contexts/user.context";
import AuthForm from "../components/AuthForm/AuthForm";

const Register = () => {
  // react router dom
  const navigate = useNavigate();

  // context api
  const { setUser } = useUser();

  // state variables
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // register functionality
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/register", form);

      if (res.status === 201) {
        // setting token data in localstorage and user data in user context api
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);

        // setting user data into localstorage then navigating to home page
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/home");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      form={form}
      setForm={setForm}
      title="Register"
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
      footerText="Already have an account?"
      footerLinkText="Login"
      fields={[
        {
          id: "username",
          label: "username",
          type: "text",
          value: form.username,
        },
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

export default Register;
