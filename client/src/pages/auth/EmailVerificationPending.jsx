import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, RefreshCw, ArrowLeft, CheckCircle } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

export default function EmailVerificationPending() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }
    setResending(true);
    setError("");
    try {
      await axiosInstance.post("/auth/resend-verification", { email });
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      display: "flex",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Left branding strip */}
      <div style={{
        width: "42px",
        background: "linear-gradient(180deg, #1e3a8a, #2563eb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <span style={{
          color: "white", fontWeight: "800", fontSize: "0.75rem",
          letterSpacing: "0.15em", writingMode: "vertical-rl",
          textTransform: "uppercase", opacity: 0.7,
        }}>MediCare</span>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{ width: "100%", maxWidth: "440px", textAlign: "center" }}>

          {/* Icon */}
          <div style={{
            width: "72px", height: "72px",
            backgroundColor: "#eff6ff",
            border: "2px solid #bfdbfe",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <Mail size={32} color="#2563eb" />
          </div>

          <h1 style={{
            fontSize: "1.6rem", fontWeight: "800",
            color: "#0f172a", marginBottom: "10px",
          }}>
            Check your inbox
          </h1>

          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "6px" }}>
            We sent a verification link to
          </p>

          {email && (
            <p style={{
              color: "#2563eb", fontSize: "0.95rem",
              fontWeight: "700", marginBottom: "20px",
              wordBreak: "break-all",
            }}>
              {email}
            </p>
          )}

          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "32px" }}>
            Click the link in the email to verify your account. The link expires in 24 hours.
          </p>

          {/* Success banner */}
          {resent && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              justifyContent: "center",
              backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: "10px", padding: "12px 16px",
              marginBottom: "16px", color: "#16a34a", fontSize: "0.875rem",
            }}>
              <CheckCircle size={16} />
              Verification email resent successfully!
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div style={{
              backgroundColor: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "10px", padding: "12px 16px",
              marginBottom: "16px", color: "#dc2626", fontSize: "0.875rem",
            }}>
              {error}
            </div>
          )}

          {/* Resend button */}
          <button
            onClick={handleResend}
            disabled={resending}
            style={{
              width: "100%", padding: "13px",
              backgroundColor: resending ? "#93c5fd" : "#2563eb",
              color: "#fff", border: "none",
              borderRadius: "12px", fontSize: "0.95rem",
              fontWeight: "600", cursor: resending ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "8px",
              marginBottom: "12px",
              boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              transition: "background-color 0.2s",
            }}
          >
            <RefreshCw size={16} style={{ animation: resending ? "spin 1s linear infinite" : "none" }} />
            {resending ? "Resending..." : "Resend verification email"}
          </button>

          {/* Back to login */}
          <button
            onClick={() => navigate("/login")}
            style={{
              width: "100%", padding: "13px",
              backgroundColor: "transparent", color: "#64748b",
              border: "1px solid #e2e8f0", borderRadius: "12px",
              fontSize: "0.95rem", fontWeight: "500",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>

        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}