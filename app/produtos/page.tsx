"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, LayoutGrid } from 'lucide-react';
import { Header } from '@/components/Header';
import { CartDrawer } from '@/components/CartDrawer';
import { useCart } from '@/lib/CartContext';

export default function Produtos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const { addToCart } = useCart();

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

  const categories = useMemo(() => {
    const cats = new Set<string>();
    dbProducts.forEach(p => cats.add(p.category || 'Outros'));
    return ['Todos', ...Array.from(cats)];
  }, [dbProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = dbProducts;
    
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(p => (p.category || 'Outros') === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    // Agrupar novamente por categoria se for "Todos", ou apenas listar se for uma específica.
    // Mas a imagem mostra os itens agrupados com o título da categoria acima deles.
    const sectionsMap = new Map<string, any[]>();
    filtered.forEach(prod => {
      const catName = prod.category || "Outros";
      if (!sectionsMap.has(catName)) {
        sectionsMap.set(catName, []);
      }
      sectionsMap.get(catName)!.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image || "https://cdn.stormty.com/categories/1765778855151241293.webp"
      });
    });

    return Array.from(sectionsMap.entries()).map(([name, items]) => ({
      name,
      items
    }));
  }, [dbProducts, selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ff5533]/30 relative font-sans">
      <Header />
      <CartDrawer />

      <main className="relative z-10 pt-28 pb-16">
        <section className="container mx-auto px-4 pt-8 pb-6">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              Catálogo <span className="text-[#ff5533]">REV SYSTEM</span>
            </h1>
            <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
              Explore toda a nossa gama de produtos.
              <br />
              Todos os produtos são entregues automaticamente após a compra.
            </p>
          </div>

          {/* Filtros e Busca (conforme imagem) */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between mt-12 mb-10">
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar w-full md:w-auto flex-1">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    selectedCategory === cat 
                      ? 'bg-[#ff5533] text-black shadow-[0_0_15px_rgba(255,85,51,0.3)]' 
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 opacity-70" />
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar produto"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-white/5 border border-transparent rounded-2xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:bg-white/10 transition-all duration-300"
              />
            </div>
          </div>
        </section>

        {/* Categories and Products Grid */}
        <section className="container mx-auto px-4">
          <div className="space-y-12">
            {filteredProducts.map(section => (
              <div key={section.name} className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-4">
                  {section.name}
                  <div className="flex-1 h-px bg-white/10"></div>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {section.items.map(item => (
                    <Link 
                      key={item.id} 
                      href={`/produtos/categoria/${item.id}`}
                      className="bg-[#111111] border border-transparent hover:border-white/5 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group"
                    >
                      <div className="aspect-[16/10] relative bg-black/50 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-bold text-white text-sm mb-4 line-clamp-2">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-[11px] font-medium text-zinc-500">
                            À vista no PIX
                          </span>
                          <span className="px-4 py-2 bg-white/5 group-hover:bg-white/10 text-white text-[11px] font-bold rounded-xl transition-colors">
                            Ver Detalhes
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-zinc-500">Nenhum produto encontrado.</p>
              </div>
            )}
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
