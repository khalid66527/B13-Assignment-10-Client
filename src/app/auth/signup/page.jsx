'use client';
import React, { useState } from 'react';
import { Button, Description, Radio, RadioGroup } from "@heroui/react";
import { Eye, EyeSlash } from '@gravity-ui/icons';
import { FcGoogle } from 'react-icons/fc';
import { signUp } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState("buyer"); // State for Role Selection

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    const password = formValues.password;

    // Password Complexity Validation (like "A1khalid")
    if (password.length < 6) {
      alert("❌ Password must be at least 6 characters long.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      alert("❌ Password must contain at least one uppercase letter (e.g., 'A').");
      return;
    }
    if (!/[a-z]/.test(password)) {
      alert("❌ Password must contain at least one lowercase letter (e.g., 'khalid').");
      return;
    }
    if (!/[0-9]/.test(password)) {
      alert("❌ Password must contain at least one number (e.g., '1').");
      return;
    }

    if (password !== formValues.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await signUp.email({
        name: formValues.fullName,
        email: formValues.email,
        password: formValues.password,
        role: role, // RadioGroup state
      });

      if (error) {
        console.error("Signup Error:", error);
        alert(`❌ Signup failed: ${error.message || 'Something went wrong.'}`);
        return;
      }

      console.log("Signup Successful, response data:", data); 
      
      alert("🎉 Registration successful!");
      e.target.reset();
      setRole("buyer"); // Reset role on success
      router.push('/auth/signin');
    } catch (error) {
      console.error("Signup Error:", error);
      alert("❌ Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-gray-300 font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Ambient Premium Gold Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#AA7C11]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">

        {/* Main Card Container */}
        <div className="bg-gradient-to-b from-[#161616]/80 to-[#0F0F0F]/90 backdrop-blur-xl border border-[#D4AF37]/20 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_50px_rgba(212,175,55,0.05)] relative overflow-hidden">

          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11] tracking-tight mb-2">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm">Join our premium creator community</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSignup} className="space-y-5">

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4AF37]/80 ml-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="John Doe"
                className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4AF37]/80 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
              />
            </div>

            {/* Role Selection (HeroUI RadioGroup) */}
            <div className="space-y-2 pt-1 pb-1">
              <label className="text-xs font-semibold text-[#D4AF37]/80 ml-1">Account Type</label>
              <RadioGroup
                name="role"
                value={role}
                onChange={setRole}
                className="flex flex-row gap-3"
              >
                <Radio
                  value="buyer"
                  className="flex-1 bg-[#1A1A1A]/60 border border-[#D4AF37]/20 rounded-xl p-3 hover:border-[#D4AF37]/50 transition-colors"
                >
                  <Radio.Content>
                    <Radio.Control>
                      <Radio.Indicator className="bg-[#D4AF37]" />
                    </Radio.Control>
                    <span className="text-sm font-medium text-white">Buyer</span>
                  </Radio.Content>
                  <Description className="text-xs text-gray-500 mt-1">Discover & collect art</Description>
                </Radio>

                <Radio
                  value="artist"
                  className="flex-1 bg-[#1A1A1A]/60 border border-[#D4AF37]/20 rounded-xl p-3 hover:border-[#D4AF37]/50 transition-colors"
                >
                  <Radio.Content>
                    <Radio.Control>
                      <Radio.Indicator className="bg-[#D4AF37]" />
                    </Radio.Control>
                    <span className="text-sm font-medium text-white">Artist</span>
                  </Radio.Content>
                  <Description className="text-xs text-gray-500 mt-1">Showcase & sell art</Description>
                </Radio>
              </RadioGroup>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4AF37]/80 ml-1">Password</label>
              <div className="relative">
                <input
                  type={isVisible ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl pl-4 pr-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#D4AF37]"
                >
                  {isVisible ? <EyeSlash width={16} height={16} /> : <Eye width={16} height={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4AF37]/80 ml-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={isConfirmVisible ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl pl-4 pr-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={toggleConfirmVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#D4AF37]"
                >
                  {isConfirmVisible ? <EyeSlash width={16} height={16} /> : <Eye width={16} height={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-bold tracking-wide rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-[1px] bg-gray-800"></div>
            <span className="px-3 text-xs text-gray-500 uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 h-[1px] bg-gray-800"></div>
          </div>

          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="bordered"
            className="w-full h-12 border border-gray-800 hover:border-[#D4AF37]/50 bg-[#1A1A1A]/40  rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span><FcGoogle /></span>
            Continue with Google
          </Button>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/auth/signin" className="text-[#D4AF37] hover:underline font-medium">
              Sign In
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default SignupPage;