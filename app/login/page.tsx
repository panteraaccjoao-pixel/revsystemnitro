"use client";
import { useEffect, useState } from 'react';

export default function Login() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  return (
    <div className="w-full h-screen overflow-hidden bg-background">

      {/* Liquid Glass Back Button */}
      <button 
        onClick={() => window.location.href = '/'}
        className="fixed top-6 left-6 md:top-8 md:left-8 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/80 group-hover:text-white transition-colors">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      <iframe src={`/login/index.html?captcha=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}`} className="w-full h-full border-none outline-none" style={{ display: 'block' }} />
    </div>
  );
}
