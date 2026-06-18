'use client';
import React, { useState } from 'react';
import { Button, Description, Radio, RadioGroup } from "@heroui/react";
import { Eye, EyeSlash } from '@gravity-ui/icons'; 
import { FcGoogle } from 'react-icons/fc';
import { signIn } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const SigninPage = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState("buyer"); // State for Role Selection
  
  // State for handling success messages
  const [successMessage, setSuccessMessage] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Clear previous message on new submission
    setSuccessMessage("");

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    const password = formValues.password;
    if (password.length < 6) {
      alert("❌ Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await signIn.email({
        email: formValues.email,
        password: formValues.password,
      });

      if (error) {
        console.error("Signin Error:", error);
        alert(`❌ Sign in failed: ${error.message || 'Incorrect email or password.'}`);
        return;
      }

      console.log("Submitting Signin Data:", formValues);
      
      // Dynamic success message
      setSuccessMessage("🎉 Welcome back! You have successfully signed in.");
      
      e.target.reset();
      setRole("buyer"); // Reset to default role

      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error(error);
      alert("❌ Sign in failed.");
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

          {/* Success Message Box */}
          {successMessage && (
            <div className="mb-6 p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl text-sm text-[#FFE58F] text-center animate-fade-in shadow-[0_0_15px_rgba(212,175,55,0.05)]">
              {successMessage}
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11] tracking-tight mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm">Sign in to your premium creator account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSignin} className="space-y-5">
            
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
              <label className="text-xs font-semibold text-[#D4AF37]/80 ml-1">Sign In As</label>
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
                  <Description className="text-xs text-gray-500 mt-1">Access your collection</Description>
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
                  <Description className="text-xs text-gray-500 mt-1">Manage your artwork</Description>
                </Radio>
              </RadioGroup>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1 mb-1">
                <label className="text-xs font-semibold text-[#D4AF37]/80">Password</label>
                <a href="/forgot-password" className="text-xs text-gray-500 hover:text-[#D4AF37] transition-colors">
                  Forgot?
                </a>
              </div>
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

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-bold tracking-wide rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
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
            className="w-full h-12 border border-gray-800 hover:border-[#D4AF37]/50 bg-[#1A1A1A]/40 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span><FcGoogle /></span>
            Continue with Google
          </Button>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Don`t have an account?{" "}
            <a href="/auth/signup" className="text-[#D4AF37] hover:underline font-medium">
              Sign Up
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default SigninPage;