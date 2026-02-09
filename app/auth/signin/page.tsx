'use client';

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050511]">

  {/* Background layers */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#0b1028] via-[#050511] to-black" />
  <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px]" />
  <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.035] mix-blend-overlay" />

  {/* Card wrapper */}
  <div className="relative z-10 w-full max-w-md px-6">
    <div
      className="
        relative
        rounded-[28px]
        border border-white/10
        bg-gradient-to-br from-white/[0.08] to-white/[0.02]
        backdrop-blur-2xl
        p-10
        shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]
        text-center
      "
    >
      {/* Logo */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-1">
          <span className="text-3xl font-semibold text-white tracking-tight italic">
            BetaEvo
          </span>
          <span className="h-6 w-[2px] bg-gradient-to-b from-orange-400 to-yellow-300 rotate-12 mx-1" />
          <span className="text-3xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Electronics
          </span>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-light text-white mb-2 tracking-tight">
        Welcome back
      </h1>
      <p className="text-sm text-gray-400 mb-10">
        Sign in to continue shopping smarter
      </p>

      {/* Divider */}
      <div className="relative mb-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 text-xs tracking-widest uppercase text-gray-500 bg-[#0b0e17]/80 backdrop-blur-md rounded-full">
            Secure sign in
          </span>
        </div>
      </div>

      {/* Google Button */}
      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="
          w-full h-14
          rounded-xl
          bg-gradient-to-br from-[#1b2038] to-[#12162a]
          border border-white/10
          text-white font-medium
          flex items-center justify-center gap-3
          shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]
          hover:translate-y-[-1px]
          hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,1)]
          transition-all duration-300
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        {/* Google Icon */}
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      {/* Footer */}
      <p className="mt-10 text-[11px] text-gray-500 leading-relaxed">
        By continuing, you agree to BetaEvo’s{" "}
        <a href="#" className="underline hover:text-gray-300 transition">Terms</a>{" "}
        &{" "}
        <a href="#" className="underline hover:text-gray-300 transition">Privacy Policy</a>
      </p>
    </div>
  </div>
</main>

  );
}
