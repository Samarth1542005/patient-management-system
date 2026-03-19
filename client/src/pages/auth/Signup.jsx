import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../api/auth";
import { Stethoscope, ArrowRight, Sun, Moon, Sparkles, User, Briefcase } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("PATIENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth-theme") || "dark";
    }
    return "dark";
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    dob: "",
    gender: "MALE",
    specialization: "",
    qualification: "",
    experience: "",
  });

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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup({ ...formData, role });
      navigate("/verify-email-pending", { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: `1.5px solid ${colors.inputBorder}`,
    borderRadius: "12px",
    fontSize: "0.9rem",
    color: colors.text,
    background: colors.inputBg,
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: colors.bg,
        transition: "all 0.3s ease",
      }}
    >
      {/* Left branding panel */}
      <div
        style={{
          width: "100px",
          background: isDark
            ? "linear-gradient(180deg, #0c1929 0%, #0f172a 100%)"
            : "linear-gradient(180deg, #0ea5e9 0%, #0284c7 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2rem 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "-50%",
            width: "200%",
            height: "200px",
            background: "radial-gradient(ellipse, rgba(14, 165, 233, 0.2) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          style={{
            width: "48px",
            height: "48px",
            background: isDark
              ? "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)"
              : "rgba(255,255,255,0.2)",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(14, 165, 233, 0.3)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Stethoscope size={24} color="white" strokeWidth={2.5} />
        </div>

        {/* Vertical text */}
        <span
          onClick={() => navigate("/")}
          style={{
            color: "rgba(255,255,255,0.5)",
            fontWeight: "800",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            writingMode: "vertical-rl",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.8)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          }}
        >
          MediCare
        </span>

        {/* Sparkle */}
        <Sparkles size={20} color="rgba(255,255,255,0.3)" />
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 4rem",
          position: "relative",
        }}
      >
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            position: "absolute",
            top: "2rem",
            right: "2rem",
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            border: `1px solid ${colors.border}`,
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {isDark ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} color="#64748b" />}
        </button>

        <div className="animate-fade-in" style={{ width: "100%", maxWidth: "520px" }}>
          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "900",
                color: colors.text,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Create Account
            </h2>
            <p style={{ color: colors.textSecondary, fontSize: "0.95rem", marginTop: "8px" }}>
              Join MediCare and start your healthcare journey
            </p>
          </div>

          {/* Role Toggle */}
          <div
            style={{
              display: "flex",
              background: colors.bgSubtle,
              borderRadius: "14px",
              padding: "6px",
              marginBottom: "1.75rem",
              border: `1px solid ${colors.border}`,
            }}
          >
            {[
              { value: "PATIENT", label: "Patient", icon: User },
              { value: "DOCTOR", label: "Doctor", icon: Briefcase },
            ].map((r) => {
              const Icon = r.icon;
              const isActive = role === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    background: isActive
                      ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
                      : "transparent",
                    color: isActive ? "white" : colors.textMuted,
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s ease",
                    boxShadow: isActive ? "0 4px 15px rgba(14, 165, 233, 0.25)" : "none",
                  }}
                >
                  <Icon size={16} />
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: isDark ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
                border: `1px solid ${isDark ? "rgba(239, 68, 68, 0.2)" : "#fecaca"}`,
                color: "#ef4444",
                padding: "14px 18px",
                borderRadius: "14px",
                marginBottom: "1.5rem",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: colors.textSecondary,
                    marginBottom: "8px",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0ea5e9";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.inputBorder;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: colors.textSecondary,
                    marginBottom: "8px",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0ea5e9";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.inputBorder;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: colors.textSecondary,
                    marginBottom: "8px",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0ea5e9";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.inputBorder;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {role === "PATIENT" && (
                <>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: colors.textSecondary,
                        marginBottom: "8px",
                      }}
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#0ea5e9";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.inputBorder;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: colors.textSecondary,
                        marginBottom: "8px",
                      }}
                    >
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#0ea5e9";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.inputBorder;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </>
              )}

              {role === "DOCTOR" && (
                <>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: colors.textSecondary,
                        marginBottom: "8px",
                      }}
                    >
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="e.g. Cardiology"
                      required
                      style={inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#0ea5e9";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.inputBorder;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: colors.textSecondary,
                        marginBottom: "8px",
                      }}
                    >
                      Qualification
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      placeholder="e.g. MBBS, MD"
                      required
                      style={inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#0ea5e9";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.inputBorder;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: colors.textSecondary,
                        marginBottom: "8px",
                      }}
                    >
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g. 5"
                      required
                      style={inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#0ea5e9";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.inputBorder;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                fontSize: "1rem",
                fontWeight: "700",
                color: "white",
                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                border: "none",
                borderRadius: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 4px 15px rgba(14, 165, 233, 0.3)",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(14, 165, 233, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(14, 165, 233, 0.3)";
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              color: colors.textSecondary,
              fontSize: "0.95rem",
              marginTop: "1.75rem",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#0ea5e9",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
