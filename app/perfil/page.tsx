"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Mail, Calendar, ShieldCheck, ShoppingBag } from "lucide-react"

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
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header da página */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <h1 className="text-white text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-red-500" />
            Meu Perfil
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card Principal - Avatar e Info */}
          <div
            className="md:col-span-1 rounded-2xl p-6 flex flex-col items-center text-center"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-xl" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-900 border-2 border-red-500/30 flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                {initials}
              </div>
            </div>
            <h2 className="text-white font-bold text-xl mb-1">{user.name}</h2>
            <p className="text-zinc-500 text-sm mb-4">Membro desde {joinDate}</p>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-red-400 bg-red-400/10 border border-red-400/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Conta Verificada
            </span>
          </div>

          {/* Card Detalhes */}
          <div
            className="md:col-span-2 rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              Detalhes da Conta
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Nome Completo
                </label>
                <div className="text-white text-sm bg-black/40 px-4 py-3 rounded-xl border border-white/5">
                  {user.name}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  E-mail
                </label>
                <div className="text-white text-sm bg-black/40 px-4 py-3 rounded-xl border border-white/5">
                  {user.email}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-4">
                <Link
                  href="/perfil/configuracoes"
                  className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all border border-white/10"
                >
                  Editar Dados
                </Link>
                <Link
                  href="/pedidos"
                  className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Ver Pedidos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
