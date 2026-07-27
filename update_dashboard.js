const fs = require('fs');
const file = 'C:/Users/seven/Downloads/rev-frontend/app/admin/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const recentPurchases = `
          <h3 className="text-lg font-semibold text-white mb-4">Compras Recentes</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {[
              { user: "Maria Santos", item: "Spotify Premium (3 Meses)", price: "R$ 25,00", time: "Há 5 min" },
              { user: "João Silva", item: "Conta Discord Nitro", price: "R$ 15,00", time: "Há 12 min" },
              { user: "Ana Clara", item: "Valorant Points (1000)", price: "R$ 35,00", time: "Há 1 hora" },
              { user: "Pedro Costa", item: "Conta Discord Nitro", price: "R$ 15,00", time: "Há 3 horas" },
            ].map((purchase, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold text-sm shrink-0">
                    {purchase.user.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{purchase.user}</div>
                    <div className="text-xs text-zinc-400">{purchase.item}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium text-sm">{purchase.price}</div>
                  <div className="text-xs text-zinc-500">{purchase.time}</div>
                </div>
              </div>
            ))}
          </div>
`;

c = c.replace(/<h3 className="text-lg font-semibold text-white mb-4">Últimas Vendas<\/h3>\s*<div className="flex-1 flex items-center justify-center border border-dashed border-white\/10 rounded-xl">\s*<span className="text-zinc-500">Gráfico de vendas \(Simulação\)<\/span>\s*<\/div>/g, recentPurchases);

fs.writeFileSync(file, c);
console.log('Successfully updated Dashboard with Recent Purchases');
