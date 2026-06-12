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
      placeholder: "Enter username",
    },
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
    <AuthLayout title="Signup">
      <AuthForm
        fields={fields}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={mutation.isPending}
        buttonText="Signup"
        error={
          mutation.error?.response?.data?.error
        }
      />

      {/* nagivate to signup page */}
      <div className="mt-6 text-center text-gray-300">
        Already have an account?

        <Link
          to="/auth/login"
          className="text-blue-400 ml-2"
        >
          Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;