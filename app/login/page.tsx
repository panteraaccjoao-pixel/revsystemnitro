"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

type Step = "form" | "verify"

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaReadyLogin: () => void
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="p-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Entre na sua conta
            </h1>
            <p className="mt-2 text-muted-foreground">
              Digite seu email e senha para acessar o REV SYSTEM
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
            {error && (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex h-12 w-full rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none text-foreground">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex h-12 w-full rounded-lg border border-border bg-secondary px-4 py-2 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 pointer-events-none" />
                  ) : (
                    <Eye className="h-5 w-5 pointer-events-none" />
                  )}
                </button>
              </div>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <div ref={recaptchaRef} />
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-primary to-orange-400 text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link
              href="/cadastro"
              className="text-foreground underline underline-offset-2 hover:text-foreground/80"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
