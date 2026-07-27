const fs = require('fs');
const file = 'C:/Users/seven/Downloads/rev-frontend/app/admin/products/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Update the state initialization for variations to include 'icon'
c = c.replace(
  /variations: \[\] as \{ name: string, price: string, stock: number \}\[\]/,
  'variations: [] as { name: string, price: string, stock: number, icon?: string }[]'
);

c = c.replace(
  /variations: \[\.\.\.newProduct\.variations, \{ name: "", price: "", stock: 1 \}\]/,
  'variations: [...newProduct.variations, { name: "", price: "", stock: 1, icon: "" }]'
);

// 2. Update the left column form inputs to include the icon URL input
const oldInputs = \`                            <div className="flex gap-2">
                              <input type="number" value={v.price} onChange={(e) => updateVariation(idx, 'price', e.target.value)} placeholder="Preço" className="w-1/2 px-3 py-1.5 text-sm bg-black/50 border border-white/10 rounded-lg text-white" />
                              <input type="number" value={v.stock} onChange={(e) => updateVariation(idx, 'stock', parseInt(e.target.value)||0)} placeholder="Estoque" className="w-1/2 px-3 py-1.5 text-sm bg-black/50 border border-white/10 rounded-lg text-white" />
                            </div>\`;

const newInputs = \`                            <div className="flex gap-2">
                              <input type="number" value={v.price} onChange={(e) => updateVariation(idx, 'price', e.target.value)} placeholder="Preço" className="w-1/3 px-3 py-1.5 text-sm bg-black/50 border border-white/10 rounded-lg text-white" title="Preço" />
                              <input type="number" value={v.stock} onChange={(e) => updateVariation(idx, 'stock', parseInt(e.target.value)||0)} placeholder="Estoque" className="w-1/3 px-3 py-1.5 text-sm bg-black/50 border border-white/10 rounded-lg text-white" title="Estoque" />
                              <input type="text" value={v.icon || ''} onChange={(e) => updateVariation(idx, 'icon', e.target.value)} placeholder="URL do Ícone (Opcional)" className="w-1/3 px-3 py-1.5 text-sm bg-black/50 border border-white/10 rounded-lg text-white" title="URL da Imagem do Ícone" />
                            </div>\`;

c = c.replace(oldInputs, newInputs);

// 3. Update the Live Preview to show the icon instead of just the red dot
const oldPreview = \`                                      <div className="text-sm font-medium text-white flex items-center gap-2">
                                        {i===0 && <span className="w-1.5 h-1.5 rounded-full bg-[#ff3333]"></span>}
                                        {v.name || \\\`Variação \\\${i+1}\\\`}
                                      </div>\`;

const newPreview = \`                                      <div className="text-sm font-medium text-white flex items-center gap-2.5">
                                        {v.icon ? (
                                          <img src={v.icon} alt="icon" className="w-5 h-5 object-contain" />
                                        ) : (
                                          <div className="w-5 h-5 flex items-center justify-center">
                                            <span className={\\\`w-1.5 h-1.5 rounded-full \\\${i===0 ? 'bg-[#ff3333]' : 'bg-zinc-700'}\\\`}></span>
                                          </div>
                                        )}
                                        {v.name || \\\`Variação \\\${i+1}\\\`}
                                      </div>\`;

c = c.replace(oldPreview, newPreview);

fs.writeFileSync(file, c);
console.log('Successfully updated Products Page with Variation Icons');
