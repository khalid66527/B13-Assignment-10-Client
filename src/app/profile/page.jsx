'use client';
import React, { useState, useEffect } from 'react';
import { useSession, authClient } from '@/lib/auth-client';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';

function Profile() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setImage(user.image || '');
    }
  }, [user]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-[#D4AF37]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Access Denied</h2>
        <p className="text-gray-400 mb-6">You must be signed in to view your profile page.</p>
        <Button 
          onClick={() => router.push('/auth/signin')}
          className="bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-bold px-6 py-2.5 rounded-xl hover:brightness-110 transition-all cursor-pointer"
        >
          Sign In
        </Button>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      const { data, error } = await authClient.updateUser({
        name,
        image,
      });

      if (error) {
        alert(`❌ Update failed: ${error.message || 'Something went wrong.'}`);
        return;
      }

      alert("🎉 Profile updated successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong while updating profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-gray-300 font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Ambient Premium Gold Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#AA7C11]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-gradient-to-b from-[#161616]/80 to-[#0F0F0F]/90 backdrop-blur-xl border border-[#D4AF37]/20 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_50px_rgba(212,175,55,0.05)] relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11] tracking-tight mb-2">
              User Profile
            </h2>
            <p className="text-gray-400 text-sm">View and manage your premium creator account information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Left Column: Avatar & Info */}
            <div className="flex flex-col items-center text-center space-y-4 md:col-span-1">
              <div className="relative w-32 h-32 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-gray-800 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                {user?.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#e8dcb8] text-4xl font-bold bg-[#1a1b16]">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white truncate max-w-[180px]">{user?.name}</h3>
                <p className="text-xs text-gray-400 truncate max-w-[180px]">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-[#FFE58F] to-[#D4AF37] rounded-full">
                  {user?.role || 'buyer'}
                </span>
              </div>
            </div>

            {/* Right Column: Edit Form */}
            <div className="md:col-span-2 space-y-5">
              <h3 className="text-lg font-semibold text-[#D4AF37]">Edit Profile Details</h3>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                {/* Email (Readonly) */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 ml-1">Email Address (Cannot change)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-[#1A1A1A]/40 border border-[#D4AF37]/10 rounded-xl px-4 py-3 text-gray-500 text-sm cursor-not-allowed"
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#D4AF37]/80 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
                  />
                </div>

                {/* Profile Image URL */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#D4AF37]/80 ml-1">Profile Image URL</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    isLoading={isUpdating}
                    isDisabled={isUpdating}
                    className="w-full h-12 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-bold tracking-wide rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
                  >
                    {isUpdating ? "Saving Changes..." : "Save Profile Details"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;