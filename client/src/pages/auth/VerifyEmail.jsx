import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle, XCircle, Loader } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (!tokenHash || type !== "email") {
        setStatus("error");
        setMessage("Invalid or missing verification link.");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "email",
      });

      if (error) {
        setStatus("error");
        setMessage(error.message || "Verification failed. The link may have expired.");
      } else {
        setStatus("success");
        await supabase.auth.signOut();
        setTimeout(() => navigate("/login", { state: { verified: true } }), 2500);
      }
    };

    verifyToken();
  }, []);

  const cardStyle = {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "48px 40px",
    maxWidth: "420px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
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
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          color: "white", fontWeight: "800", fontSize: "0.75rem",
          letterSpacing: "0.15em", writingMode: "vertical-rl",
          textTransform: "uppercase", opacity: 0.7,
        }}>MediCare</span>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, display: "flex",
        alignItems: "center", justifyContent: "center",
        padding: "2rem",
      }}>

        {/* Verifying */}
        {status === "verifying" && (
          <div style={cardStyle}>
            <Loader
              size={48} color="#2563eb"
              style={{ animation: "spin 1s linear infinite", margin: "0 auto 24px" }}
            />
            <h2 style={{ color: "#0f172a", fontSize: "1.4rem", fontWeight: "800", marginBottom: "10px" }}>
              Verifying your email...
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Please wait a moment.
            </p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div style={cardStyle}>
            <CheckCircle
              size={56} color="#16a34a"
              style={{ margin: "0 auto 24px" }}
            />
            <h2 style={{ color: "#0f172a", fontSize: "1.4rem", fontWeight: "800", marginBottom: "10px" }}>
              Email Verified!
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "8px" }}>
              Your account has been successfully verified.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
              Redirecting you to login...
            </p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div style={cardStyle}>
            <XCircle
              size={56} color="#dc2626"
              style={{ margin: "0 auto 24px" }}
            />
            <h2 style={{ color: "#0f172a", fontSize: "1.4rem", fontWeight: "800", marginBottom: "10px" }}>
              Verification Failed
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "24px" }}>
              {message}
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                width: "100%", padding: "13px",
                backgroundColor: "#2563eb", color: "#fff",
                border: "none", borderRadius: "12px",
                fontSize: "0.95rem", fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              }}
            >
              Back to Login
            </button>
          </div>
        )}

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