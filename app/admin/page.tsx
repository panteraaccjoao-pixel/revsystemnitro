"use client";
import { Users, DollarSign, ShoppingBag, Activity } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Total de Usuários", value: "0", trend: "0%", icon: Users, color: "text-blue-500" },
    { title: "Receita Hoje", value: "R$ 0,00", trend: "0%", icon: DollarSign, color: "text-green-500" },
    { title: "Produtos Ativos", value: "0", trend: "0%", icon: ShoppingBag, color: "text-purple-500" },
    { title: "Vendas (24h)", value: "0", trend: "0%", icon: Activity, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400 font-medium">{stat.title}</span>
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-bold text-white">{stat.value}</h2>
              <span className={`text-sm font-medium ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-zinc-500'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-80 flex flex-col">
          
          <h3 className="text-lg font-semibold text-white mb-4">Compras Recentes</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 flex items-center justify-center">
             <span className="text-zinc-500 font-medium text-sm">Nenhuma compra recente</span>
          </div>

        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-80 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Acessos Recentes</h3>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
            <span className="text-zinc-500">Gráfico de acessos (Simulação)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
