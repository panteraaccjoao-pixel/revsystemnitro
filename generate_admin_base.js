const fs = require('fs');
const path = require('path');

const adminDir = 'C:/Users/seven/Downloads/rev-frontend/app/admin';
if (!fs.existsSync(adminDir)) {
  fs.mkdirSync(adminDir, { recursive: true });
}

const layoutContent = `"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Package, Ticket, Gift, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Usuários", href: "/admin/users", icon: Users },
    { name: "Produtos", href: "/admin/products", icon: Package },
    { name: "Cupons", href: "/admin/coupons", icon: Ticket },
    { name: "Gifts", href: "/admin/gifts", icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white">R</div>
            <span className="font-bold text-lg tracking-tight">REV ADMIN</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={\`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 \${
                  isActive 
                    ? "bg-red-600/10 text-red-500 font-medium" 
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                }\`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all duration-200">
            <LogOut className="w-5 h-5" />
            Sair
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-xl flex items-center px-6 sticky top-0 z-10">
          <h1 className="text-xl font-semibold capitalize text-zinc-100">
            {pathname.split("/").pop() || "Dashboard"}
          </h1>
        </header>
        <div className="p-6 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
`;

const dashboardContent = `"use client";
import { Users, DollarSign, ShoppingBag, Activity } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Total de Usuários", value: "2,405", trend: "+12%", icon: Users, color: "text-blue-500" },
    { title: "Receita Hoje", value: "R$ 4.230,00", trend: "+8%", icon: DollarSign, color: "text-green-500" },
    { title: "Produtos Ativos", value: "32", trend: "0%", icon: ShoppingBag, color: "text-purple-500" },
    { title: "Vendas (24h)", value: "145", trend: "+24%", icon: Activity, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400 font-medium">{stat.title}</span>
              <div className={\`p-2 rounded-lg bg-white/5 \${stat.color}\`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-bold text-white">{stat.value}</h2>
              <span className={\`text-sm font-medium \${stat.trend.startsWith('+') ? 'text-green-500' : 'text-zinc-500'}\`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-80 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Últimas Vendas</h3>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
            <span className="text-zinc-500">Gráfico de vendas (Simulação)</span>
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
`;

fs.writeFileSync(path.join(adminDir, 'layout.tsx'), layoutContent);
fs.writeFileSync(path.join(adminDir, 'page.tsx'), dashboardContent);
console.log('Admin Layout and Dashboard generated.');
