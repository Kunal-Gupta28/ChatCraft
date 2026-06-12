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
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
    },
  ];

  return (
    <AuthLayout title="Login">
      <AuthForm
        fields={fields}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={mutation.isPending}
        buttonText="Login"
        error={
          mutation.error?.response?.data?.error
        }
      />

      {/* nagivate to signup page */}
      <div className="mt-6 text-center text-gray-300">
        Don't have an account?

        <Link
          to="/auth/signup"
          className="text-blue-400 ml-2"
        >
          Signup
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;