"use client";
import { useState, useEffect } from "react";
import { Droplet } from "lucide-react";

type Step = "form" | "otp";

export default function Cadastro() {
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
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

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Erro ao iniciar cadastro. Tente novamente.");
      } else {
        setToken(data.token);
        setStep("otp");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, code: otp, token }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Código inválido ou expirado.");
      } else {
        setSuccess("Conta criada com sucesso! Redirecionando...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
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
    padding: "12px 14px",
    background: "#111113",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050505",
        backgroundImage: "radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.15), transparent 50%)",
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
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
      >
        <Droplet style={{ width: "20px", height: "20px", color: "#ef4444", fill: "#ef4444" }} />
      </button>

      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img
            src="/logo.webp"
            alt="REV SYSTEM"
            style={{ height: "48px", objectFit: "contain", marginBottom: "8px" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0 }}>
            {step === "form" ? "Crie sua conta REV SYSTEM" : "Confirme seu e-mail"}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(10,10,12,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "20px",
            padding: "32px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          {step === "form" ? (
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: "#a1a1aa", fontSize: "13px", marginBottom: "6px", fontWeight: 500 }}>
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(239,68,68,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: "#a1a1aa", fontSize: "13px", marginBottom: "6px", fontWeight: 500 }}>
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(239,68,68,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", color: "#a1a1aa", fontSize: "13px", marginBottom: "6px", fontWeight: 500 }}>
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(239,68,68,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#ef4444", fontSize: "13px", marginBottom: "16px" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: loading ? "#7f1d1d" : "linear-gradient(135deg, #ef4444, #b91c1c)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 0 20px rgba(239,68,68,0.3)",
                  letterSpacing: "0.5px",
                }}
              >
                {loading ? "Enviando código..." : "Criar Conta"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtp}>
              <p style={{ color: "#a1a1aa", fontSize: "13px", textAlign: "center", marginTop: 0, marginBottom: "24px", lineHeight: 1.6 }}>
                Enviamos um código de 6 dígitos para<br />
                <strong style={{ color: "#fff" }}>{email}</strong>
              </p>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", color: "#a1a1aa", fontSize: "13px", marginBottom: "6px", fontWeight: 500 }}>
                  Código de Confirmação
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  placeholder="000000"
                  maxLength={6}
                  style={{ ...inputStyle, textAlign: "center", fontSize: "24px", letterSpacing: "8px", fontWeight: 700 }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(239,68,68,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#ef4444", fontSize: "13px", marginBottom: "16px" }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#22c55e", fontSize: "13px", marginBottom: "16px" }}>
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: (loading || otp.length < 6) ? "#7f1d1d" : "linear-gradient(135deg, #ef4444, #b91c1c)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: (loading || otp.length < 6) ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 0 20px rgba(239,68,68,0.3)",
                  letterSpacing: "0.5px",
                }}
              >
                {loading ? "Confirmando..." : "Confirmar Código"}
              </button>

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
                  marginTop: "10px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a1a1aa")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#71717a")}
              >
                ← Voltar e usar outro e-mail
              </button>
            </form>
          )}

          {step === "form" && (
            <p style={{ textAlign: "center", color: "#71717a", fontSize: "13px", marginTop: "20px", marginBottom: 0 }}>
              Já tem conta?{" "}
              <a href="/login" style={{ color: "#ef4444", textDecoration: "none", fontWeight: 600 }}>
                Fazer login
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
