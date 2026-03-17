import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { login } from "../../api/auth";
import useAuthStore from "../../store/authStore";
import { Stethoscope, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const justVerified = location.state?.verified || false;

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

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f172a" }}>

      {/* Left Panel */}
      <div style={{
        width: "45%",
        background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "3rem",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "300px", height: "300px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)"
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "250px", height: "250px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)"
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px", marginBottom: "3rem"
          }}>
            <div style={{
              width: "44px", height: "44px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "12px",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Stethoscope size={22} color="white" />
            </div>
            <span style={{ color: "white", fontWeight: "700", fontSize: "1.25rem" }}>MediCare</span>
          </div>

          <h1 style={{
            color: "white", fontSize: "2.5rem",
            fontWeight: "800", lineHeight: "1.2",
            marginBottom: "1.5rem"
          }}>
            Healthcare<br />Management<br />Made Simple
          </h1>

          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: "1.7", marginBottom: "3rem" }}>
            A unified platform for doctors and patients to manage appointments, prescriptions, and medical records.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {["Manage patient records securely", "Schedule & track appointments", "Digital prescriptions & history"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "20px", height: "20px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0
                }}>
                  <ArrowRight size={11} color="white" />
                </div>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem",
        backgroundColor: "#f8fafc"
      }}>
        <div className="animate-fade-in" style={{ width: "100%", maxWidth: "420px" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.875rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.5rem" }}>
              Welcome back
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Email verified success banner */}
          {justVerified && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
              color: "#16a34a", padding: "12px 16px",
              borderRadius: "10px", marginBottom: "1.5rem",
              fontSize: "0.875rem", fontWeight: "500",
            }}>
              <CheckCircle size={16} />
              Email verified! You can now log in.
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              color: "#dc2626", padding: "12px 16px",
              borderRadius: "10px", marginBottom: "1.5rem",
              fontSize: "0.875rem"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label className="form-label" style={{ fontSize: "0.875rem", marginBottom: "8px" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="form-input"
                  style={{ padding: "12px 16px 12px 42px", fontSize: "0.9rem" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.75rem" }}>
              <label className="form-label" style={{ fontSize: "0.875rem", marginBottom: "8px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="form-input"
                  style={{ padding: "12px 16px 12px 42px", fontSize: "0.9rem" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: "100%", padding: "13px",
                fontSize: "0.95rem",
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.875rem", marginTop: "1.5rem" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#2563eb", fontWeight: "700", textDecoration: "none" }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}