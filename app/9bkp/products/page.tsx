"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Minus, Search, Edit2, Trash2, PackagePlus, PackageMinus, Image as ImageIcon, ShoppingCart, AlignLeft, Eye, X, Save, Edit3, Settings, Zap, LayoutGrid, SlidersHorizontal, Copy } from "lucide-react";

const EditableText = ({ value, onChange, className = "", as = "input", type = "text", placeholder = "Editar..." }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localVal, setLocalVal] = useState(value);
  
  if (isEditing) {
    if (as === "textarea") {
      return (
        <textarea autoFocus value={localVal} onChange={e => setLocalVal(e.target.value)} onBlur={() => { onChange(localVal); setIsEditing(false); }} className={`bg-white/10 border border-white/20 rounded-md p-2 focus:outline-none focus:border-[#ff3333]/50 w-full resize-none ${className}`} rows={4} placeholder={placeholder} />
      );
    }
    return (
      <input autoFocus type={type} value={localVal} onChange={e => setLocalVal(e.target.value)} onBlur={() => { onChange(localVal); setIsEditing(false); }} className={`bg-black/50 border border-white/20 rounded-md px-2 py-0.5 focus:outline-none focus:border-[#ff3333]/50 w-full ${className}`} placeholder={placeholder} />
    );
  }

  return (
    <div onClick={() => setIsEditing(true)} className={`cursor-pointer hover:ring-1 hover:ring-dashed hover:ring-white/50 rounded-sm transition-all px-1 group relative ${className}`} title="Clique para editar">
      {value || <span className="text-white/30 italic">{placeholder}</span>}
      <Edit3 className="w-3 h-3 text-white/0 group-hover:text-white/50 absolute -right-4 top-1/2 -translate-y-1/2 transition-colors" />
    </div>
  );
};

