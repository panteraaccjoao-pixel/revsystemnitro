"use client";
import { useState, useEffect, useRef } from "react";
import { Droplet } from "lucide-react";

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    // Load reCAPTCHA script
    if (!document.getElementById("recaptcha-script")) {
      window.onRecaptchaLoad = () => {
        if (recaptchaRef.current && widgetIdRef.current === null) {
          widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
            theme: "dark",
          });
        }
      };
      const script = document.createElement("script");
      script.id = "recaptcha-script";
      script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.grecaptcha && recaptchaRef.current && widgetIdRef.current === null) {
      widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
        theme: "dark",
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let captchaToken = "";
    if (window.grecaptcha && widgetIdRef.current !== null) {
      captchaToken = window.grecaptcha.getResponse(widgetIdRef.current);
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captchaToken }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Erro ao fazer login. Tente novamente.");
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
      } else {
        // Store session token and redirect
        if (data.session?.access_token) {
          localStorage.setItem("sb-access-token", data.session.access_token);
          localStorage.setItem("sb-refresh-token", data.session.refresh_token || "");
        }
        window.location.href = "/membros";
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

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
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0 }}>
            Faça login na sua conta
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
          <form onSubmit={handleSubmit}>
            {/* Email */}
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
                style={{
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
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(239,68,68,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#a1a1aa", fontSize: "13px", marginBottom: "6px", fontWeight: 500 }}>
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
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
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(239,68,68,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            {/* reCAPTCHA */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <div ref={recaptchaRef} />
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "#ef4444",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
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
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: "center", color: "#71717a", fontSize: "13px", marginTop: "20px", marginBottom: 0 }}>
            Não tem conta?{" "}
            <a href="/cadastro" style={{ color: "#ef4444", textDecoration: "none", fontWeight: 600 }}>
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
