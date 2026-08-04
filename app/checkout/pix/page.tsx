'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/CartContext';
import { Lock, Shield, Rocket, Copy, CheckCircle2, Clock, ChevronRight, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PixPage() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [cartTotalStr, setCartTotalStr] = useState('0');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const amount = sessionStorage.getItem('checkoutAmount');
    const data = sessionStorage.getItem('pixData');

    if (!amount || !data) {
      setError('Dados do PIX não encontrados. Volte ao checkout.');
      return;
    }

    try {
      setCartTotalStr(amount);
      setPixData(JSON.parse(data));
    } catch {
      setError('Erro ao carregar dados do PIX.');
    }
  }, []);

  const formatPrice = (price: string | number) => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num)) return '0,00';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getTransactionId = () => {
    const id = pixData?.transactionId || pixData?.externalId || pixData?.id || '—';
    return id.replace(/^vel_/i, '');
  };

  const getPixCode = () =>
    pixData?.copyPaste || pixData?.emv || pixData?.pix_code || pixData?.payload || pixData?.qr_code || '';

  const getQrCodeImg = () => {
    const code = getPixCode();
    if (pixData?.qrCodeBase64) return pixData.qrCodeBase64;
    if (pixData?.qrcodeUrl) return pixData.qrcodeUrl;
    if (pixData?.qrcode_base64) return `data:image/png;base64,${pixData.qrcode_base64}`;
    if (pixData?.qr_code_base64) return `data:image/png;base64,${pixData.qr_code_base64}`;
    if (code) return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(code)}`;
    return '';
  };

  const copyPixCode = async () => {
    const code = getPixCode();
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const today = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  if (!mounted) return null;

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-10 max-w-md w-full text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-bold text-white mb-3">{error}</h2>
          <button onClick={() => router.push('/checkout')}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-8 rounded-xl transition-all text-sm">
            Voltar ao Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] pt-20 pb-10">

      {/* ── Animated progress bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
        <div
          className="h-full relative overflow-hidden"
          style={{ width: '64%', background: 'linear-gradient(90deg, #dc2626, #ef4444, #dc2626)' }}
        >
          {/* Shimmer sweep */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>

      <div className="max-w-[1080px] mx-auto px-4 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* ── Breadcrumb ── */}
        <nav className="flex flex-wrap items-center gap-1 text-xs mb-2" aria-label="Trilha de navegação">
          <span className="flex items-center gap-1">
            <a className="text-red-500 hover:underline shrink-0" href="/">Início</a>
            <ChevronRight className="w-3 h-3 text-white/30 shrink-0" aria-hidden="true" />
          </span>
          <span className="text-white font-medium">Pagamento</span>
        </nav>

        {/* ── Main grid ── */}
        <div className="grid gap-5 lg:gap-8 lg:grid-cols-[1.8fr_1fr]">

          {/* LEFT PANEL */}
          <div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 sm:p-8 shadow-xl shadow-black/20">

              {/* Header */}
              <div className="mb-5">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                  Você está quase lá...
                </h1>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Para concluir sua compra, basta seguir os passos abaixo e realizar o pagamento via PIX. O processo é rápido e seguro, e você será redirecionado automaticamente após a confirmação.
                </p>
              </div>

              {/* Transaction table */}
              <div className="mb-5 rounded-xl bg-white/[0.02] border border-white/10 overflow-hidden">
                <div className="grid grid-cols-1 divide-y divide-white/10">
                  <div className="flex items-center justify-between gap-2 px-5 py-3">
                    <span className="text-sm text-zinc-400 font-medium shrink-0">ID da transação:</span>
                    <span className="text-sm text-white font-mono font-semibold truncate max-w-[200px] sm:max-w-none">{getTransactionId()}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-5 py-3">
                    <span className="text-sm text-zinc-400 font-medium shrink-0">Data da transação:</span>
                    <span className="text-sm text-white font-medium">{today}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-5 py-3">
                    <span className="text-sm text-zinc-400 font-medium shrink-0">Status da transação:</span>
                    <span className="text-sm text-red-400 font-semibold px-3 py-1 rounded-full bg-red-400/10 border border-red-400/20 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Pendente
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 mb-5">

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-xl bg-white p-3 shadow-2xl w-full max-w-[240px]">
                    {getQrCodeImg() ? (
                      <img src={getQrCodeImg()} alt="QR Code PIX" className="w-full h-auto object-contain" style={{ minHeight: '200px' }} />
                    ) : (
                      <div className="w-full aspect-square flex items-center justify-center text-gray-400 text-sm">Indisponível</div>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-zinc-400 text-center font-medium">Escaneie com o app do seu banco</p>
                </div>

                {/* Steps */}
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">Como pagar:</h3>
                  <ol className="space-y-3.5 list-none">
                    {[
                      'Abra o aplicativo do seu banco e acesse a área de pagamento via PIX.',
                      'Escolha a opção de pagar com QR Code e escaneie o código ao lado.',
                      'Confirme os detalhes da transação e realize o pagamento.',
                      'Aguarde cerca de 15 segundos, e você será redirecionado para a página de confirmação.',
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600/20 text-red-400 font-bold text-xs flex items-center justify-center border border-red-600/30">
                          {i + 1}
                        </span>
                        <p className="text-sm text-zinc-300 leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-medium text-zinc-400">Código PIX (Copia e Cola)</label>
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <input
                    readOnly
                    className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-500/50 break-all"
                    type="text"
                    value={getPixCode() || 'Código indisponível'}
                  />
                  <button
                    onClick={copyPixCode}
                    disabled={!getPixCode()}
                    className={`rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all duration-200 whitespace-nowrap border-2 ${
                      copied
                        ? 'bg-green-600/20 border-green-500/40 text-green-400'
                        : 'border-white/20 bg-white/[0.02] hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    {copied
                      ? <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Copiado!</span>
                      : <span className="flex items-center gap-2"><Copy className="w-4 h-4" /> Copiar código Pix</span>
                    }
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ══════════ RIGHT PANEL ══════════ */}
          <div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-4 sm:p-6 shadow-xl shadow-black/20 lg:sticky lg:top-24">

              {/* Value */}
              <div className="mb-4 pb-4 border-b border-white/10">
                <p className="text-xs text-zinc-400 font-medium mb-1">Valor Total</p>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                  R$&nbsp;{formatPrice(cartTotalStr)}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Lock className="w-3 h-3 text-red-500" />
                  <span className="font-medium">Pagamento 100% Seguro</span>
                </div>
              </div>

              {/* Products */}
              {items.length > 0 && (
                <div className="mb-4 pb-4 border-b border-white/10">
                  <p className="text-xs text-zinc-400 font-semibold mb-2">Produtos</p>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-2 hover:bg-white/[0.04] transition-colors">
                        <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 flex items-center justify-center bg-white/[0.02]">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.2),transparent_60%)] pointer-events-none"></div>
                          <Zap className="w-4 h-4 text-red-500 animate-pulse drop-shadow-[0_0_5px_rgba(220,38,38,0.6)]" />
                        </div>
                        <p className="text-xs text-white font-medium truncate">{item.quantity}x {item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guarantees */}
              <div className="space-y-3">
                {[
                  { Icon: Shield, title: 'Ambiente Seguro', desc: 'Seu pagamento será processado em um ambiente 100% seguro e protegido.' },
                  { Icon: Rocket, title: 'Pagamento Instantâneo', desc: 'Assim que o pagamento for confirmado, o seu pedido será processado imediatamente.' },
                  { Icon: Shield, title: 'Garantia REV System', desc: 'Seu pedido está protegido por nossa garantia de satisfação.' },
                ].map(({ Icon, title, desc }) => (
                  <div key={title} className="flex gap-2.5">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-red-500" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white mb-0.5">{title}</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