export default function AdminProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ name: '', document: '' });
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [pixInfo, setPixInfo] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data && !error) {
        setProducts(data);
      }
      setIsLoaded(true);
    };
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('name').order('created_at', { ascending: true });
      if (data && !error) {
        setCategories(["Todos", ...data.map((c: any) => c.name)]);
      }
    };
    fetchProducts();
    fetchCategories();
  }, []);

  const [categories, setCategories] = useState(["Todos", "Nitros / Impulsos", "Contas Discord", "Assinaturas Streaming", "Métodos Exclusivos", "Prêmio Surpresa", "Roblox", "Jogos", "Outros"]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "Impulsos",
    price: "16,99",
    stock: 97,
    category: "Nitros / Impulsos",
    image: "https://cdn.stormty.com/discord-uploads/1770775000597441752.png",
    description: "Impulsos entregues de forma totalmente manual, garantindo segurança e precisão na ativação.",
    hasVariations: true,
    isAutoDelivery: true,
    variations: [
      { name: "4 Impulsos Mensais", price: "16,99", stock: 97, icon: "https://cdn.stormty.com/products/1765606313146801800.webp" },
      { name: "4 Impulsos Trimensais", price: "19,97", stock: 94, icon: "https://cdn.stormty.com/products/1765607089362526518.webp" },
      { name: "8 Impulsos Mensal", price: "23,99", stock: 94, icon: "https://cdn.stormty.com/products/1765607162597079208.webp" }
    ] as { name: string, price: string, stock: number, icon?: string }[]
  });

  const [previewMode, setPreviewMode] = useState<"card" | "page">("page");

  const handleSaveProduct = async () => {
    const productData = {
      name: newProduct.name || "Novo Produto",
      price: `R$ ${newProduct.price}`,
      category: newProduct.category || "Sem Categoria",
      stock: newProduct.hasVariations ? newProduct.variations.reduce((acc, curr) => acc + curr.stock, 0) : newProduct.stock,
      image: newProduct.image,
      description: newProduct.description,
      has_variations: newProduct.hasVariations,
      variations: newProduct.variations
    };

    if (editingProductId) {
      const { data, error } = await supabase.from('products').update(productData).eq('id', editingProductId).select().single();
      if (data && !error) {
        setProducts(products.map(p => p.id === editingProductId ? data : p));
      } else {
        console.error(error);
        alert("Erro ao atualizar produto no banco: " + (error?.message || JSON.stringify(error)));
      }
    } else {
      const { data, error } = await supabase.from('products').insert([productData]).select().single();
      if (data && !error) {
        setProducts([data, ...products]); // add new product to the top
      } else {
        console.error(error);
        alert("Erro ao salvar produto no banco: " + (error?.message || JSON.stringify(error)));
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert("Erro ao excluir produto");
      }
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price ? product.price.replace("R$ ", "") : "0,00",
      stock: product.stock,
      category: product.category,
      image: product.image,
      description: product.description,
      hasVariations: product.has_variations,
      variations: product.variations || [],
      isAutoDelivery: product.is_auto_delivery || false
    });
    setIsModalOpen(true);
  };

  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setNewProduct({
      name: "Novo Produto",
      price: "0,00",
      stock: 0,
      category: selectedCategory !== "Todos" ? selectedCategory : categories[1] || "Sem Categoria",
      image: "",
      description: "",
      hasVariations: false,
      variations: [],
      isAutoDelivery: true
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewProduct({ ...newProduct, image: url });
    }
  };

  const handleVariationIconUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateVariation(index, 'icon', url);
    }
  };

  const addVariation = () => {
    setNewProduct({
      ...newProduct,
      variations: [...newProduct.variations, { name: "", price: "0,00", stock: 0, icon: "" }]
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

  const handleCheckout = async () => {
    if (!checkoutData.name || !checkoutData.document) {
      alert("Preencha todos os campos!");
      return;
    }
    
    setIsGeneratingPix(true);
    try {
      // Calculate amount in cents
      let priceStr = newProduct.hasVariations ? (newProduct.variations[0]?.price || "0,00") : newProduct.price;
      const amountInCents = parseInt(priceStr.replace(',', '').replace('.', ''));

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInCents,
          payerName: checkoutData.name,
          payerDocument: checkoutData.document.replace(/\D/g, '') // Send only numbers
        })
      });

      const data = await response.json();
      if (response.ok) {
        setPixInfo(data); // Assume data contains qrCode and copyPaste
      } else {
        alert("Erro ao gerar PIX: " + (data.error || "Desconhecido"));
      }
    } catch (err) {
      alert("Erro de conexão ao gerar PIX");
    } finally {
      setIsGeneratingPix(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes((searchTerm || "").toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar produtos..." 
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff3333]/50 transition-colors"
          />
        </div>
        <button 
          onClick={handleOpenNewProduct}
          className="flex items-center gap-2 px-4 py-2 bg-[#ff3333] hover:bg-[#ff3333]/90 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(255,51,51,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${selectedCategory === cat ? 'bg-[#ff5533] text-black shadow-[0_0_15px_rgba(255,85,51,0.3)]' : 'bg-white/5 text-zinc-400 border border-white/5 hover:text-white hover:bg-white/10'}`}
          >
            {cat === "Todos" ? <SlidersHorizontal className="w-3.5 h-3.5"/> : <LayoutGrid className="w-3.5 h-3.5"/>}
            {cat}
          </button>
        ))}
        <button 
          onClick={async () => {
            const newCat = window.prompt("Nome da nova categoria:");
            if(newCat && !categories.includes(newCat)) {
              setCategories([...categories, newCat]);
              await supabase.from('categories').insert({ name: newCat });
            }
          }}
          className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap bg-white/5 text-zinc-400 border border-dashed border-white/20 hover:text-white hover:bg-white/10 transition-colors"
        >
          + Nova
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
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                <td className="px-6 py-4 font-medium text-green-400">{product.price}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${product.stock > 0 ? 'text-white' : 'text-[#ff3333]'}`}>
                    {product.stock} {product.stock === 0 && '(Esgotado)'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEditProduct(product)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 transition-colors" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 hover:bg-[#ff3333]/20 hover:text-[#ff3333] rounded-lg text-zinc-400 transition-colors" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#050505] animate-in fade-in duration-200 overflow-y-auto">
          
          {/* Topbar minimalista de edição */}
          <div className="w-full p-4 border-b border-white/5 bg-[#0a0a0a] flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
              <span className="text-zinc-500 text-sm font-medium">Modo de Criação WYSIWYG</span>
            </div>
            <button onClick={handleSaveProduct} className="px-5 py-2 rounded-xl bg-[#ff5533] hover:bg-[#ff5533]/90 text-black font-bold text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(255,85,51,0.3)] transition-colors">
              <Save className="w-4 h-4" /> Salvar Alterações
            </button>
          </div>

          {/* Área Principal (Cópia fiel da página) */}
          <div className="w-full max-w-[1200px] mx-auto p-6 md:p-8 pt-10">
            
            {/* Breadcrumbs */}
            <div className="text-[13px] font-medium flex gap-2 mb-8">
              <span className="text-[#ff5533]">Início</span> <span className="text-zinc-600">&gt;</span> <span className="text-[#ff5533]">Produtos</span> <span className="text-zinc-600">&gt;</span> <span className="text-white">{newProduct.name || "Produto"}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* COLUNA 1: Imagem Gigante (Esquerda) */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-sm">
                  <label className="relative w-full aspect-[4/3] bg-white/[0.02] flex items-center justify-center cursor-pointer hover:bg-white/[0.05] transition-all group">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    {newProduct.image ? (
                      <img src={newProduct.image} className="absolute w-full h-full inset-0 object-contain" alt="Capa" />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-zinc-600">
                        <ImageIcon className="w-12 h-12" />
                        <span className="text-sm font-medium">Upload da Imagem (4:3)</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                      <span className="text-white font-medium bg-black/60 px-5 py-2.5 rounded-lg border border-white/20 shadow-xl backdrop-blur-md">Alterar Imagem</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* COLUNA 2: Informações e Variações (Meio) */}
              <div className="lg:col-span-4 space-y-5">
                <div>
                  <div className="text-xs text-zinc-500 font-medium mb-1">
                    {newProduct.hasVariations ? (
                      <span className="flex items-center">
                        <EditableText 
                          value={newProduct.name} 
                          onChange={(val: string) => setNewProduct({...newProduct, name: val})} 
                          placeholder="Nome Base"
                        />
                        <span className="ml-1">[ Promoção ]</span>
                      </span>
                    ) : (
                      "Produto"
                    )}
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {newProduct.hasVariations ? (
                      <span>{newProduct.variations[0]?.name || "Selecione uma variação"}</span>
                    ) : (
                      <EditableText 
                        value={newProduct.name} 
                        onChange={(val: string) => setNewProduct({...newProduct, name: val})} 
                        placeholder="Nome do Produto"
                        className="font-bold w-full"
                      />
                    )}
                  </h1>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-zinc-500">R$</span>
                  <span className="text-3xl font-extrabold text-white flex items-center">
                    {newProduct.hasVariations ? (
                      <EditableText 
                        value={newProduct.variations[0]?.price || "0,00"} 
                        onChange={(val: string) => updateVariation(0, 'price', val)} 
                        placeholder="0,00" 
                      />
                    ) : (
                      <EditableText 
                        value={newProduct.price} 
                        onChange={(val: string) => setNewProduct({...newProduct, price: val})} 
                        placeholder="0,00" 
                      />
                    )}
                  </span>
                </div>
                
                <button 
                  onClick={() => setNewProduct({...newProduct, isAutoDelivery: !newProduct.isAutoDelivery})}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer w-max ${
                    newProduct.isAutoDelivery 
                      ? 'bg-[#ff5533]/10 border-[#ff5533]/20 text-[#ff5533] hover:bg-[#ff5533]/20' 
                      : 'border-white/10 bg-white/5 text-zinc-500 hover:bg-white/10'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" fill={newProduct.isAutoDelivery ? "currentColor" : "none"} />
                  Entrega Automática
                </button>

                <div className="h-px bg-white/5"></div>
                
                {/* Variações WYSIWYG Editor */}
                {newProduct.hasVariations ? (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-base font-bold text-white">Variações</h2>
                      <button onClick={() => setNewProduct({...newProduct, hasVariations: false})} className="text-[10px] uppercase font-bold text-zinc-500 hover:text-red-500 transition-colors">Desativar</button>
                    </div>
                    <p className="text-xs text-zinc-500 mb-4">Selecione o produto desejado abaixo.</p>
                    
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      
                      {/* Selected Variation */}
                      {newProduct.variations.length > 0 && (
                        <div className="rounded-2xl border-2 border-[#ff5533]/40 bg-[#ff5533]/5 p-4 relative group">
                          <button onClick={() => removeVariation(0)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3"/></button>
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-[#ff5533] mb-3">Selecionado</div>
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black" onClick={() => { const u = window.prompt("URL do Ícone:", newProduct.variations[0].icon); if(u!==null) updateVariation(0, 'icon', u); }}>
                                {newProduct.variations[0].icon ? (
                                  <img src={newProduct.variations[0].icon} alt="icon" className="absolute w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon className="w-4 h-4 text-zinc-500" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-white text-sm truncate">
                                  <EditableText value={newProduct.variations[0].name} onChange={(val: string) => updateVariation(0, 'name', val)} placeholder="Nome" />
                                </p>
                                <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                                  Disponível (<EditableText type="number" value={newProduct.variations[0].stock} onChange={(val: string) => updateVariation(0, 'stock', parseInt(val)||0)} className="w-8 text-center" />)
                                </p>
                              </div>
                            </div>
                            <div className="flex items-baseline gap-0.5 shrink-0 text-sm font-bold text-white">
                              <span className="text-zinc-500 text-xs">R$</span>
                              <EditableText value={newProduct.variations[0].price} onChange={(val: string) => updateVariation(0, 'price', val)} placeholder="0,00" className="w-14 text-right" />
                            </div>
                          </div>
                        </div>
                      )}

                      {newProduct.variations.length > 1 && (
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input type="text" placeholder="Pesquisar" className="w-full h-10 pl-9 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none pointer-events-none opacity-70" />
                        </div>
                      )}

                      {/* Other Variations */}
                      {newProduct.variations.slice(1).map((v, i) => {
                        const actualIndex = i + 1;
                        return (
                          <div key={actualIndex} className="w-full rounded-xl border border-white/10 p-3 text-left transition-all bg-white/[0.02] hover:border-white/20 hover:bg-white/5 relative group">
                            <button onClick={() => removeVariation(actualIndex)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"><X className="w-3 h-3"/></button>
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black" onClick={() => { const u = window.prompt("URL do Ícone:", v.icon); if(u!==null) updateVariation(actualIndex, 'icon', u); }}>
                                  {v.icon ? (
                                    <img src={v.icon} alt="icon" className="absolute w-full h-full object-cover" />
                                  ) : (
                                    <ImageIcon className="w-4 h-4 text-zinc-500" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-white text-xs truncate">
                                    <EditableText value={v.name} onChange={(val: string) => updateVariation(actualIndex, 'name', val)} placeholder="Nome" />
                                  </p>
                                  <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                                    Disponível (<EditableText type="number" value={v.stock} onChange={(val: string) => updateVariation(actualIndex, 'stock', parseInt(val)||0)} className="w-8 text-center" />)
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-baseline gap-0.5 shrink-0 text-xs font-bold text-white">
                                <span className="text-zinc-500">R$</span>
                                <EditableText value={v.price} onChange={(val: string) => updateVariation(actualIndex, 'price', val)} placeholder="0,00" className="w-12 text-right" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      <button onClick={addVariation} className="w-full py-3.5 border border-dashed border-white/10 hover:border-[#ff5533]/50 hover:bg-[#ff5533]/5 rounded-xl text-zinc-500 hover:text-[#ff5533] flex items-center justify-center gap-2 transition-colors text-sm font-bold mt-2">
                        <Plus className="w-4 h-4" /> Adicionar Variação
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 mb-6">
                    <button 
                      onClick={() => { 
                        setNewProduct({...newProduct, hasVariations: true}); 
                        if(newProduct.variations.length === 0) addVariation(); 
                      }} 
                      className="w-full py-6 border border-dashed border-white/10 hover:border-[#ff5533]/50 hover:bg-[#ff5533]/5 rounded-xl text-zinc-500 hover:text-[#ff5533] flex flex-col items-center justify-center gap-2 transition-colors group"
                    >
                      <PackagePlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-bold">Ativar Variações</span>
                    </button>
                  </div>
                )}
              </div>

              {/* COLUNA 3: Comprar (Direita) */}
              <div className="lg:col-span-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 space-y-5 lg:sticky lg:top-24 shadow-xl">
                  <div>
                    <p className="text-sm font-semibold text-white">Estoque disponível</p>
                    <div className="flex items-baseline gap-1 mt-3">
                      <span className="text-sm text-zinc-500">R$</span>
                      <span className="text-3xl font-extrabold text-white flex items-center">
                        {newProduct.hasVariations ? (
                          <EditableText 
                            value={newProduct.variations[0]?.price || "0,00"} 
                            onChange={(val: string) => updateVariation(0, 'price', val)} 
                            placeholder="0,00" 
                          />
                        ) : (
                          <EditableText 
                            value={newProduct.price} 
                            onChange={(val: string) => setNewProduct({...newProduct, price: val})} 
                            placeholder="0,00" 
                          />
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                      {newProduct.hasVariations ? (
                        <>{newProduct.variations[0]?.stock || 0} disponível</>
                      ) : (
                        <>
                          <EditableText type="number" value={newProduct.stock} onChange={(val: string) => setNewProduct({...newProduct, stock: parseInt(val)||0})} className="w-8 text-center" /> disponível
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-black/20">
                    <button type="button" className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-colors pointer-events-none">
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-sm font-bold text-[#ff5533]">1</span>
                    </div>
                    <button type="button" className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-colors pointer-events-none">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button onClick={() => setIsCheckoutOpen(true)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[#ff5533] text-black shadow-[0_0_30px_rgba(255,85,51,0.3)] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] px-5 py-2 w-full h-12 font-semibold rounded-xl" type="button">
                    Comprar agora
                  </button>
                  
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-transparent text-white hover:bg-white/5 hover:border-white/30 px-5 py-2 w-full h-12 rounded-xl font-semibold border-white/10 pointer-events-none" type="button">
                    Adicionar ao carrinho
                  </button>

                  <div className="pt-2">
                    <p className="text-xs font-semibold text-white mb-2">Meios de pagamentos</p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span>À vista</span>
                      <div className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#ff5533]" fill="currentColor"><path d="M9.5 4l3 3.5L9 11l-3.5-3.5L9.5 4zm5 0l3.5 3.5L14.5 11 11 7.5 14.5 4zM5 14.5L8.5 11l3.5 3.5-3.5 3.5L5 14.5zm9.5 0l3.5-3.5 3.5 3.5-3.5 3.5-3.5-3.5z"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Descrição em Baixo */}
            <div className="mt-16 border-t border-white/5 pt-10">
              <h3 className="text-xl font-bold text-white mb-6">Descrição</h3>
              <div className="text-[15px] text-zinc-400 leading-relaxed min-h-[120px] max-w-4xl">
                <EditableText 
                  as="textarea"
                  value={newProduct.description} 
                  onChange={(val: string) => setNewProduct({...newProduct, description: val})} 
                  placeholder="Escreva a descrição do produto aqui..."
                />
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Modal de Checkout (VeloraPay) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl">
            <button onClick={() => { setIsCheckoutOpen(false); setPixInfo(null); }} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-1">Finalizar Compra</h3>
              <p className="text-sm text-zinc-500 mb-6">Insira seus dados para gerar o PIX.</p>

              {!pixInfo ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-zinc-400 mb-1.5">Nome Completo</label>
                    <input 
                      type="text" 
                      value={checkoutData.name}
                      onChange={e => setCheckoutData({...checkoutData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff5533]/50" 
                      placeholder="João da Silva" 
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-zinc-400 mb-1.5">CPF</label>
                    <input 
                      type="text" 
                      value={checkoutData.document}
                      onChange={e => setCheckoutData({...checkoutData, document: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ff5533]/50" 
                      placeholder="000.000.000-00" 
                    />
                  </div>
                  <button 
                    onClick={handleCheckout} 
                    disabled={isGeneratingPix}
                    className="w-full py-4 mt-2 bg-[#ff5533] hover:bg-[#ff6644] text-black font-bold rounded-xl text-sm transition-all disabled:opacity-50"
                  >
                    {isGeneratingPix ? "Gerando PIX..." : "Gerar PIX agora"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center animate-in fade-in zoom-in-95">
                  <div className="text-[#ff5533] font-bold text-lg mb-4">PIX Gerado!</div>
                  <div className="bg-white p-4 rounded-xl mb-4">
                    {/* Exibe a Imagem do QR Code que a API retornar, ou um Placeholder se não vier imagem clara */}
                    {pixInfo.qrCode ? (
                      <img src={`data:image/png;base64,${pixInfo.qrCode}`} alt="QR Code PIX" className="w-48 h-48" />
                    ) : (
                      <div className="w-48 h-48 bg-gray-200 flex flex-col items-center justify-center text-center p-4">
                        <span className="text-gray-500 text-xs mb-2">Imagem do QR Code aqui (Depende do payload exato da VeloraPay)</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full">
                    <label className="block text-[13px] font-medium text-zinc-400 mb-1.5">PIX Copia e Cola</label>
                    <div className="flex gap-2">
                      <input 
                        readOnly 
                        value={pixInfo.copyPaste || pixInfo.emv || "Código Pix aqui"} 
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-400 font-mono text-xs focus:outline-none" 
                      />
                      <button 
                        onClick={() => navigator.clipboard.writeText(pixInfo.copyPaste || pixInfo.emv || "")}
                        className="px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                        title="Copiar Código"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
