"use client";
import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Tag } from "lucide-react";

export default function AdminCoupons() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons, setCoupons] = useState([
    { id: "1", code: "BEMVINDO20", discount: "20%", usage: "45/100", status: "Ativo" },
    { id: "2", code: "REV10", discount: "10%", usage: "∞", status: "Ativo" },
    { id: "3", code: "BLACKFRIDAY", discount: "50%", usage: "500/500", status: "Esgotado" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Buscar cupons..." 
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Novo Cupom
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-white/5 border-b border-white/10 text-zinc-300">
            <tr>
              <th className="px-6 py-4 font-medium">Código</th>
              <th className="px-6 py-4 font-medium">Desconto</th>
              <th className="px-6 py-4 font-medium">Uso</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-white">
                    <Tag className="w-3 h-3 text-red-500" />
                    {coupon.code}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-white">{coupon.discount}</td>
                <td className="px-6 py-4">{coupon.usage}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    coupon.status === 'Ativo' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {coupon.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 transition-colors" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setCoupons(coupons.filter(c => c.id !== coupon.id))} className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg text-zinc-400 transition-colors" title="Excluir">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Criar Cupom</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Código Promocional</label>
                <input type="text" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 uppercase font-mono" placeholder="EX: VERAO20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Desconto (%)</label>
                  <input type="number" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Limite de Uso</label>
                  <input type="number" placeholder="∞" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-zinc-400 hover:bg-white/10 font-medium">Cancelar</button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow-[0_0_15px_rgba(220,38,38,0.3)]">Criar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
