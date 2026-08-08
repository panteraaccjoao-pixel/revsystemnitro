'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronRight, Search, Minus, Plus, Zap, Check, Sparkles, ShoppingBag, ShieldCheck, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';

interface Variation {
  name: string;
  price: string;
  stock: number;
  icon: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  stock: number;
  image: string;
  has_variations: boolean;
  variations: Variation[];
  created_at: string;
}

export default function VariationClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, clearCart, toggleCart } = useCart();
  const [search, setSearch] = useState('');
  const [selectedVarIndex, setSelectedVarIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedComboStreamings, setSelectedComboStreamings] = useState<string[]>(['Netflix', 'Disney +', 'Amazon Prime']);

  const handleComboSelection = (name: string) => {
    setSelectedComboStreamings(prev => {
      if (prev.includes(name)) {
        if (prev.length === 1) return prev;
        return prev.filter(n => n !== name);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], name];
      }
      return [...prev, name];
    });
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Banner auto-scroll
  const banners = [
    product.image || 'https://cdn.stormty.com/categories/1765778855151241293.webp',
    'https://cdn.stormty.com/discord-uploads/1770832102251765553.png',
    'https://cdn.stormty.com/discord-uploads/1770832138400822951.png',
  ].filter(Boolean);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setBannerIndex(i => (i + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const variations = product.variations || [];
  
  const filteredVariations = useMemo(() => {
    if (!search) return variations;
    return variations.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));
  }, [search, variations]);

  const selectedVariation = variations[selectedVarIndex] || null;

  const getNumericPrice = (p: string | number) => {
    if (typeof p === 'object' || p === null || p === undefined) return 0;
    if (typeof p === 'number') return p;
    
    // Clean string keeping only digits, commas and dots
    let clean = p.replace(/[^\d,.]/g, '').trim();
    if (!clean) return 0;
    
    // If it has both dot and comma (e.g., 1.699,00)
    if (clean.includes(',') && clean.includes('.')) {
      if (clean.indexOf('.') < clean.indexOf(',')) {
        // Dot is thousand, comma is decimal
        clean = clean.replace(/\./g, '').replace(',', '.');
      } else {
        // Comma is thousand, dot is decimal
        clean = clean.replace(/,/g, '');
      }
    } else if (clean.includes(',')) {
      // Only comma present, treat as decimal separator (e.g., 16,99)
      clean = clean.replace(',', '.');
    }
    
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatPrice = (p: string | number) => {
    const num = getNumericPrice(p);
    return num.toFixed(2).replace('.', ',');
  };

  const isCombo = product.name === 'Combo Assinaturas';
  const currentPriceSingle = isCombo ? '15,99' : (selectedVariation ? formatPrice(selectedVariation.price) : '0,00');
  const currentPrice = isCombo ? formatPrice(15.99 * quantity) : (selectedVariation ? formatPrice(getNumericPrice(selectedVariation.price) * quantity) : '0,00');
  const currentStock = isCombo ? 99 : (selectedVariation ? selectedVariation.stock : product.stock);

  const handleQtyChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= currentStock) {
      setQuantity(newQty);
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 xl:px-8 py-8 lg:py-16 overflow-hidden">
      {/* Dynamic Keyframes for Custom Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(220,38,38,0.2), inset 0 0 10px rgba(220,38,38,0.1); }
          50% { box-shadow: 0 0 40px rgba(220,38,38,0.5), inset 0 0 20px rgba(220,38,38,0.2); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes banner-slide {
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .stagger-1 { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .stagger-2 { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
        .stagger-3 { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .stagger-4 { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .animate-pulse-glow { animation: pulse-glow 3s infinite; }
        .animate-banner { animation: banner-slide 0.6s ease-out forwards; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(220, 38, 38, 0.3); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(220, 38, 38, 0.6); }
      `}} />

      {/* Breadcrumb */}
      <nav className={`flex items-center space-x-2 text-sm text-muted-foreground mb-8 lg:mb-12 ml-3 ${isLoaded ? 'stagger-1' : 'opacity-0'}`}>
        <Link href="/" className="hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all text-red-600 font-semibold tracking-wide flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Início
        </Link>
        <ChevronRight className="w-4 h-4 text-white/30" />
        <Link href="/produtos" className="hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all text-red-600 font-semibold tracking-wide">
          Produtos
        </Link>
        <ChevronRight className="w-4 h-4 text-white/30" />
        <span className="text-white/80 font-medium">{product.name}</span>
      </nav>

      {/* GIANT 3-COLUMN LAYOUT with ANIMATED STYLING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 relative">
        
        {/* Left: Product Image (col-span-5) - Stagger 2 */}
        <div className={`lg:col-span-5 h-full ${isLoaded ? 'stagger-2' : 'opacity-0'}`}>
          <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_60px_-15px_rgba(220,38,38,0.2)] h-full min-h-[450px] relative group transition-all duration-700 hover:shadow-[0_30px_80px_-15px_rgba(220,38,38,0.4)] hover:border-red-500/30">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              /* Fallback: Entrega Automática placeholder */
              <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl flex flex-col items-center justify-center p-8 lg:p-12 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.25),transparent_60%)] pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)] animate-float mb-2">
                    <Zap className="w-10 h-10 text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
                  </div>
                  <h2 className="text-xl lg:text-2xl font-black text-white tracking-[0.15em] uppercase">Entrega Automática</h2>
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent my-1"></div>
                  <p className="text-xs text-white/50 max-w-xs leading-relaxed font-semibold">
                    Receba seu acesso imediatamente pelo chat após a confirmação do pagamento. Sistema 100% automatizado e seguro.
                  </p>
                </div>
              </div>
            )}
            {/* Overlay escuro na base com nome do produto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-flex items-center gap-2 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 shadow-lg">
                <Zap className="w-3 h-3 fill-white" /> Entrega Automática
              </div>
              <h2 className="text-white font-black text-lg md:text-xl drop-shadow-2xl leading-tight line-clamp-2">{product.name}</h2>
            </div>
          </div>
        </div>

        {/* Center: Details & Variations (col-span-4) - Stagger 3 */}
        <div className={`lg:col-span-4 flex flex-col ${isLoaded ? 'stagger-3' : 'opacity-0'}`}>
          
          <div className="inline-flex items-center gap-2 bg-red-600/10 text-red-500 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest w-fit mb-4 border border-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <Zap className="w-3.5 h-3.5 fill-red-500" />
            Entrega Automática
          </div>

          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 mb-4 leading-tight tracking-tight whitespace-nowrap">
            {isCombo ? `${selectedComboStreamings.join(' + ')} (30 Dias)` : (selectedVariation ? selectedVariation.name : product.name)}
          </h1>
          
          <div className="flex items-start gap-1.5 mb-8">
            <span className="text-lg text-red-500 mt-1.5 font-bold tracking-wider">R$</span>
            <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{currentPriceSingle}</span>
          </div>

          {/* Interactive streaming selector if it is 'Combo Assinaturas' */}
          {product.name === 'Combo Assinaturas' ? (
            <div className="relative mb-4">
              <h3 className="text-white/70 font-semibold mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
                Selecione 3 Streamings
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
              </h3>
              
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-bold tracking-wide shadow-[0_0_15px_rgba(220,38,38,0.1)]">
                Escolha qualquer 3 plataformas de streaming abaixo por apenas R$ 15,99!
              </div>

              {/* Grid of streamings */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[
                  { name: 'Netflix', color: 'border-red-600/30 hover:border-red-600/60 bg-red-950/10', selectedColor: 'border-red-600 bg-red-600/20 text-white' },
                  { name: 'Disney +', color: 'border-blue-600/30 hover:border-blue-600/60 bg-blue-950/10', selectedColor: 'border-blue-600 bg-blue-600/20 text-white' },
                  { name: 'Amazon Prime', color: 'border-cyan-500/30 hover:border-cyan-500/60 bg-cyan-950/10', selectedColor: 'border-cyan-500 bg-cyan-500/20 text-white' },
                  { name: 'Hbo Max', color: 'border-purple-600/30 hover:border-purple-600/60 bg-purple-950/10', selectedColor: 'border-purple-600 bg-purple-600/20 text-white' },
                  { name: 'Canva Pro', color: 'border-indigo-500/30 hover:border-indigo-500/60 bg-indigo-950/10', selectedColor: 'border-indigo-500 bg-indigo-500/20 text-white' },
                  { name: 'Crunchyroll', color: 'border-orange-500/30 hover:border-orange-500/60 bg-orange-950/10', selectedColor: 'border-orange-500 bg-orange-500/20 text-white' },
                  { name: 'Spotify Premium', color: 'border-green-500/30 hover:border-green-500/60 bg-green-950/10', selectedColor: 'border-green-500 bg-green-500/20 text-white' },
                  { name: 'Globo Play', color: 'border-rose-500/30 hover:border-rose-500/60 bg-rose-950/10', selectedColor: 'border-rose-500 bg-rose-500/20 text-white' },
                  { name: 'Youtube Premium', color: 'border-red-500/30 hover:border-red-500/60 bg-red-950/10', selectedColor: 'border-red-500 bg-red-500/20 text-white' }
                ].map(stream => {
                  const isSelected = selectedComboStreamings.includes(stream.name);
                  
                  return (
                    <button
                      key={stream.name}
                      type="button"
                      onClick={() => handleComboSelection(stream.name)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-bold transition-all duration-300 ${
                        isSelected ? stream.selectedColor : `${stream.color} text-zinc-400`
                      }`}
                    >
                      <span>{stream.name}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'border-transparent bg-white text-black' : 'border-zinc-600 bg-transparent'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[4px]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <div className="relative mb-4">
                <h3 className="text-white/70 font-semibold mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
                  Escolha seu pacote
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                </h3>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar pacotes..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-all backdrop-blur-xl shadow-inner"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto max-h-[380px] px-4 -mx-4 pr-6 pb-4 custom-scrollbar">
                {filteredVariations.map((v, idx) => {
                  const originalIndex = variations.findIndex(ov => ov.name === v.name);
                  const isSelected = selectedVarIndex === originalIndex;

                  return (
                    <div key={idx} className="px-1.5 py-1">
                      <button
                        onClick={() => {
                          setSelectedVarIndex(originalIndex);
                          setQuantity(1);
                      }}
                      className={`group relative flex items-center w-full p-3 rounded-2xl border text-left transition-all duration-300 ${
                        isSelected 
                          ? 'bg-white/[0.03] border-red-500/60 scale-[1.02] shadow-[0_4px_20px_rgba(220,38,38,0.1)]' 
                          : 'bg-white/[0.02] border-white/5 hover:border-red-500/30 hover:bg-white/[0.04] hover:scale-[1.01]'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5">
                          <Check className="w-3 h-3 text-red-500" />
                        </div>
                      )}

                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 shrink-0 transition-all duration-300 ${isSelected ? 'bg-red-500/20' : 'bg-white/5 group-hover:bg-red-500/10'}`}>
                        {v.icon ? (
                            <img src={v.icon} alt={v.name} className={`w-6 h-6 object-contain transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} />
                        ) : (
                            <Zap className={`w-5 h-5 transition-colors duration-300 ${isSelected ? 'text-red-500' : 'text-white/40 group-hover:text-red-400'}`} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 z-10 pr-2">
                        <h4 className={`text-sm font-bold truncate transition-colors duration-300 ${isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>{v.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          <p className="text-[10px] font-medium text-white/50">{v.stock} prontas</p>
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0 z-10">
                        <span className={`text-sm font-black transition-colors duration-300 ${isSelected ? 'text-red-400' : 'text-white'}`}>R$ {formatPrice(v.price)}</span>
                      </div>
                      </button>
                    </div>
                  );
                })}
                
                {filteredVariations.length === 0 && (
                    <div className="text-center py-6 bg-white/[0.02] rounded-2xl border border-white/5">
                        <Search className="w-6 h-6 text-white/20 mx-auto mb-2" />
                        <p className="text-xs font-medium text-white/50">Nenhuma variação.</p>
                    </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right: Holographic Checkout Panel (col-span-3) - Stagger 4 */}
        <div className={`lg:col-span-3 h-full ${isLoaded ? 'stagger-4' : 'opacity-0'}`}>
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-[2rem] p-6 lg:p-8 sticky top-24 relative overflow-hidden group hover:border-red-500/20 transition-all duration-500 h-full flex flex-col justify-between">
            {/* Subtle inner highlight */}
            <div className="absolute inset-0 rounded-[2rem] pointer-events-none border border-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
            
            {/* Holographic Gradient bg */}
            <div className="absolute -inset-24 bg-gradient-to-b from-red-600/5 to-transparent opacity-50 pointer-events-none rounded-[3rem] blur-xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-white/60 font-bold mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Resumo
              </h3>
            
              <div className="flex items-start gap-1.5 mb-2">
                <span className="text-base text-red-500 mt-1.5 font-bold">R$</span>
                <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter drop-shadow-md">{currentPrice}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-8">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <p className="text-xs font-medium text-white/60">{currentStock} unidades disponíveis</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-1 bg-black/40 border border-white/5 rounded-[1.25rem] backdrop-blur-md">
                  <button 
                    onClick={() => handleQtyChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex flex-col items-center justify-center w-12">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Qtd</span>
                    <span className="text-xl font-black text-white leading-none">{quantity}</span>
                  </div>
                  <button 
                    onClick={() => handleQtyChange(1)}
                    disabled={quantity >= currentStock}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-auto">
              <button 
                onClick={() => {
                  if (isCombo && selectedComboStreamings.length < 3) return;
                  const rawPrice = isCombo ? 15.99 : (selectedVariation ? getNumericPrice(selectedVariation.price) : 0);
                  const varName = isCombo ? `Combo: ${selectedComboStreamings.join(' + ')}` : (selectedVariation ? selectedVariation.name : 'Padrão');
                  clearCart();
                  addToCart({
                    id: `${product.id || 'p'}-${varName}`,
                    productId: product.id || 'p',
                    name: product.name,
                    variationName: varName,
                    price: rawPrice,
                    quantity: quantity,
                    image: product.image
                  });
                  toggleCart(false);
                  router.push('/checkout');
                }}
                disabled={isCombo && selectedComboStreamings.length < 3}
                className="w-full relative group overflow-hidden bg-red-600 text-white font-black text-sm lg:text-base py-4 rounded-[1.25rem] transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(220,38,38,0.8)] hover:shadow-[0_15px_40px_-10px_rgba(220,38,38,1)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none mb-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isCombo && selectedComboStreamings.length < 3 ? 'Escolha 3 Streamings' : 'Comprar Agora'}
                  {(!isCombo || selectedComboStreamings.length >= 3) && <ChevronRight className="w-4 h-4" />}
                </span>
              </button>
              
              <button 
                onClick={() => {
                  if (isCombo && selectedComboStreamings.length < 3) return;
                  const rawPrice = isCombo ? 15.99 : (selectedVariation ? getNumericPrice(selectedVariation.price) : 0);
                  const varName = isCombo ? `Combo: ${selectedComboStreamings.join(' + ')}` : (selectedVariation ? selectedVariation.name : 'Padrão');
                  addToCart({
                    id: `${product.id || 'p'}-${varName}`,
                    productId: product.id || 'p',
                    name: product.name,
                    variationName: varName,
                    price: rawPrice,
                    quantity: quantity,
                    image: product.image
                  });
                }}
                disabled={isCombo && selectedComboStreamings.length < 3}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 hover:text-white font-bold py-3.5 rounded-[1.25rem] transition-all duration-300 text-xs lg:text-sm active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Adicionar ao carrinho
              </button>

              <div className="mt-6 pt-5 border-t border-white/5">
                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Pagamento Seguro</h4>
                <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <span className="text-xs font-semibold text-white/80">PIX (Imediato)</span>
                  <div className="bg-white/5 p-1.5 rounded-lg border border-white/10 flex items-center justify-center">
                      <img src="https://logospng.org/download/pix/logo-pix-icone-1024.png" alt="Pix" className="w-5 h-5 object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Descrição do Produto - Animado Stagger 5 */}
      <div className={`mt-8 lg:mt-12 bg-white/[0.02] backdrop-blur-3xl border border-white/5 shadow-2xl rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden group hover:bg-white/[0.03] transition-all duration-700 ${isLoaded ? 'stagger-4' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
        {/* Glow de Fundo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-red-600/10 transition-colors duration-700"></div>
        
        <h2 className="text-xl lg:text-2xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
          <ShieldCheck className="w-6 h-6 text-red-500" />
          Descrição do Produto
        </h2>
        
        <div className="relative z-10 text-white/60 leading-relaxed text-sm lg:text-base space-y-4">
          {product.description ? (
            <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\\n/g, '<br/>') }} />
          ) : (
            <p>Nenhuma descrição detalhada disponível para este produto no momento.</p>
          )}
        </div>
      </div>
    </div>
  );
}
