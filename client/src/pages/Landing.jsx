import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Stethoscope,
  Shield,
  Clock,
  FileText,
  Users,
  Activity,
  ArrowRight,
  CheckCircle,
  Heart,
  Sun,
  Moon,
  Sparkles,
  Zap,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Patient Management",
    desc: "Complete patient profiles with medical history, vital signs, and contact information.",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
    glow: "rgba(14, 165, 233, 0.2)",
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    desc: "Book, confirm, and manage appointments seamlessly with real-time status updates.",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    glow: "rgba(245, 158, 11, 0.2)",
  },
  {
    icon: FileText,
    title: "Digital Prescriptions",
    desc: "Structured prescriptions with medicines, dosages, and instructions. Accessible anytime.",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    glow: "rgba(16, 185, 129, 0.2)",
  },
  {
    icon: Activity,
    title: "Vital Signs Tracking",
    desc: "Monitor blood pressure, heart rate, weight, temperature and oxygen saturation over time.",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    glow: "rgba(139, 92, 246, 0.2)",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Role-based access control ensures doctors and patients only see what they should.",
    gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    glow: "rgba(239, 68, 68, 0.2)",
  },
  {
    icon: Heart,
    title: "Medical History",
    desc: "Complete condition records with severity tracking, diagnosis dates and resolution status.",
    gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    glow: "rgba(236, 72, 153, 0.2)",
  },
];

const steps = [
  { step: "01", title: "Create Account", desc: "Sign up as a Doctor or Patient in under a minute.", icon: Users },
  { step: "02", title: "Book Appointment", desc: "Patients browse doctors and book appointments instantly.", icon: Clock },
  { step: "03", title: "Consult & Prescribe", desc: "Doctor confirms, consults, and writes a digital prescription.", icon: FileText },
  { step: "04", title: "Track Your Health", desc: "View prescriptions and health history anytime, anywhere.", icon: Activity },
];

