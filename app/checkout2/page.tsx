"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Shield, Rocket, CheckCircle2, Loader2, ArrowLeft, Dices } from 'lucide-react';

function Checkout2Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const price = searchParams.get('price') || '2.99';
  const name = searchParams.get('name') || 'Cassino';

  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (p: string) => {
    const num = parseFloat(p);
    return isNaN(num) ? '0,00' : num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCheckout = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/checkout-cassino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price,
          name,
          payerName: 'Cliente Cassino',
          payerDocument: '00000000000'
        })
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Erro ao gerar pagamento');
      }

      // Salva os dados para a tela de Pix
      sessionStorage.setItem('checkoutAmount', price);
      sessionStorage.setItem('pixData', JSON.stringify(json.data || json));

      router.push('/checkout/pix');
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar PIX. Tente novamente.');
      setIsGenerating(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 relative font-sans">
      
      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.15),transparent_50%)] pointer-events-none z-0"></div>

      <div className="max-w-[600px] mx-auto px-6 relative z-10">
        
        {/* Back Button */}
        <button 
          onClick={() => router.push('/cassino')}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Jogo
        </button>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
            <Dices className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Comprar Créditos</h1>
          <p className="text-sm text-zinc-400">Gere o seu Pix para adicionar saldo e jogar.</p>
        </div>

        {/* Card Box */}
        <div className="bg-zinc-950/40 border border-white/5 backdrop-blur-3xl rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-3">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Details */}
          <div className="space-y-4 mb-6 pb-6 border-b border-white/5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Item Selecionado</span>
              <span className="font-bold text-white uppercase tracking-wider">{name}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Taxa de Serviço</span>
              <span className="font-bold text-green-500">Grátis</span>
            </div>
          </div>

          <div className="mb-8">
            <span className="text-xs text-zinc-500 font-semibold mb-1 block">Valor Total</span>
            <h2 className="text-4xl font-black text-white tracking-tight">
              R$ {formatPrice(price)}
            </h2>
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-3">Forma de Pagamento</span>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <img src="https://logospng.org/download/pix/logo-pix-icone-1024.png" alt="Pix" className="w-4 h-4 object-contain brightness-0 invert" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white block">PIX</span>
                  <span className="text-xs text-zinc-400">Aprovação imediata e automática</span>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Checkout Button */}
          <button 
            onClick={handleCheckout}
            disabled={isGenerating}
            className="w-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-70 disabled:hover:bg-red-600 font-semibold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Gerando Cobrança...</span>
              </>
            ) : (
              `Pagar R$ ${formatPrice(price)} com PIX`
            )}
          </button>

          {/* Safeguard guarantees */}
          <div className="mt-8 space-y-3 pt-6 border-t border-white/5">
            {[
              { Icon: Shield, title: 'Ambiente Protegido', desc: 'Sua transação é processada via criptografia de ponta a ponta.' },
              { Icon: Rocket, title: 'Processamento Instantâneo', desc: 'Seus créditos/rodada estarão prontos logo após o pagamento.' }
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">{title}</h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

export default function Checkout2Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando Checkout...</div>}>
      <Checkout2Content />
    </Suspense>
  );
}
