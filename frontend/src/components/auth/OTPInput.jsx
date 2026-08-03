import { useRef } from "react";

const OTPInput = ({ value = "", onChange, disabled = false }) => {
  const inputRefs = useRef([]);

  // Ensure value is a 6-char string padded with empty spaces
  const otpDigits = Array.from({ length: 6 }, (_, i) => value[i] || "");

  const handleInputChange = (e, index) => {
    const val = e.target.value;
    // Allow only numeric digit
    if (val && !/^\d+$/.test(val)) return;

    const newOtp = [...otpDigits];
    // Take the last entered character if length > 1
    newOtp[index] = val ? val.slice(-1) : "";
    const combinedOtp = newOtp.join("");
    onChange(combinedOtp);

    // Auto-focus next input box if digit entered
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        // If current box is empty, move back to previous box and clear it
        const newOtp = [...otpDigits];
        newOtp[index - 1] = "";
        onChange(newOtp.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    onChange(pastedData);
    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 my-4">
      {otpDigits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold text-white bg-slate-900/90 border border-slate-700/80 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
        />
      ))}
    </div>
  );
};

export default OTPInput;
