'use client';

import { useCart } from '@/lib/CartContext';
import { ShoppingBag } from 'lucide-react';

export function CartBadge() {
  const { cartCount, toggleCart } = useCart();

  return (
    <div className="hidden md:flex">
      <button 
        onClick={() => toggleCart()}
        className="relative flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 transition hover:border-red-600/60 hover:bg-white/10"
      >
        <ShoppingBag className="w-5 h-5 text-white" />
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-sm ring-2 ring-black">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>
    </div>
  );
}
