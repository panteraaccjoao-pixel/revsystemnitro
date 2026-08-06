"use client";
import { useState, useEffect, useRef } from "react";
import { Droplet, Eye, EyeOff } from "lucide-react";

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoadLogin: () => void;
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);

    // Carregar script do Google reCAPTCHA v2
    if (!document.getElementById("recaptcha-script-login")) {
      window.onRecaptchaLoadLogin = () => {
        if (recaptchaRef.current && widgetIdRef.current === null) {
          try {
            widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
              sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6Ld_e7AqAAAAAHQvS46C_x1G2QhZ04Q7dZt0y_9e",
              theme: "dark",
            });
          } catch (e) {
            console.error("Erro ao renderizar reCAPTCHA:", e);
          }
        }
      };
      const script = document.createElement("script");
      script.id = "recaptcha-script-login";
      script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoadLogin&render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.grecaptcha && recaptchaRef.current && widgetIdRef.current === null) {
      try {
        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6Ld_e7AqAAAAAHQvS46C_x1G2QhZ04Q7dZt0y_9e",
          theme: "dark",
        });
      } catch (e) {
        console.error("Erro ao renderizar reCAPTCHA:", e);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Verificar Captcha
    let captchaToken = "";
    if (window.grecaptcha && widgetIdRef.current !== null) {
      captchaToken = window.grecaptcha.getResponse(widgetIdRef.current);
    }
    if (!captchaToken) {
      setError("Por favor, valide o captcha de segurança (Não sou um robô).");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password, captchaToken }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Erro ao fazer login. Tente novamente.");
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
      } else {
        // Armazenar sessão
        if (data.session?.access_token) {
          localStorage.setItem("sb-access-token", data.session.access_token);
          localStorage.setItem("sb-refresh-token", data.session.refresh_token || "");
        }
        window.location.href = "/produtos";
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15),transparent_50%)] bg-no-repeat flex flex-col items-center justify-center p-4">
      {/* Botão voltar */}
      <button
        onClick={() => (window.location.href = "/")}
        className="fixed top-6 right-6 flex items-center justify-center w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <Droplet className="w-5 h-5 text-red-500 fill-red-500" />
      </button>

      <div className="w-full max-w-[420px] space-y-6">
        {/* Logo superior */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2">
            <Droplet className="w-8 h-8 text-red-500 fill-red-500" />
            <span className="text-2xl font-black text-white tracking-wider uppercase">REV SYSTEM</span>
          </div>
          <p className="text-sm text-zinc-400">Insira suas credenciais para entrar na plataforma</p>
        </div>

        {/* Card Form */}
        <div className="bg-[#0b0b0d]/70 border border-white/[0.05] rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo E-mail */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full h-12 px-4 rounded-xl bg-[#111113] border border-white/[0.07] text-white text-sm outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
              />
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Senha</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-12 pl-4 pr-12 rounded-xl bg-[#111113] border border-white/[0.07] text-white text-sm outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Google reCAPTCHA v2 */}
            <div className="flex justify-center py-2">
              <div ref={recaptchaRef} />
            </div>

            {/* Caixa de Erro */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl px-4 py-3 leading-relaxed">
                {error}
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-sm rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.25)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Switch Register */}
          <div className="text-center mt-6">
            <p className="text-xs text-zinc-500">
              Não possui uma conta?{" "}
              <a href="/cadastro" className="text-red-500 hover:text-red-400 font-bold transition-colors">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
