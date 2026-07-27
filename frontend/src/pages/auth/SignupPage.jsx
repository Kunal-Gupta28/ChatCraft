import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthForm from "../../components/auth/AuthForm";

import useAuthMutation from "../../hooks/useAuthMutation";
import { registerUser } from "../../services/auth.service";

const SignupPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const mutation = useAuthMutation(registerUser);

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
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "johndoe",
    },
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
    <AuthLayout title="Create Account" subtitle="Join ChatCraft to craft & collaborate with AI in real time">
      <AuthForm
        fields={fields}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={mutation.isPending}
        buttonText="Create Account"
        error={mutation.error?.response?.data?.error}
      />

      {/* Navigate to Login Page */}
      <div className="mt-6 text-center text-xs text-slate-400">
        <span>Already have an account?</span>
        <Link
          to="/auth/login"
          className="text-blue-400 font-semibold ml-1.5 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;