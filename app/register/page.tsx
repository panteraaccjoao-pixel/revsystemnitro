"use client";
import { useEffect, useState } from 'react';
import { Syringe } from 'lucide-react';

export default function Cadastro() {
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
        <Syringe className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
      </button>

      <iframe 
        src={`/login/index.html?mode=register&recaptchaKey=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}`} 
        className="w-full h-full border-none outline-none" 
        style={{ display: 'block' }} 
      />
    </div>
  );
}
