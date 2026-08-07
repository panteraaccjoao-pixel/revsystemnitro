"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Settings, Save, Shield, Key } from "lucide-react"

export default function ConfiguracoesPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // Simulate save
    setTimeout(() => {
      setSaving(false)
      setMessage("Configurações salvas com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-[72px] flex flex-col items-center justify-center gap-3">
        <svg className="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-[72px]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header da página */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/perfil"
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
            <Settings className="h-6 w-6 text-zinc-400" />
            Configurações
          </h1>
        </div>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center justify-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Informações Pessoais */}
          <div
            className="rounded-2xl p-6 space-y-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h3 className="text-white font-semibold flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
              Informações Pessoais
            </h3>

            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Nome</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-white text-sm focus:border-red-500/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1.5 block">E-mail</label>
              <input
                type="email"
                defaultValue={user?.email}
                disabled
                className="w-full h-11 bg-black/50 border border-white/5 rounded-xl px-4 text-zinc-500 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-zinc-600 mt-1.5 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                O e-mail não pode ser alterado por motivos de segurança.
              </p>
            </div>
          </div>

          {/* Segurança */}
          <div
            className="rounded-2xl p-6 space-y-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h3 className="text-white font-semibold flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
              <Key className="w-4 h-4 text-zinc-400" />
              Segurança
            </h3>

            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Nova Senha</label>
              <input
                type="password"
                placeholder="Deixe em branco para não alterar"
                className="w-full h-11 bg-black/50 border border-white/10 rounded-xl px-4 text-white text-sm focus:border-red-500/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