export default function Landing() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("landing-theme") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    localStorage.setItem("landing-theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  const colors = {
    bg: isDark ? "#030712" : "#ffffff",
    bgSubtle: isDark ? "#0f172a" : "#f8fafc",
    bgCard: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#f1f5f9" : "#0f172a",
    textSecondary: isDark ? "#94a3b8" : "#64748b",
    textMuted: isDark ? "#64748b" : "#94a3b8",
    border: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    borderLight: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    primary: "#0ea5e9",
    primaryGlow: isDark ? "rgba(14, 165, 233, 0.3)" : "rgba(14, 165, 233, 0.2)",
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: colors.text,
        background: colors.bg,
        overflowX: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 6%",
          position: "sticky",
          top: 0,
          background: isDark ? "rgba(3, 7, 18, 0.85)" : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${colors.border}`,
          zIndex: 100,
        }}
      >
        <div 
          onClick={() => navigate("/")}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 15px ${colors.primaryGlow}`,
            }}
          >
            <Stethoscope size={20} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: "800", fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
            MediCare
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              border: `1px solid ${colors.borderLight}`,
              background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {isDark ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#64748b" />}
          </button>

          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "10px 20px",
              background: "transparent",
              border: `1.5px solid ${colors.borderLight}`,
              borderRadius: "12px",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: colors.textSecondary,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.borderLight;
              e.currentTarget.style.color = colors.textSecondary;
            }}
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/signup")}
            style={{
              padding: "10px 24px",
              background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
              border: "none",
              borderRadius: "12px",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "white",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: `0 4px 15px ${colors.primaryGlow}`,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 25px ${colors.primaryGlow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 15px ${colors.primaryGlow}`;
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          padding: "7rem 6% 6rem",
          position: "relative",
          overflow: "hidden",
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Animated Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isDark
              ? `
                radial-gradient(ellipse at 20% 20%, rgba(14, 165, 233, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 60% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 40%)
              `
              : `
                radial-gradient(ellipse at 20% 20%, rgba(14, 165, 233, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
              `,
          }}
        />

        {/* Grid Pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: isDark ? 0.03 : 0.02,
            backgroundImage: `
              linear-gradient(${colors.text} 1px, transparent 1px),
              linear-gradient(90deg, ${colors.text} 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: isDark ? "rgba(14, 165, 233, 0.1)" : "rgba(14, 165, 233, 0.08)",
              border: `1px solid ${isDark ? "rgba(14, 165, 233, 0.2)" : "rgba(14, 165, 233, 0.15)"}`,
              borderRadius: "999px",
              padding: "8px 18px",
              marginBottom: "2rem",
            }}
          >
            <Sparkles size={14} color="#0ea5e9" />
            <span
              style={{
                fontSize: "0.8rem",
                color: "#0ea5e9",
                fontWeight: "600",
                letterSpacing: "0.02em",
              }}
            >
              Healthcare Management Platform
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(3rem, 6vw, 4.5rem)",
              fontWeight: "900",
              lineHeight: 1.05,
              marginBottom: "1.75rem",
              letterSpacing: "-0.04em",
            }}
          >
            Modern Healthcare
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Management System
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              color: colors.textSecondary,
              lineHeight: 1.8,
              marginBottom: "2.5rem",
              maxWidth: "580px",
            }}
          >
            A unified platform connecting doctors and patients. Manage appointments,
            prescriptions, medical history, and vital signs seamlessly.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/signup")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "16px 32px",
                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                border: "none",
                borderRadius: "14px",
                fontSize: "1rem",
                fontWeight: "700",
                color: "white",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: `0 4px 20px ${colors.primaryGlow}`,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 8px 30px rgba(14, 165, 233, 0.4)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 4px 20px ${colors.primaryGlow}`;
              }}
            >
              Get Started Free
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "16px 32px",
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                border: `1.5px solid ${colors.borderLight}`,
                borderRadius: "14px",
                fontSize: "1rem",
                fontWeight: "600",
                color: colors.textSecondary,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)";
                e.currentTarget.style.borderColor = colors.textMuted;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)";
                e.currentTarget.style.borderColor = colors.borderLight;
              }}
            >
              Sign In
            </button>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "4rem",
              paddingTop: "2rem",
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            {[
              // { value: "10K+", label: "Active Users" },
              { value: "500+", label: "Healthcare Providers" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: "800",
                    letterSpacing: "-0.02em",
                    background: "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ fontSize: "0.875rem", color: colors.textMuted, marginTop: "4px" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "6rem 6%", background: colors.bgSubtle }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: isDark ? "rgba(14, 165, 233, 0.1)" : "rgba(14, 165, 233, 0.08)",
              borderRadius: "999px",
              padding: "6px 16px",
              marginBottom: "1rem",
            }}
          >
            <Zap size={14} color="#0ea5e9" />
            <span style={{ fontSize: "0.75rem", color: "#0ea5e9", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Features
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: "900",
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
            }}
          >
            Everything you need
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: colors.textSecondary,
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Built for real-world healthcare workflows with a focus on simplicity and security.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {features.map((f, index) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                style={{
                  padding: "2rem",
                  borderRadius: "20px",
                  border: `1px solid ${colors.border}`,
                  background: colors.bgCard,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "default",
                  animation: `fadeIn 0.5s ease-out ${index * 80}ms both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 20px 40px ${f.glow}`;
                  e.currentTarget.style.borderColor = isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = colors.border;
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: f.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                    boxShadow: `0 4px 15px ${f.glow}`,
                  }}
                >
                  <Icon size={24} color="white" />
                </div>
                <h3
                  style={{
                    fontWeight: "700",
                    fontSize: "1.05rem",
                    marginBottom: "0.6rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: colors.textSecondary, lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: "6rem 6%", background: colors.bg }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: isDark ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.08)",
              borderRadius: "999px",
              padding: "6px 16px",
              marginBottom: "1rem",
            }}
          >
            <Globe size={14} color="#10b981" />
            <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              How it works
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: "900",
              letterSpacing: "-0.03em",
            }}
          >
            Simple 4-step process
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                style={{
                  background: colors.bgCard,
                  borderRadius: "20px",
                  border: `1px solid ${colors.border}`,
                  padding: "2rem",
                  textAlign: "center",
                  position: "relative",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 20px 40px ${colors.primaryGlow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {i < steps.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      right: "-1rem",
                      top: "3rem",
                      width: "2rem",
                      height: "2px",
                      background: `linear-gradient(90deg, ${colors.primary}, transparent)`,
                      zIndex: 1,
                    }}
                  />
                )}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem",
                    boxShadow: `0 4px 15px ${colors.primaryGlow}`,
                  }}
                >
                  <Icon size={24} color="white" />
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "800",
                    color: colors.primary,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Step {s.step}
                </span>
                <h3
                  style={{
                    fontWeight: "700",
                    fontSize: "1.05rem",
                    marginTop: "0.5rem",
                    marginBottom: "0.6rem",
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: colors.textSecondary, lineHeight: 1.65 }}>
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* For Who Section */}
      <section style={{ padding: "6rem 6%", background: colors.bgSubtle }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: "900",
              letterSpacing: "-0.03em",
            }}
          >
            One platform, two experiences
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {[
            {
              role: "For Doctors",
              tagline: "Everything to manage your practice",
              gradient: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              borderColor: isDark ? "rgba(14, 165, 233, 0.2)" : "rgba(14, 165, 233, 0.3)",
              bgTint: isDark ? "rgba(14, 165, 233, 0.05)" : "rgba(14, 165, 233, 0.03)",
              checkColor: "#0ea5e9",
              points: [
                "View and manage all patients",
                "Confirm or cancel appointments",
                "Write digital prescriptions",
                "Record vital signs per visit",
                "Add medical history & conditions",
                "Live dashboard with stats",
              ],
            },
            {
              role: "For Patients",
              tagline: "Your health, in your hands",
              gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderColor: isDark ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.3)",
              bgTint: isDark ? "rgba(16, 185, 129, 0.05)" : "rgba(16, 185, 129, 0.03)",
              checkColor: "#10b981",
              points: [
                "Book appointments with doctors",
                "Track appointment status",
                "Access digital prescriptions",
                "View full medical history",
                "Monitor vital signs over time",
                "Manage personal health profile",
              ],
            },
          ].map((item) => (
            <div
              key={item.role}
              style={{
                background: item.bgTint,
                borderRadius: "24px",
                border: `1.5px solid ${item.borderColor}`,
                padding: "2.5rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <h3
                style={{
                  fontWeight: "900",
                  fontSize: "1.35rem",
                  marginBottom: "6px",
                  background: item.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {item.role}
              </h3>
              <p style={{ fontSize: "0.9rem", color: colors.textSecondary, marginBottom: "1.75rem" }}>
                {item.tagline}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {item.points.map((point) => (
                  <div key={point} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "8px",
                        background: item.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle size={12} color="white" />
                    </div>
                    <span style={{ fontSize: "0.9rem", color: colors.text, fontWeight: "500" }}>
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "6rem 6%",
          textAlign: "center",
          background: isDark
            ? "linear-gradient(180deg, #030712 0%, #0f172a 100%)"
            : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 50%, ${colors.primaryGlow} 0%, transparent 60%)`,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              fontWeight: "900",
              letterSpacing: "-0.03em",
              marginBottom: "1.25rem",
            }}
          >
            Ready to get started?
          </h2>
          <p
            style={{
              color: colors.textSecondary,
              marginBottom: "2.5rem",
              fontSize: "1.05rem",
              maxWidth: "450px",
              margin: "0 auto 2.5rem",
            }}
          >
            Join MediCare and experience modern healthcare management today.
          </p>
          <button
            onClick={() => navigate("/signup")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "18px 36px",
              background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
              border: "none",
              borderRadius: "16px",
              fontSize: "1.05rem",
              fontWeight: "700",
              color: "white",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: `0 8px 30px ${colors.primaryGlow}`,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = `0 12px 40px rgba(14, 165, 233, 0.5)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 8px 30px ${colors.primaryGlow}`;
            }}
          >
            Create Free Account
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: colors.bgSubtle,
          borderTop: `1px solid ${colors.border}`,
          padding: "1.5rem 6%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stethoscope size={16} color="white" />
          </div>
          <span style={{ color: colors.textMuted, fontSize: "0.85rem", fontWeight: "600" }}>
            MediCare © 2026
          </span>
        </div>
        <p style={{ color: colors.textMuted, fontSize: "0.8rem" }}>
          Built with React · Node.js · Prisma · PostgreSQL
        </p>
      </footer>
    </div>
  );
}
