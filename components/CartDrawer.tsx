'use client';

import React, { useEffect } from 'react';
import { useCart } from '@/lib/CartContext';
import { X, Minus, Plus, ShoppingBag, Trash2, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
  const { isCartOpen, toggleCart, items, updateQuantity, removeFromCart, cartTotal } = useCart();

  // Prevent scrolling on body when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleCart(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [toggleCart]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => toggleCart(false)}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-full max-w-[400px] z-[101] bg-[#0e1015]/90 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.5)] flex flex-col transition-transform duration-500 cubic-bezier(0.19, 1, 0.22, 1) ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <ShoppingBag className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-none mb-1">Seu Carrinho</h2>
              <p className="text-xs font-semibold text-white/50">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
            </div>
          </div>
          <button 
            onClick={() => toggleCart(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white/60 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <ShoppingBag className="w-16 h-16 text-white/20 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Carrinho Vazio</h3>
              <p className="text-sm text-white/60 max-w-[200px]">Adicione pacotes ao seu carrinho para finalizar a compra.</p>
              <button 
                onClick={() => toggleCart(false)}
                className="mt-8 px-6 py-3 rounded-full border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
              >
                Continuar Explorando
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] p-4 flex gap-4 group hover:border-red-500/30 transition-all duration-300 relative overflow-hidden">
                  
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                  <div className="w-20 h-20 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative group-hover:border-red-500/40 transition-all duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.2),transparent_60%)] pointer-events-none"></div>
                    <Zap className="w-8 h-8 text-red-500 animate-pulse drop-shadow-[0_0_10px_rgba(220,38,38,0.6)]" />
                  </div>
                  
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-white/30 hover:text-red-500 transition-colors p-1"
                        title="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <span className="text-xs font-semibold text-white/50 mb-3 block truncate">{item.variationName}</span>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-base font-black text-red-400">R$ {formatPrice(item.price * item.quantity)}</span>
                      
                      {/* Mini Qty Selector */}
                      <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white/80 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-[#0e1015]/95 backdrop-blur-xl">
            <div className="flex justify-between items-end mb-6">
              <span className="text-sm font-semibold text-white/50">Total</span>
              <div className="text-right">
                <span className="text-sm font-bold text-red-500 mr-1">R$</span>
                <span className="text-3xl font-black text-white leading-none tracking-tighter drop-shadow-md">{formatPrice(cartTotal)}</span>
              </div>
            </div>
            
            <Link 
              href="/checkout"
              onClick={() => toggleCart(false)}
              className="w-full relative group overflow-hidden bg-red-600 text-white font-black py-4 rounded-[1.25rem] transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(220,38,38,0.8)] hover:shadow-[0_15px_40px_-10px_rgba(220,38,38,1)] hover:scale-[1.02] active:scale-[0.98] block text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 text-base">
                Finalizar Compra
                <ChevronRight className="w-5 h-5" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
