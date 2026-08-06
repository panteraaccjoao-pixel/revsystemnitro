"use client";
import { useEffect, useState } from 'react';
import { Droplet } from 'lucide-react';

export default function Cadastro() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      {/* Liquid Glass Back Button (Top Right to prevent overlapping logo) */}
      <button 
        onClick={() => window.location.href = '/'}
        className="fixed top-6 right-6 md:top-8 md:right-8 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 group"
      >
        <Droplet className="w-5 h-5 text-red-500 hover:text-red-400 fill-current transition-colors" />
      </button>

      <iframe src="/cadastro/index.html" className="w-full h-full border-none outline-none" style={{ display: 'block' }} />
    </div>
  );
}
