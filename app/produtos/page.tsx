"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, ArrowRight, Zap } from 'lucide-react';
import { Header } from '@/components/Header';
import { CartDrawer } from '@/components/CartDrawer';
import { useCart } from '@/lib/CartContext';

// Catálogo fixo da imagem com banners originais da CDN
const CATALOG_SECTIONS = [
  {
    name: "Nitros / Impulsos",
    items: [
      {
        type: "category",
        name: "Impulsos [ Promoção ]",
        image: "https://cdn.stormty.com/categories/1765778855151241293.webp",
        link: "/produtos/categoria/impulsos"
      },
      {
        type: "category",
        name: "Nitros [ Promoção ]",
        image: "https://cdn.stormty.com/categories/1765778841482941247.webp",
        link: "/produtos/categoria/nitros"
      }
    ]
  },
  {
    name: "Contas Discord",
    items: [
      {
        type: "category",
        name: "Contas Discord",
        image: "https://cdn.stormty.com/categories/1765779530252063202.webp",
        link: "/produtos/categoria/contas"
      },
      {
        type: "category",
        name: "Nitradas",
        image: "https://cdn.stormty.com/categories/1765779388710088687.webp",
        link: "/produtos/categoria/nitradas"
      }
    ]
  },
  {
    name: "Assinaturas Streaming",
    items: [
      {
        type: "product",
        name: "Combo Assinaturas",
        price: "R$ 15,99",
        image: "https://cdn.stormty.com/discord-uploads/1770832102251765553.png"
      },
      {
        type: "product",
        name: "Netflix",
        price: "R$ 7,99",
        image: "https://cdn.stormty.com/discord-uploads/1770832138400822951.png"
      },
      {
        type: "product",
        name: "Disney +",
        price: "R$ 7,99",
        image: "https://cdn.stormty.com/discord-uploads/1770832199115049910.png"
      },
      {
        type: "product",
        name: "Amazon Prime",
        price: "R$ 5,99",
        image: "https://cdn.stormty.com/discord-uploads/1770832326146491445.png"
      },
      {
        type: "product",
        name: "Hbo Max",
        price: "R$ 5,96",
        image: "https://cdn.stormty.com/discord-uploads/1770832251718797897.png"
      },
      {
        type: "product",
        name: "Canva",
        price: "R$ 5,99",
        image: "https://cdn.stormty.com/discord-uploads/1770832513391083855.png"
      },
      {
        type: "product",
        name: "Crunchyroll",
        price: "R$ 5,98",
        image: "https://cdn.stormty.com/discord-uploads/1770832170479389596.png"
      },
      {
        type: "product",
        name: "Spotify Premium 3 Meses",
        price: "R$ 6,98",
        image: "https://cdn.stormty.com/discord-uploads/1770832380568978006.png"
      },
      {
        type: "product",
        name: "Globo Play",
        price: "R$ 6,99",
        image: "https://cdn.stormty.com/products/1771444746639536063.png"
      },
      {
        type: "product",
        name: "Youtube Premium",
        price: "R$ 5,99",
        image: "https://cdn.stormty.com/products/1771684340737555584.png"
      }
    ]
  },
  {
    name: "Métodos Exclusivos",
    items: [
      {
        type: "product",
        name: "Album da Copa 2026",
        price: "R$ 5,99",
        image: "https://cdn.stormty.com/products/1778595537124813805.png"
      },
      {
        type: "product",
        name: "Método Nitro",
        price: "R$ 9,98",
        image: "https://cdn.stormty.com/products/1778248308474679071.png"
      },
      {
        type: "product",
        name: "Internet Infinita",
        price: "R$ 5,99",
        image: "https://cdn.stormty.com/discord-uploads/1770831898126854835.png"
      },
      {
        type: "product",
        name: "IFOOD POR 1 REAL",
        price: "R$ 10,99",
        image: "https://cdn.stormty.com/products/1771685271488079216.png"
      },
      {
        type: "product",
        name: "Método MCDONALDS",
        price: "R$ 8,98",
        image: "https://cdn.stormty.com/discord-uploads/1770831832297051193.png"
      },
      {
        type: "product",
        name: "Método Gift Card",
        price: "R$ 10,99",
        image: "https://cdn.stormty.com/discord-uploads/1770831802622737824.png"
      },
      {
        type: "product",
        name: "Método Banir Instagram",
        price: "R$ 7,99",
        image: "https://cdn.stormty.com/discord-uploads/1770831865018982210.png"
      },
      {
        type: "product",
        name: "PACK COM 1500 MÉTODOS",
        price: "R$ 6,99",
        image: "https://cdn.stormty.com/products/1778249345274352906.jpg"
      },
      {
        type: "product",
        name: "OnlyFans e Privacy Eterno +18 ( Prazer Garantido )",
        price: "R$ 6,99",
        image: "https://cdn.stormty.com/discord-uploads/1770832548626273462.png"
      },
      {
        type: "product",
        name: "Painel Consulta Dados",
        price: "R$ 4,99",
        image: "https://cdn.stormty.com/discord-uploads/1770832605881926760.png"
      },
      {
        type: "product",
        name: "DIAMANTE GRATIS FREE FIRE",
        price: "R$ 5,99",
        image: "https://cdn.stormty.com/products/1778247845890013583.png"
      },
      {
        type: "product",
        name: "Shopee Produtos Grátis!",
        price: "R$ 4,97",
        image: "https://cdn.stormty.com/products/1778250549111250500.png"
      }
    ]
  }
];

