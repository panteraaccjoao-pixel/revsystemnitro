'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/CartContext';
import { Trash2, Minus, Plus, CheckCircle2, Lock, User, FileText, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutClient() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [progress, setProgress] = useState(0);

  // State for errors and loading
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animated progress bar: cycles 0→2→4→8→16→32→64→100→reset
  useEffect(() => {
    const steps = [0, 2, 4, 8, 16, 32, 64, 100];
    let stepIndex = 0;
    setProgress(steps[0]);

    const advance = () => {
      stepIndex = (stepIndex + 1) % steps.length;
      setProgress(steps[stepIndex]);
    };

    // Jump to next step every 600ms
    const interval = setInterval(advance, 600);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError('Seu carrinho está vazio.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payerName: 'Cliente',
          payerDocument: '00000000000',
          items: items.map(item => ({
            productId: item.productId,
            variationName: item.variationName,
            quantity: item.quantity
          }))
        })
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Erro ao gerar pagamento');
      }

      // Store PIX data and amount for the PIX page to read
      sessionStorage.setItem('checkoutAmount', cartTotal.toString());
      sessionStorage.setItem('pixData', JSON.stringify(json.data || json));

      // Only navigate after PIX is successfully generated
      router.push('/checkout/pix');
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar PIX. Tente novamente.');
      setIsGenerating(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-black pt-28 pb-20 relative">

      {/* ── Animated progress bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-red-600 via-red-500/80 to-red-600/60 transition-all duration-500 ease-out shadow-lg shadow-red-500/20 relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>

      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.15),transparent_50%)] pointer-events-none z-0"></div>

      <div className="max-w-[1100px] mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Header Minimalista */}
        <div className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-2">Finalizar Compra</h1>
          <p className="text-sm text-white/50">Ambiente 100% seguro. Conclua seu pedido abaixo.</p>
        </div>

        {/* 2 Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Cart Items & Coupon (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Products Box */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-white mb-6">Produtos ({items.length})</h3>
              
              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="py-12 px-6 bg-[#0a0a0c] rounded-[1.5rem] border border-white/5 text-center">
                    <p className="text-sm text-white/50 mb-4">Seu carrinho está vazio.</p>
                    <button onClick={() => router.push('/produtos')} className="text-sm font-medium text-white hover:text-white/80 underline underline-offset-4 transition-colors">
                      Continuar comprando
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="bg-[#0a0a0c] border border-white/5 rounded-[1.5rem] p-4 flex gap-5 items-center hover:border-white/10 transition-colors">
                      <div className="w-16 h-16 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center shrink-0 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.2),transparent_60%)] pointer-events-none"></div>
                        <Zap className="w-6 h-6 text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate pr-4">{item.name}</h4>
                        <span className="text-xs text-white/40 block mt-0.5">R$ {formatPrice(item.price)} un.</span>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white/70 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-medium w-3 text-center text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-white/30 hover:text-red-500 transition-colors"
                          >
                            Remover
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-semibold text-white block">R$ {formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Coupon Box */}
            <div className="pt-4">
              <label className="text-sm font-medium text-white/70 block mb-3">Cupom de desconto</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Código do cupom" 
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 bg-[#0a0a0c] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
                />
                <button className="bg-white/5 hover:bg-white/10 border border-white/5 text-white text-sm font-medium px-6 rounded-xl transition-colors">
                  Aplicar
                </button>
              </div>
            </div>
          </div>


          {/* RIGHT COLUMN: Order Summary & PIX Payment (lg:col-span-5) */}
          <div className="lg:col-span-5">
            <div className="bg-[#0a0a0c] border border-white/5 rounded-[2rem] p-8 sticky top-32 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              
              <h3 className="text-lg font-medium text-white mb-6">Resumo do Pedido</h3>
              
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Subtotal</span>
                  <span className="text-white font-medium">R$ {formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Descontos</span>
                  <span className="text-white font-medium">R$ 0,00</span>
                </div>
              </div>
              
              <div className="border-t border-white/5 pt-5 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-sm text-white/50">Total</span>
                  <span className="text-3xl font-bold text-white">R$ {formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* PIX Minimalist Selection */}
              <div className="mb-6">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wider block mb-3">Forma de Pagamento</span>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <img src="https://logospng.org/download/pix/logo-pix-icone-1024.png" alt="Pix" className="w-4 h-4 object-contain brightness-0 invert" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white block">PIX</span>
                      <span className="text-xs text-white/40">Aprovação imediata</span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={isGenerating}
                className="w-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-70 disabled:hover:bg-red-600 font-semibold text-sm py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando PIX...
                  </>
                ) : (
                  `Pagar R$ ${formatPrice(cartTotal)} com PIX`
                )}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2">
                <Lock className="w-3.5 h-3.5 text-white/30" />
                <span className="text-xs text-white/30 font-medium">Compra protegida e criptografada</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
