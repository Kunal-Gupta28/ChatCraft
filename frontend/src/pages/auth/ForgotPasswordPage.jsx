import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { MailCheck, CheckCircle2, ArrowLeft, Clock, AlertTriangle, Loader2 } from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthForm from "../../components/auth/AuthForm";
import OTPInput from "../../components/auth/OTPInput";
import { sendForgotOTP, verifyForgotCode, verifyForgotOTP } from "../../services/auth.service";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  // Step 1: Email -> Send OTP
  // Step 2: 6-Digit Box OTP -> Verify OTP Code
  // Step 3: New Password -> Reset Password -> Immediate Navigate
  const [step, setStep] = useState(1);
  const [infoMessage, setInfoMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  // 30-Second Countdown Timer for Step 2
  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // Step 1 Mutation: Send Forgot Password OTP
  const sendOtpMutation = useMutation({
    mutationFn: sendForgotOTP,
    onSuccess: (data) => {
      setInfoMessage(data.message || `Verification code sent to ${form.email}`);
      setTimeLeft(30); // Start 30s timer
      setStep(2);
    },
  });

  // Step 2 Mutation: Verify OTP Code Only
  const verifyCodeMutation = useMutation({
    mutationFn: verifyForgotCode,
    onSuccess: () => {
      setInfoMessage("Email verified successfully! Please enter your new password below.");
      setStep(3);
    },
  });

  // Step 3 Mutation: Reset Password -> Navigate Immediately to Login Page
  const resetPasswordMutation = useMutation({
    mutationFn: verifyForgotOTP,
    onSuccess: (data) => {
      // Immediate navigation to login page with success toast state
      navigate("/auth/login", {
        state: { successToast: data?.message || "Password reset successfully! Please sign in." },
      });
    },
  });

  const handleChange = (e) => {
    sendOtpMutation.reset();
    verifyCodeMutation.reset();
    resetPasswordMutation.reset();

    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleOtpChange = (otpValue) => {
    verifyCodeMutation.reset();
    setForm((prev) => ({
      ...prev,
      otp: otpValue,
    }));
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    sendOtpMutation.mutate({ email: form.email });
  };

  const handleResendOTP = () => {
    sendOtpMutation.mutate({ email: form.email });
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    verifyCodeMutation.mutate({
      email: form.email,
      otp: form.otp,
    });
  };

  const handleStep3Submit = (e) => {
    e.preventDefault();
    resetPasswordMutation.mutate({
      email: form.email,
      newPassword: form.newPassword,
    });
  };

  const step1Fields = [
    {
      name: "email",
      label: "Registered Email Address",
      type: "email",
      placeholder: "name@example.com",
    },
  ];

  const step3Fields = [
    {
      name: "newPassword",
      label: "New Password",
      type: "password",
      placeholder: "••••••••",
    },
  ];

  const getSubtitle = () => {
    if (step === 1) return "Enter your registered email address to receive a verification code";
    if (step === 2) return `Enter the 6-digit code sent to ${form.email} to verify your identity`;
    return "Create a new password for your account";
  };

  const step2Error =
    verifyCodeMutation.error?.response?.data?.error ||
    verifyCodeMutation.error?.response?.data?.message ||
    verifyCodeMutation.error?.response?.data?.errors?.[0]?.msg ||
    (verifyCodeMutation.isError ? "Invalid OTP code. Please try again." : null);

  return (
    <AuthLayout title="Reset Password" subtitle={getSubtitle()}>
      {infoMessage && step === 2 && (
        <div className="bg-blue-950/80 border border-blue-800/80 text-blue-300 px-4 py-2.5 rounded-xl mb-5 text-xs font-medium text-center flex items-center justify-center gap-2">
          <MailCheck size={15} className="shrink-0 text-blue-400" />
          <span>{infoMessage}</span>
        </div>
      )}

      {step === 2 && timeLeft === 0 && (
        <div className="bg-amber-950/80 border border-amber-800/80 text-amber-300 px-4 py-2.5 rounded-xl mb-5 text-xs font-medium text-center flex items-center justify-center gap-2">
          <AlertTriangle size={15} className="shrink-0 text-amber-400" />
          <span>OTP code has expired! Click <strong>Resend OTP</strong> to get a new code.</span>
        </div>
      )}

      {step === 1 && (
        <AuthForm
          fields={step1Fields}
          form={form}
          onChange={handleChange}
          onSubmit={handleStep1Submit}
          loading={sendOtpMutation.isPending}
          buttonText="Send Verification Code"
          error={
            sendOtpMutation.error?.response?.data?.error ||
            sendOtpMutation.error?.response?.data?.message ||
            sendOtpMutation.error?.response?.data?.errors?.[0]?.msg ||
            (sendOtpMutation.isError ? "Failed to send verification code." : null)
          }
        />
      )}

      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-4">
          {step2Error && (
            <div className="bg-red-950/80 border border-red-800/80 text-red-300 px-4 py-2.5 rounded-xl mb-2 text-xs font-medium text-center flex items-center justify-center gap-2">
              <AlertTriangle size={15} className="shrink-0 text-red-400" />
              <span>{step2Error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              6-Digit Verification Code
            </label>
            <OTPInput
              value={form.otp}
              onChange={handleOtpChange}
              disabled={verifyCodeMutation.isPending || timeLeft === 0}
            />
          </div>

          <button
            type="submit"
            disabled={verifyCodeMutation.isPending || form.otp.length < 6 || timeLeft === 0}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
              verifyCodeMutation.isPending || form.otp.length < 6 || timeLeft === 0
                ? "bg-blue-600/60 cursor-not-allowed opacity-60"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20 active:scale-[0.99]"
            }`}
          >
            {verifyCodeMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Verifying Code...</span>
              </>
            ) : timeLeft === 0 ? (
              "OTP Expired"
            ) : (
              "Verify Code"
            )}
          </button>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Back to email</span>
            </button>

            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1 font-mono text-xs ${timeLeft === 0 ? 'text-red-400' : 'text-slate-400'}`}>
                <Clock size={12} />
                {timeLeft > 0 ? `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}s` : "Expired"}
              </span>

              <button
                type="button"
                disabled={sendOtpMutation.isPending}
                onClick={handleResendOTP}
                className="text-blue-400 font-semibold hover:underline cursor-pointer disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </form>
      )}

      {step === 3 && (
        <AuthForm
          fields={step3Fields}
          form={form}
          onChange={handleChange}
          onSubmit={handleStep3Submit}
          loading={resetPasswordMutation.isPending}
          buttonText="Reset Password"
          error={
            resetPasswordMutation.error?.response?.data?.error ||
            resetPasswordMutation.error?.response?.data?.message ||
            resetPasswordMutation.error?.response?.data?.errors?.[0]?.msg ||
            (resetPasswordMutation.isError ? "Failed to reset password." : null)
          }
        />
      )}

      <div className="mt-6 text-center text-xs text-slate-400">
        <span>Remembered your password?</span>
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

export default ForgotPasswordPage;
