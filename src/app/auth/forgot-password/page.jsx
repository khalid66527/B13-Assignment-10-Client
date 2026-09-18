'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@heroui/react";
import { Eye, EyeSlash } from '@gravity-ui/icons';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

export default function ForgotPasswordPage() {
  const router = useRouter();

  // step: 1 = Email, 2 = Verify Code, 3 = Set Password, 4 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(2);
  const [currentTheme, setCurrentTheme] = useState("dark");

  const otpRefs = useRef([]);

  // Sync theme on mount
  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setCurrentTheme(isLight ? "light" : "dark");
  }, []);

  const togglePageTheme = () => {
    const isLight = document.documentElement.classList.contains("light");
    const next = isLight ? "dark" : "light";
    setCurrentTheme(next);
    localStorage.setItem("theme", next);
    if (next === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  // Auto-redirect countdown when step 4 is reached
  useEffect(() => {
    if (step === 4) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/auth/signin");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, router]);

  /* ═══════════════════════════════════════════
     STEP 1 — Send OTP to Email
  ═══════════════════════════════════════════ */
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError("");

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/send-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Failed to send code. Please try again.");
        return;
      }

      setStep(2);
      setTimeout(() => otpRefs.current[0]?.focus(), 150);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ═══════════════════════════════════════════
     OTP Input Helpers
  ═══════════════════════════════════════════ */
  const handleOtpChange = (i, val) => {
    const cleanVal = val.replace(/\D/g, "");
    if (!cleanVal && val !== "") return;

    const next = [...otp];
    next[i] = cleanVal.slice(-1);
    setOtp(next);

    if (cleanVal && i < 5) {
      otpRefs.current[i + 1]?.focus();
    }
  };

  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace") {
      if (!otp[i] && i > 0) {
        otpRefs.current[i - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      otpRefs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < 5) {
      otpRefs.current[i + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const next = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setOtp(next);

    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  /* ═══════════════════════════════════════════
     STEP 2 — Verify Code First
  ═══════════════════════════════════════════ */
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError("");

    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: code,
          verifyOnly: true,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Invalid or expired code. Please try again.");
        return;
      }

      setVerifiedOtp(code);
      setStep(3);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (isResending) return;
    setError("");
    setResendSuccess(false);
    setIsResending(true);

    try {
      const res = await fetch("/api/send-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setResendSuccess(true);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
        setTimeout(() => setResendSuccess(false), 4000);
      } else {
        setError(data.message || "Could not resend code.");
      }
    } catch {
      setError("Network error while resending code.");
    } finally {
      setIsResending(false);
    }
  };

  /* ═══════════════════════════════════════════
     STEP 3 — Set New Password & Update Database
  ═══════════════════════════════════════════ */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-check.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: verifiedOtp,
          newPassword: newPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 400 && data.message?.toLowerCase().includes("code")) {
          setError(data.message);
          setOtp(["", "", "", "", "", ""]);
          setVerifiedOtp("");
          setStep(2);
          return;
        }
        setError(data.message || "Failed to update password. Please try again.");
        return;
      }

      setStep(4);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ═══════════════════════════════════════════
     Layout Container
  ═══════════════════════════════════════════ */
  const wrap = (children) => (
    <div className="relative min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] flex items-center justify-center py-12 px-4 overflow-hidden transition-colors duration-300">
      {/* Ambient background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/10 dark:bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#B45309]/10 dark:bg-[#AA7C11]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="auth-card bg-white dark:bg-gradient-to-b dark:from-[#161616]/90 dark:to-[#0F0F0F]/95 backdrop-blur-2xl border border-slate-200 dark:border-[#D4AF37]/25 rounded-[2.5rem] p-8 md:p-10 shadow-xl dark:shadow-[0_0_60px_rgba(212,175,55,0.08)] relative overflow-hidden transition-all duration-300">
          
          {/* Top Gold Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          {/* Top Bar: Step Dots & Theme Toggle */}
          <div className="flex justify-between items-center mb-7">
            {step < 4 ? (
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      s === step
                        ? "w-8 bg-gradient-to-r from-[#D97706] to-[#B45309] dark:from-[#FFE58F] dark:to-[#D4AF37] shadow-sm"
                        : s < step
                        ? "w-3 bg-[#B45309]/50 dark:bg-[#D4AF37]/60"
                        : "w-3 bg-slate-200 dark:bg-[#2A2A2A]"
                    }`}
                  />
                ))}
              </div>
            ) : <div />}

            {/* Quick Theme Switcher */}
            <button
              type="button"
              onClick={togglePageTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-[#e8dcb8] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              title={`Switch to ${currentTheme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {currentTheme === "dark" ? (
                <Icon icon="solar:sun-2-bold-duotone" className="size-5 text-[#D4AF37]" />
              ) : (
                <Icon icon="solar:moon-bold-duotone" className="size-5 text-[#B45309]" />
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="auth-error-notice mb-6 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl text-xs text-red-600 dark:text-red-400 text-center leading-relaxed">
              {error}
            </div>
          )}

          {/* Resend Success Message */}
          {resendSuccess && (
            <div className="auth-success-notice mb-6 p-3.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl text-xs text-emerald-700 dark:text-emerald-400 text-center leading-relaxed">
              ✓ A fresh 6-digit code has been sent to your email!
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════
     STEP 1: Enter Email
  ═══════════════════════════════════════════ */
  if (step === 1) {
    return wrap(
      <>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11] mb-2 tracking-tight">
            Forgot Password
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
            Enter your account email and we'll send you a 6-digit verification code.
          </p>
        </div>

        <form onSubmit={handleSendOTP} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#B45309] dark:text-[#D4AF37] ml-1 block tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-white dark:bg-[#141414] border border-slate-300 dark:border-[#D4AF37]/25 focus:border-[#B45309] dark:focus:border-[#D4AF37] rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#B45309]/20 dark:focus:ring-[#D4AF37]/20 transition-all text-sm"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isLoading}
              isDisabled={isLoading}
              className="btn-gold w-full h-12 font-bold tracking-wide rounded-xl transition-all duration-300"
            >
              {isLoading ? "Sending Code..." : "Send Verification Code"}
            </Button>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-gray-500 pt-2">
            Remember your password?{" "}
            <Link
              href="/auth/signin"
              className="text-[#B45309] dark:text-[#D4AF37] hover:underline font-semibold ml-1"
            >
              Sign In
            </Link>
          </p>
        </form>
      </>
    );
  }

  /* ═══════════════════════════════════════════
     STEP 2: Enter & Verify Code
  ═══════════════════════════════════════════ */
  if (step === 2) {
    const isCodeComplete = otp.join("").length === 6;

    return wrap(
      <>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11] mb-2 tracking-tight">
            Verify Code
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
            Enter the 6-digit code sent to<br />
            <span className="font-bold text-sm text-[#B45309] dark:text-[#FFE58F]">{email}</span>
          </p>
          <p className="text-slate-500 dark:text-gray-500 text-[11px] mt-1">
            Check your Inbox or Spam / Junk folder
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-6">
          {/* OTP Digit Boxes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#B45309] dark:text-[#D4AF37] ml-1 block text-center tracking-wide">
              6-Digit Code
            </label>
            <div
              className="flex gap-2 justify-center items-center"
              onPaste={handleOtpPaste}
            >
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKey(i, e)}
                  className={`otp-digit-box ${digit ? "has-val" : ""}`}
                />
              ))}
            </div>
            <p className="text-center text-[11px] text-slate-500 dark:text-gray-500 mt-2">
              Tip: You can paste the 6-digit code directly
            </p>
          </div>

          <div>
            <Button
              type="submit"
              isLoading={isLoading}
              isDisabled={!isCodeComplete || isLoading}
              className="btn-gold w-full h-12 font-bold tracking-wide rounded-xl transition-all duration-300 disabled:opacity-40"
            >
              {isLoading ? "Verifying Code..." : "Verify Code →"}
            </Button>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-gray-400 pt-2 px-1">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp(["", "", "", "", "", ""]);
                setError("");
              }}
              className="hover:text-[#B45309] dark:hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              ← Change email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="hover:text-[#B45309] dark:hover:text-[#D4AF37] text-[#B45309] dark:text-[#D4AF37] font-semibold transition-colors disabled:opacity-40 cursor-pointer"
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          </div>
        </form>
      </>
    );
  }

  /* ═══════════════════════════════════════════
     STEP 3: Set New Password
  ═══════════════════════════════════════════ */
  if (step === 3) {
    return wrap(
      <>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11] mb-2 tracking-tight">
            Create New Password
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
            Your verification code matched! Set a new password for your account.
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-5">
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B45309] dark:text-[#D4AF37] ml-1 tracking-wide">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="w-full bg-white dark:bg-[#141414] border border-slate-300 dark:border-[#D4AF37]/25 focus:border-[#B45309] dark:focus:border-[#D4AF37] rounded-xl pl-4 pr-11 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#B45309]/20 dark:focus:ring-[#D4AF37]/20 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#B45309] dark:hover:text-[#D4AF37] transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeSlash width={16} height={16} /> : <Eye width={16} height={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B45309] dark:text-[#D4AF37] ml-1 tracking-wide">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter your password"
                className="w-full bg-white dark:bg-[#141414] border border-slate-300 dark:border-[#D4AF37]/25 focus:border-[#B45309] dark:focus:border-[#D4AF37] rounded-xl pl-4 pr-11 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#B45309]/20 dark:focus:ring-[#D4AF37]/20 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#B45309] dark:hover:text-[#D4AF37] transition-colors p-1"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeSlash width={16} height={16} /> : <Eye width={16} height={16} />}
              </button>
            </div>

            {/* Password match indicator */}
            {confirmPassword && (
              <p
                className={`text-[11px] ml-1 mt-1 font-semibold ${
                  newPassword === confirmPassword
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          <div className="pt-3">
            <Button
              type="submit"
              isLoading={isLoading}
              isDisabled={isLoading}
              className="btn-gold w-full h-12 font-bold tracking-wide rounded-xl transition-all duration-300"
            >
              {isLoading ? "Updating Password..." : "Update Password & Save"}
            </Button>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-gray-500 pt-1">
            <button
              type="button"
              onClick={() => {
                setStep(2);
                setError("");
              }}
              className="hover:text-[#B45309] dark:hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              ← Back to verification code
            </button>
          </p>
        </form>
      </>
    );
  }

  /* ═══════════════════════════════════════════
     STEP 4: Password Changed Successfully
  ═══════════════════════════════════════════ */
  return wrap(
    <div className="text-center space-y-6 py-4">
      <div className="w-20 h-20 mx-auto bg-emerald-50 dark:bg-[#FFE58F]/20 border-2 border-emerald-500/40 dark:border-[#D4AF37]/50 rounded-full flex items-center justify-center shadow-lg dark:shadow-[0_0_30px_rgba(212,175,55,0.25)]">
        <span className="text-emerald-600 dark:text-[#FFE58F] text-3xl font-black">✓</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11]">
          Password Changed!
        </h2>
        <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
          Your password has been successfully updated in the database.
        </p>
        <p className="text-[#B45309] dark:text-[#FFE58F] text-xs font-semibold pt-1">
          Redirecting to Sign In in {countdown}s...
        </p>
      </div>

      <div className="pt-2">
        <Button
          onClick={() => router.push("/auth/signin")}
          className="btn-gold w-full h-12 font-bold tracking-wide rounded-xl"
        >
          Sign In Now →
        </Button>
      </div>
    </div>
  );
}
