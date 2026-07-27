const fs = require('fs');
const file = 'C:/Users/seven/Downloads/rev-frontend/app/admin/products/page.tsx';

const code = `"use client";
import { useState } from "react";
import { Plus, Search, Edit2, Trash2, PackagePlus, PackageMinus, Image as ImageIcon, ShoppingCart, AlignLeft, ListPlus, X, Check, Eye } from "lucide-react";

export default function AdminProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([
    { id: "1", name: "Conta Discord Nitro", price: "R$ 15,00", category: "Discord", stock: 12 },
    { id: "2", name: "Spotify Premium", price: "R$ 25,00", category: "Streaming", stock: 5 },
  ]);

  // Novo Produto State
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: 1,
    category: "Discord",
    image: "",
    description: "",
    hasVariations: false,
    variations: [] as { name: string, price: string, stock: number }[]
  });

  const [previewMode, setPreviewMode] = useState<"card" | "page">("card");

  const handleCreateProduct = () => {
    setProducts([...products, {
      id: Math.random().toString(),
      name: newProduct.name || "Produto Sem Nome",
      price: newProduct.price ? \`R$ \${newProduct.price}\` : "R$ 0,00",
      category: newProduct.category,
      stock: newProduct.hasVariations ? newProduct.variations.reduce((acc, curr) => acc + curr.stock, 0) : newProduct.stock
    }]);
    setIsModalOpen(false);
    // Reset state omitted for brevity in mock
  };

  const addVariation = () => {
    setNewProduct({
      ...newProduct,
      variations: [...newProduct.variations, { name: "", price: "", stock: 1 }]
    });
  };

  const updateVariation = (index: number, field: string, value: any) => {
    const updated = [...newProduct.variations];
    updated[index] = { ...updated[index], [field]: value };
    setNewProduct({ ...newProduct, variations: updated });
  };

  const removeVariation = (index: number) => {
    const updated = newProduct.variations.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, variations: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Buscar produtos..." 
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff3333]/50 transition-colors"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#ff3333] hover:bg-[#ff3333]/90 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(255,51,51,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-white/5 border-b border-white/10 text-zinc-300">
            <tr>
              <th className="px-6 py-4 font-medium">Produto</th>
              <th className="px-6 py-4 font-medium">Preço Base</th>
              <th className="px-6 py-4 font-medium">Categoria</th>
              <th className="px-6 py-4 font-medium">Estoque Total</th>
              <th className="px-6 py-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                <td className="px-6 py-4 font-medium text-green-400">{product.price}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={\`font-medium \${product.stock > 0 ? 'text-white' : 'text-[#ff3333]'}\`}>
                      {product.stock} {product.stock === 0 && '(Esgotado)'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 transition-colors" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-[1400px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh]">
            
            {/* Esquerda: Formulário de Edição */}
            <div className="w-full md:w-[450px] border-r border-white/10 flex flex-col bg-[#0a0a0a] z-10 shrink-0">
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#ff3333]" />
                  Criar Produto
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Nome do Produto</label>
                    <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="Ex: Impulsos Discord" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff3333]/50 transition-colors" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">URL da Imagem</label>
                    <input type="text" value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} placeholder="https://..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff3333]/50 transition-colors" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Descrição</label>
                    <textarea value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} rows={3} placeholder="Garantia das contas compartilhadas..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff3333]/50 transition-colors resize-none" />
                  </div>
                </div>

                <hr className="border-white/10" />

                {/* Variações Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-white font-medium">Variações de Produto</h4>
                      <p className="text-xs text-zinc-500">Ex: Planos Mensais, Anuais, Quantidades</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={newProduct.hasVariations} onChange={(e) => setNewProduct({...newProduct, hasVariations: e.target.checked})} />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff3333]"></div>
                    </label>
                  </div>

                  {!newProduct.hasVariations ? (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Preço (R$)</label>
                        <input type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="7.99" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff3333]/50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Estoque</label>
                        <input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff3333]/50" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                      {newProduct.variations.map((v, idx) => (
                        <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl relative">
                          <button onClick={() => removeVariation(idx)} className="absolute top-2 right-2 text-zinc-500 hover:text-red-500"><X className="w-4 h-4"/></button>
                          <div className="space-y-3 mt-2">
                            <input type="text" value={v.name} onChange={(e) => updateVariation(idx, 'name', e.target.value)} placeholder="Ex: 4 Impulsos Mensais" className="w-full px-3 py-1.5 text-sm bg-black/50 border border-white/10 rounded-lg text-white" />
                            <div className="flex gap-2">
                              <input type="number" value={v.price} onChange={(e) => updateVariation(idx, 'price', e.target.value)} placeholder="Preço" className="w-1/2 px-3 py-1.5 text-sm bg-black/50 border border-white/10 rounded-lg text-white" />
                              <input type="number" value={v.stock} onChange={(e) => updateVariation(idx, 'stock', parseInt(e.target.value)||0)} placeholder="Estoque" className="w-1/2 px-3 py-1.5 text-sm bg-black/50 border border-white/10 rounded-lg text-white" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={addVariation} className="w-full py-2 border border-dashed border-white/20 rounded-xl text-zinc-400 hover:text-white hover:border-[#ff3333]/50 flex items-center justify-center gap-2 transition-colors">
                        <Plus className="w-4 h-4" /> Adicionar Variação
                      </button>
                    </div>
                  )}
                </div>

              </div>

              <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3 mt-auto">
                <button onClick={handleCreateProduct} className="w-full py-3 rounded-xl bg-[#ff3333] hover:bg-[#ff3333]/90 text-white font-medium shadow-[0_0_15px_rgba(255,51,51,0.3)] transition-colors">Salvar Produto</button>
              </div>
            </div>

            {/* Direita: Live Preview Dinâmico */}
            <div className="hidden md:flex flex-1 bg-[#050505] flex-col relative overflow-hidden">
              {/* Toolbar Preview */}
              <div className="absolute top-0 left-0 w-full p-4 flex justify-center z-20">
                <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                  <button onClick={() => setPreviewMode('card')} className={\`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 \${previewMode === 'card' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}\`}>
                    <Eye className="w-4 h-4"/> Vitrine (Antes do Clique)
                  </button>
                  <button onClick={() => setPreviewMode('page')} className={\`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 \${previewMode === 'page' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}\`}>
                    <AlignLeft className="w-4 h-4"/> Página (Após o Clique)
                  </button>
                </div>
              </div>

              {/* Área de Renderização */}
              <div className="flex-1 w-full h-full overflow-y-auto flex items-center justify-center p-8 pt-20">
                
                {previewMode === 'card' && (
                  /* ======= VIEW 1: VITRINE (CARD) ======= */
                  <div className="w-[300px] bg-[#111111] rounded-[20px] overflow-hidden border border-white/5 hover:border-white/10 transition-all shadow-xl">
                    <div className="h-[160px] w-full relative bg-zinc-900 flex justify-center items-center overflow-hidden">
                      {newProduct.image ? (
                        <img src={newProduct.image} className="w-full h-full object-cover" alt="Capa" />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-zinc-700" />
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-4">
                      <h4 className="text-white font-semibold text-[15px] truncate">{newProduct.name || "Nome do Produto"}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-zinc-500">À vista no PIX</span>
                        <button className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#222] text-white text-xs font-medium rounded-lg transition-colors border border-white/5">
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {previewMode === 'page' && (
                  /* ======= VIEW 2: PÁGINA INTERNA DO PRODUTO ======= */
                  <div className="w-full max-w-[900px] bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 flex flex-col gap-8 shadow-2xl h-full md:h-auto overflow-y-auto custom-scrollbar">
                    
                    {/* Header Breadcrumb simulado */}
                    <div className="text-xs text-[#ff3333] font-medium flex gap-2">
                      <span>Início</span> &gt; <span>Produtos</span> &gt; <span className="text-white">{newProduct.name || "Produto"}</span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Lado Esquerdo: Imagem */}
                      <div className="w-full lg:w-[450px] shrink-0">
                        <div className="w-full aspect-[4/3] rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden flex items-center justify-center">
                           {newProduct.image ? (
                            <img src={newProduct.image} className="w-full h-full object-cover" alt="Capa" />
                          ) : (
                            <ImageIcon className="w-16 h-16 text-zinc-700" />
                          )}
                        </div>
                      </div>

                      {/* Lado Direito: Informações */}
                      <div className="flex-1 flex flex-col min-w-0">
                        {newProduct.hasVariations ? (
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                            {newProduct.name || "Produto"} [ Promoção ]
                          </span>
                        ) : null}
                        
                        <h1 className="text-2xl font-bold text-white mb-2 truncate">
                          {newProduct.hasVariations && newProduct.variations.length > 0 
                            ? newProduct.variations[0].name || "Variação Selecionada" 
                            : newProduct.name || "Nome do Produto"}
                        </h1>
                        
                        {!newProduct.hasVariations && (
                          <p className="text-sm text-zinc-400 mb-4 line-clamp-3 leading-relaxed">
                            {newProduct.description || "- Nenhuma descrição adicionada ainda -"}
                          </p>
                        )}
                        
                        {newProduct.hasVariations && (
                          <div className="mt-4 border-b border-white/5 pb-4 mb-4">
                            <h3 className="text-sm font-medium text-white mb-3">Variações <span className="text-xs text-zinc-500 font-normal ml-1">Selecione o produto desejado abaixo.</span></h3>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                              {newProduct.variations.length === 0 ? (
                                <div className="p-3 border border-white/10 rounded-xl text-zinc-500 text-sm">Nenhuma variação adicionada...</div>
                              ) : (
                                newProduct.variations.map((v, i) => (
                                  <div key={i} className={\`flex justify-between items-center p-3 rounded-xl border \${i===0 ? 'border-[#ff3333] bg-[#ff3333]/5' : 'border-white/5 bg-[#111] hover:border-white/20'} cursor-pointer transition-all\`}>
                                    <div>
                                      <div className="text-sm font-medium text-white flex items-center gap-2">
                                        {i===0 && <span className="w-1.5 h-1.5 rounded-full bg-[#ff3333]"></span>}
                                        {v.name || \`Variação \${i+1}\`}
                                      </div>
                                      <div className="text-[10px] text-zinc-500 mt-0.5">Disponível ({v.stock})</div>
                                    </div>
                                    <div className="text-sm font-bold text-white">R$ {v.price || "0,00"}</div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Side Panel Comprar */}
                      <div className="w-full lg:w-[250px] shrink-0">
                        <div className="bg-[#111] border border-white/5 rounded-2xl p-5 shadow-lg">
                          <div className="text-xs text-zinc-400 font-medium mb-2">Estoque disponível</div>
                          <div className="flex items-end gap-1 mb-1">
                            <span className="text-sm text-zinc-400">R$</span>
                            <span className="text-2xl font-bold text-white">
                              {newProduct.hasVariations 
                                ? (newProduct.variations[0]?.price || "0,00") 
                                : (newProduct.price || "0,00")}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-500 mb-6">
                            {newProduct.hasVariations 
                                ? (newProduct.variations[0]?.stock || 0) 
                                : (newProduct.stock || 0)} disponível
                          </div>

                          <div className="flex items-center justify-between border border-white/10 rounded-lg p-2 mb-4 bg-black/30">
                            <span className="text-zinc-500 font-bold px-2 cursor-pointer hover:text-white">-</span>
                            <span className="text-[#ff3333] font-bold text-sm">1</span>
                            <span className="text-zinc-500 font-bold px-2 cursor-pointer hover:text-white">+</span>
                          </div>

                          <button className="w-full py-2.5 bg-[#ff5533] hover:bg-[#ff4422] text-white font-bold rounded-lg text-sm mb-3 transition-colors shadow-lg">
                            Comprar agora
                          </button>
                          
                          <button className="w-full py-2.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/5 text-white font-medium rounded-lg text-sm transition-colors">
                            Adicionar ao carrinho
                          </button>

                          <div className="mt-6">
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Meios de pagamentos</div>
                            <div className="text-xs text-zinc-400">À vista <span className="text-[#00bdae] font-bold ml-1">❖</span></div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Descrição em Baixo (se tiver variações) */}
                    {newProduct.hasVariations && (
                      <div className="mt-4">
                        <h3 className="text-lg font-bold text-white mb-4">Descrição</h3>
                        <div className="p-4 bg-[#111] border border-white/5 rounded-2xl text-sm text-zinc-400 leading-relaxed">
                          {newProduct.description || "- Nenhuma descrição adicionada ainda -"}
                        </div>
                      </div>
                    )}
                    
                  </div>
                )}
                
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(file, code.replace(/\\`/g, '`').replace(/\\\$/g, '$'));
console.log('Successfully updated Products Page with advanced Live Preview');
