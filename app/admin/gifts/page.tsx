"use client";
import { useState } from "react";
import { Plus, Search, Copy, CheckCircle2, Trash2 } from "lucide-react";

export default function AdminGifts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [gifts, setGifts] = useState([
    { id: "1", code: "GIFT-A8F9-2B3C", value: "R$ 50,00", created: "Hoje, 14:23", status: "Disponível" },
    { id: "2", code: "GIFT-X1Y2-Z9W8", value: "R$ 10,00", created: "Ontem, 09:12", status: "Resgatado" },
    { id: "3", code: "GIFT-K4J5-H6G7", value: "R$ 100,00", created: "Ontem, 09:10", status: "Disponível" },
  ]);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Buscar gift card..." 
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Gerar Gift Card
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-white/5 border-b border-white/10 text-zinc-300">
            <tr>
              <th className="px-6 py-4 font-medium">Código</th>
              <th className="px-6 py-4 font-medium">Valor</th>
              <th className="px-6 py-4 font-medium">Gerado em</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {gifts.map((gift) => (
              <tr key={gift.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-white">{gift.code}</td>
                <td className="px-6 py-4 font-medium text-green-400">{gift.value}</td>
                <td className="px-6 py-4">{gift.created}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    gift.status === 'Disponível' ? 'bg-green-500/10 text-green-500' : 'bg-zinc-500/10 text-zinc-500'
                  }`}>
                    {gift.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => copyToClipboard(gift.code, gift.id)}
                      className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 transition-colors disabled:opacity-50"
                      disabled={gift.status !== 'Disponível'}
                      title="Copiar Código"
                    >
                      {copiedId === gift.id ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => setGifts(gifts.filter(g => g.id !== gift.id))}
                      className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg text-zinc-400 transition-colors"
                      title="Excluir"
                    >
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
              <h3 className="text-lg font-bold text-white">Gerar Gift Card</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Valor (R$)</label>
                <input type="number" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50" placeholder="Ex: 50.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Quantidade de Códigos</label>
                <input type="number" defaultValue={1} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-zinc-400 hover:bg-white/10 font-medium">Cancelar</button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow-[0_0_15px_rgba(220,38,38,0.3)]">Gerar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
