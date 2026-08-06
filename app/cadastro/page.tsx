"use client";
import { useState, useEffect, useRef } from "react";
import { Droplet, ShieldCheck } from "lucide-react";

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoadCadastro: () => void;
  }
}

type Step = "form" | "otp";

export default function Cadastro() {
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);

  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);

    if (step === "form") {
      // Carregar script do Google reCAPTCHA v2
      if (!document.getElementById("recaptcha-script-cadastro")) {
        window.onRecaptchaLoadCadastro = () => {
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
        script.id = "recaptcha-script-cadastro";
        script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoadCadastro&render=explicit";
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
    }
  }, [step]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    // Verificar Captcha
    let captchaToken = "";
    if (window.grecaptcha && widgetIdRef.current !== null) {
      captchaToken = window.grecaptcha.getResponse(widgetIdRef.current);
    }
    if (!captchaToken) {
      setError("Por favor, valide o captcha de segurança (Não sou um robô).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captchaToken }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Erro ao iniciar cadastro. Tente novamente.");
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
      } else {
        setStep("otp");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, code: otp }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Código incorreto ou expirado.");
      } else {
        setSuccess("Conta criada com sucesso! Fazendo login...");
        
        // Login automático pós-cadastro
        try {
          const loginRes = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          if (loginRes.ok) {
            const loginData = await loginRes.json();
            if (loginData.session?.access_token) {
              localStorage.setItem("sb-access-token", loginData.session.access_token);
              localStorage.setItem("sb-refresh-token", loginData.session.refresh_token || "");
            }
            window.location.href = "/produtos";
            return;
          }
        } catch (loginErr) {
          console.error("Erro no login automático:", loginErr);
        }
        setTimeout(() => {
          window.location.href = "/login?registered=true";
        }, 1500);
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
          <p className="text-sm text-zinc-400">
            {step === "form" ? "Crie sua conta na plataforma" : "Confirme seu e-mail"}
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#0b0b0d]/70 border border-white/[0.05] rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {step === "form" ? (
            <form onSubmit={handleSendCode} className="space-y-5">
              {/* E-mail */}
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

              {/* Senha */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Mínimo de 6 caracteres"
                  className="w-full h-12 px-4 rounded-xl bg-[#111113] border border-white/[0.07] text-white text-sm outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                />
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Confirmar Senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repita sua senha"
                  className="w-full h-12 px-4 rounded-xl bg-[#111113] border border-white/[0.07] text-white text-sm outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                />
              </div>

              {/* Google reCAPTCHA v2 */}
              <div className="flex justify-center py-2">
                <div ref={recaptchaRef} />
              </div>

              {/* Erro */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl px-4 py-3 leading-relaxed">
                  {error}
                </div>
              )}

              {/* Botão Enviar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-sm rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.25)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? "Processando..." : "Enviar Código"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center space-y-2">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Código de 6 dígitos enviado para:<br />
                  <strong className="text-white">{email}</strong>
                </p>
              </div>

              {/* Input OTP */}
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  placeholder="000000"
                  maxLength={6}
                  className="w-full h-14 bg-[#111113] border border-white/[0.07] rounded-xl text-center text-3xl font-black text-red-500 tracking-[8px] outline-none transition-all duration-200 focus:border-red-500/50"
                />
              </div>

              {/* Mensagens de erro/sucesso */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm rounded-xl px-4 py-3">
                  {success}
                </div>
              )}

              {/* Botão Confirmar */}
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full h-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-sm rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.25)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Confirmando..." : "Confirmar e Cadastrar"}
              </button>

              {/* Botão Voltar */}
              <button
                type="button"
                onClick={() => { setStep("form"); setError(""); setOtp(""); }}
                className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-colors pt-2 block"
              >
                ← Digitar outro e-mail
              </button>
            </form>
          )}

          {/* Switch Login */}
          {step === "form" && (
            <div className="text-center mt-6">
              <p className="text-xs text-zinc-500">
                Já possui uma conta?{" "}
                <a href="/login" className="text-red-500 hover:text-red-400 font-bold transition-colors">
                  Entrar
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
