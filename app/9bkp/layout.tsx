"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Package, Ticket, Gift, LogOut, ShieldAlert, KeyRound, ArrowRight } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navItems = [
    { name: "Dashboard", href: "/9bkp", icon: LayoutDashboard },
    { name: "Usuários", href: "/9bkp/users", icon: Users },
    { name: "Produtos", href: "/9bkp/products", icon: Package },
    { name: "Cupons", href: "/9bkp/coupons", icon: Ticket },
    { name: "Gifts", href: "/9bkp/gifts", icon: Gift },
  ];

  // Verificar autenticação no carregamento
  useEffect(() => {
    try {
      const savedAuth = sessionStorage.getItem("admin_authenticated");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = "21122010Jppj$$$";
    
    if (password === correctPassword) {
      try {
        sessionStorage.setItem("admin_authenticated", "true");
      } catch (e) {}
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Senha administrativa incorreta!");
      setPassword("");
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem("admin_authenticated");
    } catch (e) {}
    setIsAuthenticated(false);
  };

  // Enquanto verifica o sessionStorage, renderiza um loading preto minimalista
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">
        Carregando painel de segurança...
      </div>
    );
  }

  // Tela de bloqueio por senha
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
        
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(230,0,0,0.1),transparent_50%)] pointer-events-none z-0"></div>

        <div className="max-w-[420px] w-full bg-zinc-950/55 border border-red-500/20 backdrop-blur-3xl rounded-3xl p-8 shadow-[0_20px_50px_rgba(230,0,0,0.05)] text-center relative z-10 animate-in fade-in zoom-in duration-300">
          
          {/* Logo / Shield Icon */}
          <div className="w-14 h-14 bg-red-500/10 border border-red-500/35 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <ShieldAlert className="w-7 h-7 text-[#ef4444]" />
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight uppercase">Painel Restrito</h2>
          <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-bold">Identificação Necessária</p>
          
          <div className="h-px bg-white/5 my-6"></div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 pl-1">
                <KeyRound className="w-3.5 h-3.5 text-zinc-500" /> Senha do Administrador
              </label>
              <input 
                type="password"
                placeholder="••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d0d0f]/80 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#ef4444]/40 transition-colors font-mono text-center tracking-wider"
                required
                autoFocus
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-semibold text-center mt-1 animate-pulse">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#e60000] hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(230,0,0,0.25)] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              Acessar Painel <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

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
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "bg-red-600/10 text-red-500 font-medium" 
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all duration-200 text-left"
          >
            <LogOut className="w-5 h-5" />
            Bloquear Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-xl flex items-center px-6 justify-between sticky top-0 z-10">
          <h1 className="text-xl font-semibold capitalize text-zinc-100">
            {pathname.split("/").pop() === "9bkp" ? "Dashboard" : pathname.split("/").pop() || "Dashboard"}
          </h1>
          <button 
            onClick={handleLogout} 
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            title="Bloquear Painel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>
        <div className="p-6 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
