"use client";
import { useState, useEffect, useRef } from "react";
import { Droplet, ArrowRight, ShieldCheck, Mail, Lock } from "lucide-react";

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

    // Carregar script do Google reCAPTCHA v2
    if (!document.getElementById("recaptcha-script-cadastro")) {
      window.onRecaptchaLoadCadastro = () => {
        if (recaptchaRef.current && widgetIdRef.current === null) {
          try {
            widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
              sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6Ld_e7AqAAAAAHQvS46C_x1G2QhZ04Q7dZt0y_9e", // Usa chave padrão se ausente
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
        // Fazer login automático pós-cadastro
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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px 12px 40px",
    background: "#0d0d0f",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050505",
        backgroundImage: "radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.12), transparent 55%)",
        backgroundAttachment: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "20px",
      }}
    >
      {/* Back button */}
      <button
        onClick={() => (window.location.href = "/")}
        style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
      >
        <Droplet style={{ width: "20px", height: "20px", color: "#ef4444", fill: "#ef4444" }} />
      </button>

      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Droplet style={{ width: "32px", height: "32px", color: "#ef4444", fill: "#ef4444" }} />
            <span style={{ fontSize: "24px", fontWeight: 900, color: "#fff", letterSpacing: "1px" }}>REV SYSTEM</span>
          </div>
          <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0 }}>
            {step === "form" ? "Insira seus dados para começar" : "Confirme seu código de ativação"}
          </p>
        </div>

        {/* Card Form */}
        <div
          style={{
            background: "rgba(10,10,12,0.75)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "24px",
            padding: "36px",
            backdropFilter: "blur(24px)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          }}
        >
          {step === "form" ? (
            <form onSubmit={handleSendCode}>
              {/* E-mail */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", color: "#a1a1aa", fontSize: "13px", marginBottom: "6px", fontWeight: 500 }}>
                  E-mail
                </label>
                <div style={{ position: "relative" }}>
                  <Mail style={{ position: "absolute", left: "14px", top: "13px", width: "16px", height: "16px", color: "#71717a" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(239,68,68,0.4)";
                      e.target.style.boxShadow = "0 0 15px rgba(239,68,68,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.06)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", color: "#a1a1aa", fontSize: "13px", marginBottom: "6px", fontWeight: 500 }}>
                  Senha
                </label>
                <div style={{ position: "relative" }}>
                  <Lock style={{ position: "absolute", left: "14px", top: "13px", width: "16px", height: "16px", color: "#71717a" }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Senha forte (mín. 6 caracteres)"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(239,68,68,0.4)";
                      e.target.style.boxShadow = "0 0 15px rgba(239,68,68,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.06)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: "22px" }}>
                <label style={{ display: "block", color: "#a1a1aa", fontSize: "13px", marginBottom: "6px", fontWeight: 500 }}>
                  Confirmar Senha
                </label>
                <div style={{ position: "relative" }}>
                  <Lock style={{ position: "absolute", left: "14px", top: "13px", width: "16px", height: "16px", color: "#71717a" }} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirme sua senha"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(239,68,68,0.4)";
                      e.target.style.boxShadow = "0 0 15px rgba(239,68,68,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.06)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Google reCAPTCHA v2 Widget */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                <div ref={recaptchaRef} />
              </div>

              {/* Error Box */}
              {error && (
                <div
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    color: "#ef4444",
                    fontSize: "13px",
                    marginBottom: "20px",
                    lineHeight: "1.4",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Button Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: loading ? "#7f1d1d" : "linear-gradient(135deg, #ef4444, #b91c1c)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 20px rgba(239,68,68,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {loading ? "Processando..." : "Enviar Código"}
                <ArrowRight style={{ width: "16px", height: "16px" }} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <ShieldCheck style={{ width: "42px", height: "42px", color: "#22c55e", margin: "0 auto 12px" }} />
                <p style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  Insira o código de 6 dígitos enviado para:<br />
                  <strong style={{ color: "#fff" }}>{email}</strong>
                </p>
              </div>

              {/* OTP Field */}
              <div style={{ marginBottom: "24px" }}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  placeholder="000000"
                  maxLength={6}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#0d0d0f",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px",
                    color: "#ef4444",
                    fontSize: "28px",
                    fontWeight: 900,
                    textAlign: "center",
                    letterSpacing: "8px",
                    fontFamily: "monospace",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(239,68,68,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.06)")}
                />
              </div>

              {/* Status Messages */}
              {error && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", padding: "12px 16px", color: "#ef4444", fontSize: "13px", marginBottom: "20px" }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "10px", padding: "12px 16px", color: "#22c55e", fontSize: "13px", marginBottom: "20px" }}>
                  {success}
                </div>
              )}

              {/* Submit OTP */}
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: (loading || otp.length < 6) ? "#7f1d1d" : "linear-gradient(135deg, #ef4444, #b91c1c)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: (loading || otp.length < 6) ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 20px rgba(239,68,68,0.25)",
                }}
              >
                {loading ? "Confirmando..." : "Confirmar e Cadastrar"}
              </button>

              {/* Back to Form */}
              <button
                type="button"
                onClick={() => { setStep("form"); setError(""); setOtp(""); }}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "transparent",
                  border: "none",
                  color: "#71717a",
                  fontSize: "13px",
                  cursor: "pointer",
                  marginTop: "16px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a1a1aa")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#71717a")}
              >
                ← Digitar outro e-mail
              </button>
            </form>
          )}

          {/* Form Switch */}
          {step === "form" && (
            <p style={{ textAlign: "center", color: "#71717a", fontSize: "13px", marginTop: "24px", marginBottom: 0 }}>
              Já possui uma conta?{" "}
              <a href="/login" style={{ color: "#ef4444", textDecoration: "none", fontWeight: 600 }}>
                Entrar
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
