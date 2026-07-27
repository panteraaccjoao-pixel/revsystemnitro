const fs = require('fs');
const path = require('path');

const adminDir = 'C:/Users/seven/Downloads/rev-frontend/app/admin';

// Helpers
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. Users Page
ensureDir(path.join(adminDir, 'users'));
const usersContent = `"use client";
import { useState } from "react";
import { Search, MoreVertical, Edit2, Ban, Shield, CheckCircle } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { id: "1", name: "João Silva", email: "joao@example.com", balance: "R$ 45,00", status: "Ativo", role: "User" },
    { id: "2", name: "Maria Santos", email: "maria@example.com", balance: "R$ 120,50", status: "Ativo", role: "VIP" },
    { id: "3", name: "Pedro Costa", email: "pedro@example.com", balance: "R$ 0,00", status: "Banido", role: "User" },
    { id: "4", name: "Ana Clara", email: "ana@example.com", balance: "R$ 15,20", status: "Ativo", role: "User" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-white/5 border-b border-white/10 text-zinc-300">
              <tr>
                <th className="px-6 py-4 font-medium">Usuário</th>
                <th className="px-6 py-4 font-medium">Saldo</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Cargo</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-green-400">{user.balance}</td>
                  <td className="px-6 py-4">
                    <span className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium \${
                      user.status === 'Ativo' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }\`}>
                      {user.status === 'Ativo' ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white">
                      <Shield className="w-3.5 h-3.5 text-zinc-400" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 transition-colors" title="Editar">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg text-zinc-400 transition-colors" title="Banir">
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(adminDir, 'users', 'page.tsx'), usersContent);


// 2. Products Page
ensureDir(path.join(adminDir, 'products'));
const productsContent = `"use client";
import { useState } from "react";
import { Plus, Search, Edit2, Trash2, PackagePlus, PackageMinus } from "lucide-react";

export default function AdminProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([
    { id: "1", name: "Conta Discord Nitro (Mensal)", price: "R$ 15,00", category: "Discord", stock: 12 },
    { id: "2", name: "Spotify Premium (3 Meses)", price: "R$ 25,00", category: "Streaming", stock: 5 },
    { id: "3", name: "Valorant Points (1000)", price: "R$ 35,00", category: "Jogos", stock: 0 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Buscar produtos..." 
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
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
              <th className="px-6 py-4 font-medium">Preço</th>
              <th className="px-6 py-4 font-medium">Categoria</th>
              <th className="px-6 py-4 font-medium">Estoque</th>
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
                    <span className={\`font-medium \${product.stock > 0 ? 'text-white' : 'text-red-500'}\`}>
                      {product.stock} {product.stock === 0 && '(Esgotado)'}
                    </span>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-white/10 rounded text-zinc-400"><PackageMinus className="w-4 h-4" /></button>
                      <button className="p-1 hover:bg-white/10 rounded text-zinc-400"><PackagePlus className="w-4 h-4" /></button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 transition-colors" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg text-zinc-400 transition-colors" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Criar Produto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Criar Novo Produto</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Nome do Produto</label>
                <input type="text" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Preço (R$)</label>
                  <input type="text" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Estoque Inicial</label>
                  <input type="number" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Categoria</label>
                <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50">
                  <option>Discord</option>
                  <option>Streaming</option>
                  <option>Jogos</option>
                  <option>Roblox</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-zinc-400 hover:bg-white/10 font-medium">Cancelar</button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow-[0_0_15px_rgba(220,38,38,0.3)]">Criar Produto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(path.join(adminDir, 'products', 'page.tsx'), productsContent);
console.log('Users and Products pages generated.');
