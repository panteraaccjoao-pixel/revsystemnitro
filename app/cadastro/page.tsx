"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, Mail, RefreshCw } from "lucide-react"

type Step = "form" | "verify"

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaReadyCadastro: () => void
  }
}

export default function CadastroPage() {
  const [step, setStep] = useState<Step>("form")

  // Step 1 — campos
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Step 2 — código de 6 dígitos
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [resendCooldown, setResendCooldown] = useState(0)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  const codeValue = code.join("")

  const isFormValid =
    email.trim() !== "" &&
    password.length >= 6 &&
    password === confirmPassword

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

  // ── Cooldown de reenvio ────────────────────────────────────────────────────
  const startResendCooldown = () => {
    setResendCooldown(60)
    const interval = setInterval(() => {
      setResendCooldown((v) => {
        if (v <= 1) { clearInterval(interval); return 0 }
        return v - 1
      })
    }, 1000)
  }

  // ── Step 1: enviar código via Resend ──────────────────────────────────────
  const handleSendCode = async (e: React.FormEvent) => {
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
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password, captchaToken }),
      })
      const result = await res.json()
      if (!res.ok || result.error) {
        setError(result.error || "Erro ao enviar código. Tente novamente.")
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current)
        }
        return
      }
      setStep("verify")
      startResendCooldown()
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // ── Reenvio de código ─────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password, captchaToken: "resend" }),
      })
      const result = await res.json()
      if (!res.ok || result.error) {
        setError(result.error || "Erro ao reenviar código.")
        return
      }
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
      startResendCooldown()
    } catch {
      setError("Erro ao reenviar código.")
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: verificar código e criar conta ────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (codeValue.length < 6) {
      setError("Digite o código de 6 dígitos.")
      return
    }
    setLoading(true)

    try {
      const res = await fetch("/api/register/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          code: codeValue,
        }),
      })
      const result = await res.json()

      if (!res.ok || result.error) {
        setError(result.error || "Código inválido.")
        return
      }

      // Login automático pós-cadastro
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
      setError("Erro ao verificar código. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // ── Handlers dos inputs de código ─────────────────────────────────────────
  const handleCodeChange = (i: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    const next = [...code]
    next[i] = digit
    setCode(next)
    if (digit && i < 5) inputRefs.current[i + 1]?.focus()
  }

  const handleCodeKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  const handleCodePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length > 0) {
      e.preventDefault()
      const next = [...code]
      pasted.split("").forEach((d, i) => { next[i] = d })
      setCode(next)
      inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="p-4">
        {step === "verify" ? (
          <button
            onClick={() => { setStep("form"); setError(""); setCode(["", "", "", "", "", ""]) }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        ) : (
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        )}
      </div>

      <main className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md space-y-8">

          {/* ── STEP 1: Formulário de cadastro ────────────────────────────── */}
          {step === "form" && (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Criar sua conta</h1>
                <p className="mt-2 text-muted-foreground">Digite seus dados para criar uma conta na REV SYSTEM</p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-5" suppressHydrationWarning>
                {error && (
                  <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none text-foreground">Email</label>
                  <input
                    id="email" type="email" placeholder="seu@email.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="flex h-12 w-full rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium leading-none text-foreground">Senha</label>
                  <div className="relative">
                    <input
                      id="password" type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="flex h-12 w-full rounded-lg border border-border bg-secondary px-4 py-2 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    />
                    <button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-5 w-5 pointer-events-none" /> : <Eye className="h-5 w-5 pointer-events-none" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium leading-none text-foreground">Confirmar senha</label>
                  <div className="relative">
                    <input
                      id="confirmPassword" type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className="flex h-12 w-full rounded-lg border border-border bg-secondary px-4 py-2 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    />
                    <button type="button" aria-label={showConfirmPassword ? "Ocultar" : "Mostrar"}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-1 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground">
                      {showConfirmPassword ? <EyeOff className="h-5 w-5 pointer-events-none" /> : <Eye className="h-5 w-5 pointer-events-none" />}
                    </button>
                  </div>
                  {confirmPassword !== "" && password !== confirmPassword && (
                    <p className="text-xs text-red-500">As senhas não coincidem</p>
                  )}
                </div>

                {/* reCAPTCHA */}
                <div className="flex justify-center">
                  <div ref={recaptchaRef} />
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-primary to-orange-400 text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? "Enviando código..." : "Enviar código de verificação"}
                </button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-foreground underline underline-offset-2 hover:text-foreground/80">
                  Fazer login
                </Link>
              </p>
            </>
          )}

          {/* ── STEP 2: Verificação do e-mail ─────────────────────────────── */}
          {step === "verify" && (
            <>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Mail className="h-8 w-8 text-foreground" />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">Verifique seu email</h1>
                <p className="mt-2 text-muted-foreground">
                  Enviamos um código de 6 dígitos para<br />
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                {error && (
                  <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                    {error}
                  </div>
                )}

                {/* 6 inputs individuais para o código */}
                <div className="flex justify-center gap-3" onPaste={handleCodePaste}>
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      className="h-14 w-12 rounded-lg border border-border bg-secondary text-center text-2xl font-bold text-foreground outline-none transition-colors focus:border-foreground"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={codeValue.length < 6 || loading}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-primary to-orange-400 text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? "Verificando..." : "Verificar e criar conta"}
                </button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Não recebeu o código?{" "}
                    {resendCooldown > 0 ? (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <RefreshCw className="h-3 w-3" />
                        Reenviar em {resendCooldown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={loading}
                        className="text-foreground underline underline-offset-2 hover:text-foreground/80"
                      >
                        Reenviar código
                      </button>
                    )}
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
