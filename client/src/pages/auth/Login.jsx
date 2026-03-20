import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { login } from "../../api/auth";
import useAuthStore from "../../store/authStore";
import { Stethoscope, Mail, Lock, ArrowRight, CheckCircle, Sun, Moon, Sparkles } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth-theme") || "dark";
    }
    return "dark";
  });

  const justVerified = location.state?.verified || false;
  const isDark = theme === "dark";

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("auth-theme", newTheme);
  };

  const colors = {
    bg: isDark ? "#030712" : "#ffffff",
    bgSubtle: isDark ? "#0f172a" : "#f8fafc",
    bgCard: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#f1f5f9" : "#0f172a",
    textSecondary: isDark ? "#94a3b8" : "#64748b",
    textMuted: isDark ? "#64748b" : "#94a3b8",
    border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    inputBg: isDark ? "#0f172a" : "#ffffff",
    inputBorder: isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(formData);
      const { token, user } = res.data.data;
      setAuth(token, user);
      if (user.role === "DOCTOR") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError("Google sign-in failed. Try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: colors.bg,
      transition: "all 0.3s ease",
    }}>
      {/* Left Panel */}
      <div style={{
        width: "48%",
        background: isDark
          ? "linear-gradient(135deg, #0c1929 0%, #0f172a 50%, #131c2e 100%)"
          : "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "4rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-20%", right: "-10%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", left: "-10%",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            onClick={() => navigate("/")}
            style={{
              display: "flex", alignItems: "center", gap: "14px",
              marginBottom: "4rem", cursor: "pointer", transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateX(4px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateX(0)"; }}
          >
            <div style={{
              width: "52px", height: "52px",
              background: isDark
                ? "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)"
                : "rgba(255,255,255,0.2)",
              borderRadius: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(14, 165, 233, 0.3)",
            }}>
              <Stethoscope size={26} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <span style={{
                color: "white", fontWeight: "800", fontSize: "1.5rem",
                letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "8px",
              }}>
                MediCare
                <Sparkles size={18} color="#0ea5e9" />
              </span>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: "2px" }}>
                Healthcare Platform
              </p>
            </div>
          </div>

          <h1 style={{
            color: "white", fontSize: "3rem", fontWeight: "900",
            lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.03em",
          }}>
            Healthcare<br />Management<br />
            <span style={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Made Simple
            </span>
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.6)", fontSize: "1.05rem",
            lineHeight: 1.8, marginBottom: "3rem", maxWidth: "380px",
          }}>
            A unified platform for doctors and patients to manage appointments, prescriptions, and medical records.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {["Manage patient records securely", "Schedule & track appointments", "Digital prescriptions & history"].map((item, index) => (
              <div key={item} style={{
                display: "flex", alignItems: "center", gap: "12px",
                animation: `fadeIn 0.5s ease-out ${index * 100}ms both`,
              }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <CheckCircle size={14} color="#10b981" />
                </div>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", fontWeight: "500" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "3rem", position: "relative",
      }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            position: "absolute", top: "2rem", right: "2rem",
            width: "44px", height: "44px", borderRadius: "12px",
            border: `1px solid ${colors.border}`,
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s ease",
          }}
        >
          {isDark ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} color="#64748b" />}
        </button>

        <div className="animate-fade-in" style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{
              fontSize: "2rem", fontWeight: "900",
              color: colors.text, marginBottom: "0.5rem", letterSpacing: "-0.02em",
            }}>
              Welcome back
            </h2>
            <p style={{ color: colors.textSecondary, fontSize: "0.95rem" }}>
              Sign in to your account to continue
            </p>
          </div>

          {justVerified && (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              backgroundColor: isDark ? "rgba(16, 185, 129, 0.1)" : "#f0fdf4",
              border: `1px solid ${isDark ? "rgba(16, 185, 129, 0.2)" : "#bbf7d0"}`,
              color: "#10b981", padding: "14px 18px", borderRadius: "14px",
              marginBottom: "1.5rem", fontSize: "0.9rem", fontWeight: "500",
            }}>
              <CheckCircle size={18} />
              Email verified! You can now log in.
            </div>
          )}

          {error && (
            <div style={{
              background: isDark ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
              border: `1px solid ${isDark ? "rgba(239, 68, 68, 0.2)" : "#fecaca"}`,
              color: "#ef4444", padding: "14px 18px", borderRadius: "14px",
              marginBottom: "1.5rem", fontSize: "0.9rem",
            }}>
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            style={{
              width: "100%", padding: "14px",
              background: isDark ? "rgba(255,255,255,0.05)" : "#ffffff",
              border: `1.5px solid ${colors.inputBorder}`,
              borderRadius: "14px", cursor: googleLoading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
              fontSize: "0.95rem", fontWeight: "600", color: colors.text,
              transition: "all 0.2s ease", marginBottom: "1.5rem",
              fontFamily: "inherit",
              opacity: googleLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!googleLoading) {
                e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "#f8fafc";
                e.currentTarget.style.borderColor = "#0ea5e9";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "#ffffff";
              e.currentTarget.style.borderColor = colors.inputBorder;
            }}
          >
            {/* Google SVG Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "1.5rem",
          }}>
            <div style={{ flex: 1, height: "1px", background: colors.border }} />
            <span style={{ color: colors.textMuted, fontSize: "0.8rem", fontWeight: "500" }}>
              or continue with email
            </span>
            <div style={{ flex: 1, height: "1px", background: colors.border }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block", fontSize: "0.875rem", fontWeight: "600",
                color: colors.textSecondary, marginBottom: "10px",
              }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{
                  position: "absolute", left: "16px", top: "50%",
                  transform: "translateY(-50%)", color: colors.textMuted,
                }} />
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="you@example.com" required
                  style={{
                    width: "100%", padding: "14px 16px 14px 48px",
                    border: `1.5px solid ${colors.inputBorder}`,
                    borderRadius: "14px", fontSize: "0.95rem",
                    color: colors.text, background: colors.inputBg,
                    outline: "none", transition: "all 0.2s ease", boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#0ea5e9"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.15)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = colors.inputBorder; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label style={{
                display: "block", fontSize: "0.875rem", fontWeight: "600",
                color: colors.textSecondary, marginBottom: "10px",
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={18} style={{
                  position: "absolute", left: "16px", top: "50%",
                  transform: "translateY(-50%)", color: colors.textMuted,
                }} />
                <input
                  type="password" name="password" value={formData.password}
                  onChange={handleChange} placeholder="••••••••" required
                  style={{
                    width: "100%", padding: "14px 16px 14px 48px",
                    border: `1.5px solid ${colors.inputBorder}`,
                    borderRadius: "14px", fontSize: "0.95rem",
                    color: colors.text, background: colors.inputBg,
                    outline: "none", transition: "all 0.2s ease", boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#0ea5e9"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.15)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = colors.inputBorder; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "15px", fontSize: "1rem",
                fontWeight: "700", color: "white",
                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                border: "none", borderRadius: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                boxShadow: "0 4px 15px rgba(14, 165, 233, 0.3)",
                transition: "all 0.2s ease", fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(14, 165, 233, 0.4)"; }
              }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(14, 165, 233, 0.3)"; }}
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p style={{
            textAlign: "center", color: colors.textSecondary,
            fontSize: "0.95rem", marginTop: "2rem",
          }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#0ea5e9", fontWeight: "700", textDecoration: "none" }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}