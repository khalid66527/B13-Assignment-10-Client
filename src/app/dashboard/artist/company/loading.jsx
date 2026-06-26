export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
      
      {/* Glow Spinner */}
      <div className="w-12 h-12 border-4 border-[#2a2a2a] border-t-[#D4AF37] rounded-full animate-spin shadow-[0_0_15px_#D4AF37]"></div>

      {/* Text */}
      <p className="text-xs text-[#D4AF37]/80 tracking-[3px] uppercase">
        Loading Content
      </p>

    </div>
  );
}