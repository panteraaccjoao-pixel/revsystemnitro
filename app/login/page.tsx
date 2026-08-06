"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Star } from "lucide-react"

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaReadyLogin: () => void
  }
}

const reviews = [
  {
    name: "Gabriel Matos",
    role: "Cliente verificado",
    avatar: "GM",
    text: "\"Comprei Robux e o código chegou na hora. Nunca precisei nem abrir ticket. REV SYSTEM é a melhor loja que já usei!\"",
    stars: 5,
  },
  {
    name: "Lucas Pereira",
    role: "Cliente verificado",
    avatar: "LP",
    text: "\"Comprei Nitro pra mim e pra minha namorada, os dois chegaram em menos de 2 minutos. Suporte via Discord é nota 10!\"",
    stars: 5,
  },
  {
    name: "Beatriz Souza",
    role: "Cliente verificada",
    avatar: "BS",
    text: "\"Já comprei mais de 10 vezes aqui. Entrega automática, site seguro e preços ótimos. Recomendo a todo mundo.\"",
    stars: 5,
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)

  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  // Rotacionar avaliações
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((i) => (i + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Carregar reCAPTCHA
  useEffect(() => {
    const renderWidget = () => {
      if (recaptchaRef.current && widgetIdRef.current === null && window.grecaptcha) {
        try {
          widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
            theme: "dark",
          })
        } catch {}
      }
    }
    if (!document.getElementById("rc-script-login")) {
      window.onRecaptchaReadyLogin = renderWidget
      const s = document.createElement("script")
      s.id = "rc-script-login"
      s.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaReadyLogin&render=explicit"
      s.async = true
      s.defer = true
      document.head.appendChild(s)
    } else {
      renderWidget()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const captchaToken =
      window.grecaptcha && widgetIdRef.current !== null
        ? window.grecaptcha.getResponse(widgetIdRef.current)
        : ""

    if (!captchaToken) {
      setError("Por favor, marque o captcha (Não sou um robô).")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password, captchaToken }),
      })
      const result = await res.json()

      if (!res.ok || result.error) {
        setError(result.error || "E-mail ou senha incorretos.")
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current)
        }
        return
      }

      window.location.href = "/produtos"
    } catch {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const review = reviews[reviewIndex]

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="px-8 py-5 flex items-center gap-3">
        <Image src="/icon.png" alt="REV SYSTEM" width={32} height={32} className="rounded-md" />
        <span className="text-white font-bold text-base tracking-wide">REV SYSTEM</span>
      </header>

      {/* ── Main split layout ───────────────────────────────────────────────── */}
      <main className="flex flex-1 min-h-0">

        {/* ── LEFT: Login form ────────────────────────────────────────────── */}
        <div className="flex flex-1 items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">
            <h1 className="text-white text-2xl font-bold mb-1">Bem-vindo de volta</h1>
            <p className="text-zinc-400 text-sm mb-8">Entre para acessar sua conta</p>

            <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
              {error && (
                <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <input
                  id="email"
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-11 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder:text-zinc-500 text-sm px-4 outline-none focus:border-red-700/60 transition-colors"
                />
              </div>

              {/* Senha */}
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-11 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder:text-zinc-500 text-sm px-4 pr-20 outline-none focus:border-red-700/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs transition-colors flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPassword ? "" : "Mostrar"}
                </button>
              </div>

              <div className="flex justify-end">
                <Link href="/recuperar-senha" className="text-red-500 text-xs hover:text-red-400 transition-colors">
                  Esqueceu a senha?
                </Link>
              </div>

              {/* reCAPTCHA */}
              <div>
                <p className="text-zinc-500 text-xs mb-2">Verificação de segurança</p>
                <div ref={recaptchaRef} />
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-md bg-red-700 hover:bg-red-600 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  <>Entrar →</>
                )}
              </button>

              {/* Divisor Discord */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-[#2a2a2a]" />
                <span className="text-zinc-500 text-xs">ou continue com</span>
                <div className="flex-1 h-px bg-[#2a2a2a]" />
              </div>

              {/* Botão Discord */}
              <button
                type="button"
                onClick={() => window.location.href = "/api/auth/discord"}
                className="w-full h-11 rounded-md border border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#5865F2]/10 hover:border-[#5865F2]/40 text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-3"
              >
                {/* Discord icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.024.015.046.032.06a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.026c.462-.63.874-1.295 1.226-1.994a.075.075 0 0 0-.041-.104 13.12 13.12 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Discord
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Não tem conta?{" "}
              <Link href="/cadastro" className="text-red-500 font-medium hover:text-red-400 transition-colors">
                Criar agora
              </Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT: Marketing panel ─────────────────────────────────────── */}
        <div className="hidden lg:flex flex-1 flex-col justify-center px-16 py-12 bg-[#0d0d0d] border-l border-[#1a1a1a]">
          <div className="max-w-md">
            <h2 className="text-white text-3xl font-bold leading-tight mb-3">
              A melhor loja de{" "}
              <span className="text-red-500">Produtos<br />Digitais</span>
            </h2>
            <p className="text-zinc-400 text-sm mb-10">
              Robux, membros Discord, Nitro e muito mais com entrega automática.
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-red-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Entregas Instantâneas</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Automação completa em poucos minutos.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-emerald-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">100% Seguro</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Pagamentos protegidos via Pix.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-blue-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Suporte 24h</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Atendimento via Discord.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-purple-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">+5 Anos</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Experiência no mercado.</p>
                </div>
              </div>
            </div>

            {/* Review card */}
            <div className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-5 transition-all duration-500">
              {/* Estrelas */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-red-500 text-red-500" />
                ))}
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed mb-4">{review.text}</p>

              <div className="flex items-center gap-3">
                {/* Avatar com inicial */}
                <div className="h-9 w-9 rounded-full bg-red-700/30 border border-red-700/40 flex items-center justify-center text-red-400 text-xs font-bold flex-shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{review.name}</p>
                  <p className="text-zinc-500 text-xs">{review.role}</p>
                </div>
                {/* Indicador verificado */}
                <div className="ml-auto">
                  <span className="text-emerald-400 text-xs flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    Verificado
                  </span>
                </div>
              </div>

              {/* Indicadores de paginação */}
              <div className="flex gap-1.5 mt-4 justify-center">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === reviewIndex ? "bg-red-500 w-5" : "bg-[#2a2a2a] w-1.5"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="px-8 py-4 border-t border-[#1a1a1a]">
        <p className="text-zinc-600 text-xs">© 2026 REV SYSTEM • Todos os direitos reservados</p>
      </footer>
    </div>
  )
}
