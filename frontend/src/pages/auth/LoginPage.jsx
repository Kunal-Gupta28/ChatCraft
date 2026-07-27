import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthForm from "../../components/auth/AuthForm";

import useAuthMutation from "../../hooks/useAuthMutation";
import { loginUser } from "../../services/auth.service";

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const mutation = useAuthMutation(loginUser);

  const handleChange = (e) => {
    mutation.reset();

    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const fields = [
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "name@example.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
    },
  ];

  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to access your cloud workspaces and AI assistant">
      <AuthForm
        fields={fields}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={mutation.isPending}
        buttonText="Sign In"
        error={mutation.error?.response?.data?.error}
      />

      {/* Navigate to Signup Page */}
      <div className="mt-6 text-center text-xs text-slate-400">
        <span>Don't have an account?</span>
        <Link
          to="/auth/signup"
          className="text-blue-400 font-semibold ml-1.5 hover:underline"
        >
          Create account
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;