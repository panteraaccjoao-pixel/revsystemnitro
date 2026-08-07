'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CartBadge } from '@/components/CartBadge';
import { UserMenu } from '@/components/UserMenu';

export function Header() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `inline-flex items-center justify-center gap-2 h-9 rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 ${
      isActive 
        ? 'text-white bg-white/5 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black border-b border-red-900/30 shadow-[0_4px_30px_rgba(220,38,38,0.15)] transition-all duration-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600/20 rounded-lg blur-md group-hover:bg-red-600/40 transition-all duration-500"></div>
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                src="/rev_system.mp4" 
                className="w-10 h-10 rounded-lg object-cover relative z-10 border border-white/5 group-hover:border-red-500/30 transition-colors" 
              />
            </div>
            <span className="text-xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">REV SYSTEM</span>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <Link href="/" className={getLinkClass('/')}>
              Início
            </Link>
            <Link href="/produtos" className={getLinkClass('/produtos')}>
              Produtos
            </Link>
            <Link href="/membros" className={getLinkClass('/membros')}>
              Membros
            </Link>
            <Link href="/cassino" className={getLinkClass('/cassino')}>
              Cassino
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            <CartBadge />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
