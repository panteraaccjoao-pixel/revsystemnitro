"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Star, CheckCircle2 } from "lucide-react"

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaReadyCadastro: () => void
  }
}

export default function CadastroPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [captchaToken, setCaptchaToken] = useState("")
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [loadingSend, setLoadingSend] = useState(false)
  const [loadingCreate, setLoadingCreate] = useState(false)

  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  const isFormValid =
    email.trim() !== "" &&
    password.length >= 6 &&
    password === confirmPassword

  // ── Carregar reCAPTCHA ────────────────────────────────────────────────────
  useEffect(() => {
    const renderWidget = () => {
      if (recaptchaRef.current && widgetIdRef.current === null && window.grecaptcha) {
        try {
          widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
            theme: "dark",
            callback: (token: string) => setCaptchaToken(token),
            "expired-callback": () => setCaptchaToken(""),
          })
        } catch {}
      }
    }
    if (!document.getElementById("rc-script-cadastro")) {
      window.onRecaptchaReadyCadastro = renderWidget
      const s = document.createElement("script")
      s.id = "rc-script-cadastro"
      s.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaReadyCadastro&render=explicit"
      s.async = true
      s.defer = true
      document.head.appendChild(s)
    } else {
      renderWidget()
    }
  }, [])

  // ── Cooldown de reenvio ───────────────────────────────────────────────────
  const startCooldown = () => {
    setResendCooldown(60)
    const interval = setInterval(() => {
      setResendCooldown((v) => {
        if (v <= 1) { clearInterval(interval); return 0 }
        return v - 1
      })
    }, 1000)
  }

  // ── Enviar código via Resend ──────────────────────────────────────────────
  const handleSendCode = async () => {
    setError("")
    setSuccessMsg("")

    if (!isFormValid) {
      setError("Preencha todos os campos corretamente antes de enviar o código.")
      return
    }

    const token = captchaToken || (
      window.grecaptcha && widgetIdRef.current !== null
        ? window.grecaptcha.getResponse(widgetIdRef.current)
        : ""
    )

    if (!token) {
      setError("Por favor, marque o captcha (Não sou um robô).")
      return
    }

    setLoadingSend(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          captchaToken: token,
        }),
      })
      const result = await res.json()
      if (!res.ok || result.error) {
        setError(result.error || "Erro ao enviar código. Tente novamente.")
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current)
          setCaptchaToken("")
        }
        return
      }
      setCodeSent(true)
      startCooldown()
      setSuccessMsg(`Código enviado para ${email}. Verifique sua caixa de entrada.`)
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoadingSend(false)
    }
  }

  // ── Criar conta (verificar código) ────────────────────────────────────────
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMsg("")

    if (!codeSent) {
      setError("Clique em \"Enviar código\" primeiro para receber o código no seu e-mail.")
      return
    }

    if (verificationCode.replace(/\D/g, "").length < 6) {
      setError("Digite o código de 6 dígitos enviado para o seu e-mail.")
      return
    }

    setLoadingCreate(true)
    try {
      const res = await fetch("/api/register/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          code: verificationCode.replace(/\D/g, ""),
        }),
      })
      const result = await res.json()
      if (!res.ok || result.error) {
        setError(result.error || "Código inválido ou expirado.")
        return
      }

      // Login automático após cadastro
      try {
        const loginRes = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        })
        if (loginRes.ok) {
          window.location.href = "/produtos"
          return
        }
      } catch {}
      window.location.href = "/login?registered=true"
    } catch {
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setLoadingCreate(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="px-8 py-5 flex items-center gap-3">
        <Image src="/icon.png" alt="REV SYSTEM" width={32} height={32} className="rounded-md" />
        <span className="text-white font-bold text-base tracking-wide">REV SYSTEM</span>
      </header>

      {/* ── Main split layout ──────────────────────────────────────────────── */}
      <main className="flex flex-1 min-h-0">

        {/* ── LEFT: Formulário ─────────────────────────────────────────────── */}
        <div className="flex flex-1 items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">
            <h1 className="text-white text-2xl font-bold mb-1">Criar conta</h1>
            <p className="text-zinc-400 text-sm mb-8">
              Comece a <span className="text-red-500 font-medium">comprar</span> em poucos segundos
            </p>

            <form onSubmit={handleCreateAccount} className="space-y-4" suppressHydrationWarning>
              {error && (
                <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-400 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  {successMsg}
                </div>
              )}

              {/* E-mail */}
              <input
                id="email"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder:text-zinc-500 text-sm px-4 outline-none focus:border-red-700/60 transition-colors"
              />

              {/* Senha */}
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-11 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder:text-zinc-500 text-sm px-4 pr-24 outline-none focus:border-red-700/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs transition-colors flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              {/* Confirmar senha */}
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmar senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full h-11 rounded-md bg-[#1a1a1a] border text-white placeholder:text-zinc-500 text-sm px-4 pr-24 outline-none transition-colors ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-700/60"
                      : "border-[#2a2a2a] focus:border-red-700/60"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs transition-colors flex items-center gap-1"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showConfirmPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-400 -mt-2">As senhas não coincidem</p>
              )}

              {/* reCAPTCHA */}
              <div>
                <p className="text-zinc-500 text-xs mb-2">Verificação de segurança</p>
                <div ref={recaptchaRef} />
              </div>

              {/* Código + botão Enviar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Código de verificação"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 h-11 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder:text-zinc-500 text-sm px-4 outline-none focus:border-red-700/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={loadingSend || !isFormValid || !captchaToken || resendCooldown > 0}
                  className="h-11 px-4 rounded-md bg-[#1a1a1a] border border-red-700/60 text-red-400 text-sm font-medium hover:bg-red-700/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loadingSend
                    ? "Enviando..."
                    : resendCooldown > 0
                    ? `${resendCooldown}s`
                    : "Enviar código"}
                </button>
              </div>

              {/* Botão Criar conta */}
              <button
                type="submit"
                disabled={loadingCreate || !codeSent || verificationCode.length < 6}
                className="w-full h-11 rounded-md bg-red-700 hover:bg-red-600 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingCreate ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Criando conta...
                  </span>
                ) : (
                  <>Criar conta →</>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-red-500 font-medium hover:text-red-400 transition-colors">
                Entrar
              </Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT: Marketing panel ────────────────────────────────────────── */}
        <div className="hidden lg:flex flex-1 flex-col justify-center px-16 py-12 bg-[#0d0d0d] border-l border-[#1a1a1a]">
          <div className="max-w-md">
            <h2 className="text-white text-3xl font-bold leading-tight mb-3">
              Junte-se a milhares de{" "}
              <span className="text-red-500">clientes satisfeitos</span>
            </h2>
            <p className="text-zinc-400 text-sm mb-8">
              Crie sua conta e tenha acesso a todos os nossos produtos e serviços.
            </p>

            {/* Lista de benefícios */}
            <ul className="space-y-3 mb-10">
              {[
                "Histórico de pedidos completo",
                "Entregas automáticas e rápidas",
                "Suporte prioritário via Discord",
                "Acesso a promoções exclusivas",
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-6">
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
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="px-8 py-4 border-t border-[#1a1a1a]">
        <p className="text-zinc-600 text-xs">© 2026 REV SYSTEM • Todos os direitos reservados</p>
      </footer>
    </div>
  )
}
