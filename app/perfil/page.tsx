"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Mail, ShieldCheck, ShoppingBag, Crown, Zap, Clock, ShieldAlert, ChevronRight } from "lucide-react"

interface UserData {
  id: string
  email: string
  name: string
  created_at?: string
}

export default function PerfilPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login")
          return
        }
        setUser(data.user)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-[72px] flex flex-col items-center justify-center gap-3">
        <svg className="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-zinc-500 text-sm">Carregando perfil...</p>
      </div>
    )
  }

  if (!user) return null

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    : "Recentemente"

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-[72px]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Header de navegação */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-all duration-300 bg-white/5 border border-white/10 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <h1 className="text-white text-2xl font-bold flex items-center gap-2">
            Meu Perfil
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Coluna Esquerda - Identificação */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card de Perfil */}
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/40 relative">
              {/* Banner / Cover */}
              <div className="h-28 bg-gradient-to-r from-red-900/40 via-red-600/20 to-black relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>

              <div className="px-6 pb-6 relative">
                {/* Avatar */}
                <div className="relative -mt-12 mb-4 inline-block">
                  <div className="absolute inset-0 bg-red-600/30 rounded-full blur-xl" />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-700 to-red-950 border-4 border-[#0a0a0a] flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                    {initials}
                  </div>
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </div>
                </div>

                <h2 className="text-white font-bold text-xl leading-tight">{user.name}</h2>
                <p className="text-zinc-400 text-sm mb-5">{user.email}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-red-400 bg-red-400/10 border border-red-400/20">
                    <Crown className="w-3 h-3" />
                    Membro Padrão
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-zinc-400 bg-white/5 border border-white/10">
                    Desde {joinDate}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-6">
                  <Link
                    href="/perfil/configuracoes"
                    className="flex items-center justify-center h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all border border-white/10"
                  >
                    Editar Perfil
                  </Link>
                  <Link
                    href="/pedidos"
                    className="flex items-center justify-center gap-2 h-10 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Pedidos
                  </Link>
                </div>
              </div>
            </div>

            {/* Suporte Rápido */}
            <div className="rounded-3xl p-6 border border-white/10 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all"></div>
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">Precisa de ajuda?</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-3">
                    Nossa equipe está pronta para te atender no Discord 24 horas por dia.
                  </p>
                  <a href="https://discord.gg/CXYS4my5YX" target="_blank" rel="noopener noreferrer" className="text-red-400 text-xs font-semibold hover:text-red-300 flex items-center gap-1 transition-colors">
                    Acessar Suporte <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Coluna Direita - Informações Detalhadas */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Stats / Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/40 border border-white/10 rounded-3xl p-5 flex flex-col justify-center items-center text-center">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-white font-bold text-xl">0</span>
                <span className="text-zinc-500 text-xs font-medium uppercase mt-1">Pedidos Feitos</span>
              </div>
              <div className="bg-black/40 border border-white/10 rounded-3xl p-5 flex flex-col justify-center items-center text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-white font-bold text-xl">Ativo</span>
                <span className="text-zinc-500 text-xs font-medium uppercase mt-1">Status da Conta</span>
              </div>
              <div className="bg-black/40 border border-white/10 rounded-3xl p-5 flex flex-col justify-center items-center text-center col-span-2 md:col-span-2 relative overflow-hidden group cursor-pointer hover:border-red-500/30 transition-colors">
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-red-600/10 to-transparent"></div>
                <div className="relative z-10 flex items-center gap-4 text-left w-full">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base">Seja Membro VIP</h4>
                    <p className="text-zinc-400 text-xs mt-0.5">Desbloqueie benefícios exclusivos e descontos.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Pessoais */}
            <div className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-lg">Informações Pessoais</h3>
                <Link href="/perfil/configuracoes" className="text-zinc-400 hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                </Link>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Nome Completo</label>
                    <div className="text-white text-sm font-medium bg-white/5 border border-white/5 rounded-xl px-4 py-3">
                      {user.name}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">E-mail</label>
                    <div className="text-zinc-300 text-sm bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex justify-between items-center">
                      {user.email}
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Senha de Acesso</label>
                  <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-4 py-3">
                    <span className="text-zinc-400 text-sm tracking-widest">••••••••••••</span>
                    <Link href="/perfil/configuracoes" className="text-red-400 text-xs font-semibold hover:text-red-300 transition-colors">
                      Alterar Senha
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Atividade Recente (Placeholder) */}
            <div className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8">
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" /> Atividade Recente
              </h3>
              
              <div className="relative pl-6 border-l border-white/10 space-y-8 before:absolute before:top-0 before:bottom-0 before:left-[11px] before:w-px before:bg-gradient-to-b before:from-red-600/50 before:to-transparent">
                
                <div className="relative">
                  <div className="absolute -left-[30px] top-1 w-3 h-3 bg-red-600 rounded-full ring-4 ring-black"></div>
                  <p className="text-sm font-medium text-white">Conta criada com sucesso</p>
                  <p className="text-xs text-zinc-500 mt-1">Bem-vindo à REV SYSTEM. Sua jornada começa aqui.</p>
                  <span className="text-[10px] text-zinc-600 mt-2 block font-medium uppercase tracking-wider">
                    {joinDate}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
