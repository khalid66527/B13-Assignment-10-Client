'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/forgot-password');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-amber-600/30 border-t-amber-600 dark:border-zinc-800 dark:border-t-[#D4AF37] rounded-full animate-spin"></div>
    </div>
  );
}
