"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronDown,
  Crown,
  HeadphonesIcon,
} from "lucide-react"

interface UserData {
  id: string
  email: string
  name: string
}

export function UserMenu() {
  const [user, setUser] = useState<UserData | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Fechar ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" })
    setUser(null)
    setOpen(false)
    router.push("/")
    router.refresh()
  }

  if (loading) return null

  // Não logado → mostrar Entrar + Cadastro
  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
        >
          Entrar
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-xl bg-[#e60000] hover:bg-[#ff0000] text-white h-10 px-5 text-sm font-bold transition-all duration-300 shadow-[0_0_20px_rgba(230,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] hover:scale-[1.02] active:scale-[0.98]"
        >
          Cadastro
        </Link>
      </div>
    )
  }

  // Logado → bolinha com inicial + dropdown
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 group"
        aria-label="Menu do usuário"
      >
        {/* Avatar bolinha */}
        <div className="relative">
          <div className="absolute inset-0 bg-red-600/30 rounded-full blur-md group-hover:bg-red-600/50 transition-all duration-300" />
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-800 border border-red-500/40 flex items-center justify-center text-white text-sm font-bold shadow-[0_0_12px_rgba(220,38,38,0.4)] group-hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-300">
            {initials}
          </div>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-white/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+12px)] w-64 rounded-2xl overflow-hidden z-[200]"
          style={{
            background: "rgba(10,10,10,0.95)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(220,38,38,0.1)",
          }}
        >
          {/* Cabeçalho do dropdown */}
          <div className="px-4 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 border border-red-500/40 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                <p className="text-zinc-500 text-xs truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Itens do menu */}
          <div className="py-2">
            <Link
              href="/perfil"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors group"
            >
              <User className="h-4 w-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
              Meu Perfil
            </Link>
            <Link
              href="/pedidos"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors group"
            >
              <ShoppingBag className="h-4 w-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
              Meus Pedidos
            </Link>
            <Link
              href="/membros"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors group"
            >
              <Crown className="h-4 w-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
              Membros
            </Link>
            <a
              href="https://discord.gg/CXYS4my5YX"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors group"
            >
              <HeadphonesIcon className="h-4 w-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
              Suporte
            </a>
            <Link
              href="/perfil/configuracoes"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors group"
            >
              <Settings className="h-4 w-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
              Configurações
            </Link>
          </div>

          {/* Sair */}
          <div className="border-t border-white/5 py-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors group"
            >
              <LogOut className="h-4 w-4 transition-colors" />
              Sair da conta
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