export default function Produtos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const { addToCart } = useCart();

  // Load actual products from Database to map UUIDs correctly
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setDbProducts(data || []);
        }
      } catch (err) {
        console.error('Error fetching database products:', err);
      }
    }
    loadProducts();
  }, []);

  // Map product names to Supabase DB product objects
  const productMapping = useMemo(() => {
    const mapping: { [key: string]: any } = {};
    dbProducts.forEach(dbProd => {
      // Clean name for easier comparison
      const cleanDbName = dbProd.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      mapping[cleanDbName] = dbProd;
    });
    return mapping;
  }, [dbProducts]);

  // Helper to find Supabase product ID by display name
  const getProductDbLink = (displayName: string) => {
    const cleanName = displayName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matched = productMapping[cleanName];
    if (matched) {
      return `/produtos/categoria/${matched.id}`;
    }
    // Fallback if not found in db yet
    return '#';
  };

  // Add item to cart matching details
  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();

    const cleanName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matched = productMapping[cleanName];

    const priceNum = parseFloat(item.price.replace(/[^\d,.-]/g, '').replace(',', '.'));

    addToCart({
      id: `${matched?.id || item.name}-default`,
      productId: matched?.id || item.name,
      name: item.name,
      variationName: 'Padrão',
      price: isNaN(priceNum) ? 0 : priceNum,
      quantity: 1,
      image: item.image
    });
  };

  // Filtered sections and items based on search term
  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return CATALOG_SECTIONS;
    
    return CATALOG_SECTIONS.map(section => {
      const filteredItems = section.items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...section, items: filteredItems };
    }).filter(section => section.items.length > 0);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30 relative">
      {/* Ambient Red Glows (Subtler version) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse 85% 55% at 50% 0%, rgba(220,38,38,0.14) 0%, transparent 70%)' }}></div>
      <div style={{ position: 'absolute', left: '50%', top: '5%', transform: 'translateX(-50%)', width: '800px', height: '500px', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse, rgba(185,28,28,0.11) 0%, transparent 70%)', filter: 'blur(80px)' }}></div>

      <Header />
      <CartDrawer />

      <main className="relative z-10 pt-28 pb-16">
        {/* Header Section */}
        <section className="container mx-auto px-4 pt-12 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-foreground mb-3 tracking-tight">
                Catálogo <span className="bg-gradient-to-r from-[#e60000] to-red-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(230,0,0,0.2)]">REV SYSTEM</span>
              </h1>
              <p className="text-zinc-400 text-sm max-w-lg leading-relaxed">
                Explore toda a nossa gama de produtos virtuais.<br />
                Todos os produtos são entregues de forma automática e rápida após a compra.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-zinc-950/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#e60000]/50 focus:shadow-[0_0_15px_rgba(230,0,0,0.15)] transition-all duration-300"
              />
            </div>
          </div>
        </section>

        {/* Categories and Products Grid */}
        <section className="container mx-auto px-4 mt-6">
          <div className="space-y-14">
            {filteredSections.map(section => (
              <div key={section.name} className="space-y-6">
                {/* Section Title */}
                <div className="flex items-center gap-4">
                  <h2 className="text-lg md:text-xl font-bold text-white/95 tracking-tight">{section.name}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                  {section.items.map(item => {
                    const isProduct = item.type === 'product';
                    const targetLink = getProductDbLink(item.name);

                    return (
                      <Link 
                        key={item.name} 
                        href={targetLink}
                        className="group relative rounded-2xl border border-white/5 bg-zinc-950/20 hover:bg-zinc-900/10 hover:border-[#e60000]/40 transition-all duration-300 hover:shadow-[0_15px_40px_-10px_rgba(230,0,0,0.25)] hover:-translate-y-1.5 flex flex-col h-full overflow-hidden"
                      >
                        {/* Area de aviso no lugar do banner */}
                        <div className="aspect-[16/10] overflow-hidden relative bg-zinc-950/60 border-b border-white/5 flex flex-col items-center justify-center p-3 sm:p-4 text-center group">
                          {/* Radial Glow vermelho de fundo */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,0,0,0.2),transparent_70%)] pointer-events-none"></div>
                          
                          {/* Floating content idêntico à página de vendas */}
                          <div className="relative z-10 flex flex-col items-center gap-1.5 sm:gap-2">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#e60000]/10 border border-[#e60000]/20 flex items-center justify-center shadow-[0_0_15px_rgba(230,0,0,0.2)] group-hover:scale-105 transition-transform duration-300">
                              <Zap className="w-5.5 h-5.5 text-[#e60000] animate-pulse drop-shadow-[0_0_8px_rgba(230,0,0,0.8)]" />
                            </div>
                            
                            <h4 className="text-[9px] sm:text-[10px] font-black text-white tracking-[0.12em] uppercase leading-none mt-1">
                              Entrega Automática
                            </h4>
                            
                            <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#e60000] to-transparent my-0.5 sm:my-1"></div>
                            
                            <p className="text-[7.5px] sm:text-[8px] text-zinc-500 font-bold leading-normal px-2 max-w-[200px]">
                              Receba seu acesso imediatamente pelo chat após a confirmação do pagamento.
                            </p>
                          </div>
                        </div>

                        {/* Info details */}
                        <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2 justify-between">
                          <div className="space-y-2">
                            <h3 className="font-bold text-zinc-200 text-xs sm:text-sm group-hover:text-white transition-colors duration-300 line-clamp-2">
                              {item.name}
                            </h3>
                          </div>
                          
                          <div className="mt-auto pt-2 flex flex-col gap-2">
                            {isProduct ? (
                              <>
                                {/* Price line */}
                                <div className="flex items-center justify-between gap-1.5">
                                  <span className="text-sm sm:text-base font-black text-white tracking-tight">
                                    {(item as any).price}
                                  </span>
                                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 shrink-0">
                                    Automático
                                  </span>
                                </div>
                                <p className="text-[10px] text-zinc-500">À vista no PIX</p>
                                
                                {/* Buy button and quick add */}
                                <div className="flex gap-1.5 items-center mt-1">
                                  <span className="flex-1 text-center py-2 rounded-xl text-[10px] sm:text-xs font-extrabold transition-all duration-300 bg-white/5 border border-white/5 group-hover:bg-[#e60000] group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_0_15px_rgba(230,0,0,0.3)]">
                                    Comprar
                                  </span>
                                  
                                  <button
                                    type="button"
                                    onClick={(e) => handleAddToCart(e, item as any)}
                                    className="p-2 rounded-xl border border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white hover:border-[#e60000]/40 hover:bg-[#e60000]/10 shrink-0 flex items-center justify-center transition-all"
                                    title="Adicionar ao carrinho"
                                  >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <p className="text-[10px] text-zinc-500">À vista no PIX</p>
                                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-all duration-300 mt-1">
                                  <span className="text-[10px] sm:text-xs font-extrabold text-zinc-300 group-hover:text-white">Ver detalhes</span>
                                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#e60000] group-hover:translate-x-0.5 transition-all" />
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Glow Red Hover Line */}
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e60000] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/5 overflow-hidden bg-black mt-12">
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/10 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                src="/rev_system.mp4" 
                className="w-8 h-8 rounded-lg object-cover" 
              />
              <span className="text-lg font-bold text-white tracking-tight">REV SYSTEM</span>
            </div>
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} REV SYSTEM. Todos os direitos reservados.
            </p>
            <nav className="flex items-center gap-6">
              <Link href="/privacidade" className="text-sm text-zinc-500 hover:text-white transition-colors">
                Privacidade
              </Link>
              <Link href="/termos" className="text-sm text-zinc-500 hover:text-white transition-colors">
                Termos
              </Link>
              <Link href="/status" className="text-sm text-zinc-500 hover:text-white transition-colors">
                Status
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
