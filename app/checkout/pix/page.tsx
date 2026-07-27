'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/CartContext';
import { ShieldCheck, Rocket, Lock, Copy, CheckCircle2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

type PixState = 'generating' | 'success' | 'error';

export default function PixPage() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [state, setState] = useState<PixState>('generating');
  const [error, setError] = useState('');
  const [pixData, setPixData] = useState<any>(null);
  const [cartTotalStr, setCartTotalStr] = useState('0');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkoutAmount = sessionStorage.getItem('checkoutAmount');
    setCartTotalStr(checkoutAmount || '0');

    if (!checkoutAmount) {
      setError('Faltam dados da compra. Volte ao checkout e tente novamente.');
      setState('error');
      return;
    }

    const generatePix = async () => {
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: parseFloat(checkoutAmount),
            payerName: 'Cliente',
            payerDocument: '00000000000'
          })
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || 'Erro ao gerar pagamento');
        }

        // VeloraPay wraps response in 'data' key
        setPixData(json.data || json);
        setState('success');
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Erro inesperado ao gerar o PIX.');
        setState('error');
      }
    };

    generatePix();
  }, []);

  const formatPrice = (price: string | number) => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num)) return '0,00';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getPixCode = () => {
    // VeloraPay returns copyPaste field
    return pixData?.copyPaste || pixData?.emv || pixData?.pix_code || pixData?.payload || pixData?.qr_code || pixData?.pixCopiaECola || '';
  };

  const getQrCodeImg = () => {
    const code = getPixCode();
    // VeloraPay returns qrCodeBase64 already with data:image prefix
    if (pixData?.qrCodeBase64) return pixData.qrCodeBase64;
    if (pixData?.qrcodeUrl) return pixData.qrcodeUrl;
    if (pixData?.qrcode_base64) return `data:image/png;base64,${pixData.qrcode_base64}`;
    if (pixData?.qr_code_base64) return `data:image/png;base64,${pixData.qr_code_base64}`;
    if (pixData?.qrCodeUrl) return pixData.qrCodeUrl;
    if (code) return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(code)}`;
    return '';
  };

  const copyPixCode = async () => {
    const code = getPixCode();
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 relative flex items-center justify-center overflow-hidden">

      {/* Background Effects */}
      <div className="fixed inset-0 bg-black pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_70%)] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-red-600/20 blur-[120px] rounded-full animate-[pulse_6s_ease-in-out_infinite] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-red-800/20 blur-[100px] rounded-full animate-[pulse_8s_ease-in-out_infinite_1s] pointer-events-none z-0" />

      <div className="w-full max-w-[1200px] px-4 lg:px-8 relative z-10 flex flex-col items-center justify-center">

        {/* ─── ERROR STATE ─── */}
        {state === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-10 max-w-lg w-full text-center backdrop-blur-2xl animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Falha ao gerar PIX</h2>
            <p className="text-white/70 mb-8 text-sm">{error}</p>
            <button
              onClick={() => router.push('/checkout')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
            >
              Voltar ao Checkout
            </button>
          </div>
        )}

        {/* ─── GENERATING + SUCCESS STATE (same layout, QR area updates) ─── */}
        {(state === 'generating' || state === 'success') && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-in slide-in-from-bottom-10 fade-in duration-700 ease-out">

            {/* LEFT: PIX Panel */}
            <div className="lg:col-span-7">
              <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 lg:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden h-full flex flex-col">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="text-center mb-10 relative z-10">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wider mb-6 transition-all duration-500 ${
                    state === 'success'
                      ? 'bg-red-500/10 border-red-500/20 text-red-400'
                      : 'bg-white/5 border-white/10 text-white/50'
                  }`}>
                    {state === 'success' ? (
                      <><CheckCircle2 className="w-4 h-4" /> PIX Gerado com Sucesso</>
                    ) : (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Gerando PIX...</>
                    )}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-black text-white mb-3">Efetue o pagamento</h1>
                  <p className="text-white/60">Escaneie o QR Code abaixo ou use a opção copia e cola.</p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                  {/* QR Code */}
                  <div className="relative p-1 rounded-3xl overflow-hidden group mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-black to-red-600 opacity-50 group-hover:animate-[spin_4s_linear_infinite]" />
                    <div className="relative bg-white p-4 rounded-[1.4rem] shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                      {state === 'generating' ? (
                        <div className="w-56 h-56 lg:w-64 lg:h-64 flex flex-col items-center justify-center gap-3">
                          <RefreshCw className="w-10 h-10 text-gray-300 animate-spin" />
                          <span className="text-gray-400 text-sm">Aguardando...</span>
                        </div>
                      ) : getQrCodeImg() ? (
                        <img src={getQrCodeImg()} alt="QR Code PIX" className="w-56 h-56 lg:w-64 lg:h-64 object-contain" />
                      ) : (
                        <div className="w-56 h-56 lg:w-64 lg:h-64 flex items-center justify-center text-gray-400 text-sm">
                          QR Code indisponível
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Copy code */}
                  <div className="w-full max-w-md">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-3 ml-2">Pix Copia e Cola</span>
                    <div className="flex bg-black/50 border border-white/10 rounded-2xl p-2 backdrop-blur-md">
                      <div className="flex-1 px-4 py-3 text-xs text-white/60 break-all flex items-center">
                        {state === 'generating' ? (
                          <span className="text-white/30 italic">Gerando código...</span>
                        ) : (
                          getPixCode() || 'Código indisponível'
                        )}
                      </div>
                      <button
                        onClick={copyPixCode}
                        disabled={state === 'generating' || !getPixCode()}
                        className={`font-bold px-6 rounded-xl transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                          copied
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                        }`}
                      >
                        {copied ? (
                          <><CheckCircle2 className="w-4 h-4" /> Copiado!</>
                        ) : (
                          <><Copy className="w-4 h-4" /> Copiar</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Summary Panel */}
            <div className="lg:col-span-5 flex flex-col gap-6 relative z-10">

              {/* Value Panel */}
              <div className="bg-gradient-to-br from-red-600/10 to-transparent backdrop-blur-xl border border-red-500/20 rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                <span className="text-sm font-medium text-red-400 mb-2 block relative z-10">Valor a pagar</span>
                <div className="text-5xl font-black text-white relative z-10 tracking-tight">
                  R$ {formatPrice(cartTotalStr)}
                </div>
              </div>

              {/* Security Panel */}
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 flex-1">
                <h3 className="text-lg font-bold text-white mb-6">Por que é seguro?</h3>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center shrink-0 text-red-500 mt-1">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Criptografia de Ponta</h4>
                      <p className="text-xs text-white/50 leading-relaxed">Seus dados e pagamento são processados com criptografia de ponta a ponta.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center shrink-0 text-red-500 mt-1">
                      <Rocket className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Aprovação Instantânea</h4>
                      <p className="text-xs text-white/50 leading-relaxed">O PIX é reconhecido em menos de 10 segundos, liberando seu produto automaticamente.</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/5 my-8" />

                <h3 className="text-sm font-bold text-white mb-4">Seus itens:</h3>
                <div className="space-y-3">
                  {items.length === 0 ? (
                    <div className="text-sm text-white/30 italic">Carregando...</div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="bg-black/30 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                        <img src={item.image || 'https://cdn.stormty.com/discord-uploads/1770775000597441752.png'} alt={item.name} className="w-8 h-8 object-contain" />
                        <span className="text-sm font-medium text-white/80">{item.quantity}x {item.name}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-xs text-white/30 font-medium">Compra protegida e criptografada</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
