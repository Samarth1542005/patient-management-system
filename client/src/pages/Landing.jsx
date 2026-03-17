import { useNavigate } from "react-router-dom";
import { Stethoscope, Shield, Clock, FileText, Users, Activity, ArrowRight, CheckCircle, Heart } from "lucide-react";

const features = [
  { icon: Users, title: "Patient Management", desc: "Complete patient profiles with medical history, vital signs, and contact information.", color: "#2563eb", bg: "#eff6ff" },
  { icon: Clock, title: "Smart Scheduling", desc: "Book, confirm, and manage appointments seamlessly with real-time status updates.", color: "#7c3aed", bg: "#f5f3ff" },
  { icon: FileText, title: "Digital Prescriptions", desc: "Structured prescriptions with medicines, dosages, and instructions. Accessible anytime.", color: "#059669", bg: "#ecfdf5" },
  { icon: Activity, title: "Vital Signs Tracking", desc: "Monitor blood pressure, heart rate, weight, temperature and oxygen saturation over time.", color: "#d97706", bg: "#fffbeb" },
  { icon: Shield, title: "Secure & Private", desc: "Role-based access control ensures doctors and patients only see what they should.", color: "#dc2626", bg: "#fef2f2" },
  { icon: Heart, title: "Medical History", desc: "Complete condition records with severity tracking, diagnosis dates and resolution status.", color: "#0891b2", bg: "#ecfeff" },
];

const steps = [
  { step: "01", title: "Create Account", desc: "Sign up as a Doctor or Patient in under a minute." },
  { step: "02", title: "Book Appointment", desc: "Patients browse doctors and book appointments instantly." },
  { step: "03", title: "Consult & Prescribe", desc: "Doctor confirms, consults, and writes a digital prescription." },
  { step: "04", title: "Track Your Health", desc: "View prescriptions and health history anytime, anywhere." },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: "#0f172a", background: "white", overflowX: "hidden" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.1rem 6%",
        position: "sticky", top: 0,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "34px", height: "34px", background: "#2563eb",
            borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(37,99,235,0.35)"
          }}>
            <Stethoscope size={17} color="white" />
          </div>
          <span style={{ fontWeight: "800", fontSize: "1.05rem", letterSpacing: "-0.02em" }}>MediCare</span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate("/login")} style={{
            padding: "8px 18px", background: "transparent",
            border: "1.5px solid #e2e8f0", borderRadius: "9px",
            fontSize: "0.85rem", fontWeight: "700", color: "#374151",
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s"
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#374151"; }}
          >Sign In</button>
          <button onClick={() => navigate("/signup")} style={{
            padding: "8px 18px", background: "#2563eb",
            border: "none", borderRadius: "9px",
            fontSize: "0.85rem", fontWeight: "700", color: "white",
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 2px 8px rgba(37,99,235,0.35)"
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#1d4ed8"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#2563eb"}
          >Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: "6rem 6% 5rem",
        background: "#0f172a",
        position: "relative", overflow: "hidden"
      }}>
        {/* Gradient mesh background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 20% 50%, rgba(37,99,235,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.15) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(16,185,129,0.1) 0%, transparent 50%)",
        }} />

        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "780px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(37,99,235,0.15)",
            border: "1px solid rgba(37,99,235,0.3)",
            borderRadius: "999px", padding: "5px 14px", marginBottom: "2rem"
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399" }} />
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", fontWeight: "600", letterSpacing: "0.02em" }}>
              Healthcare Management Platform
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: "900", color: "white",
            lineHeight: 1.08, marginBottom: "1.5rem",
            letterSpacing: "-0.04em"
          }}>
            Modern Healthcare<br />
            <span style={{
              background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              Management System
            </span>
          </h1>

          <p style={{
            fontSize: "1.05rem", color: "rgba(255,255,255,0.6)",
            lineHeight: 1.75, marginBottom: "2.5rem",
            maxWidth: "540px", fontWeight: "400"
          }}>
            A unified platform connecting doctors and patients. Manage appointments, prescriptions, medical history, and vital signs seamlessly.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/signup")} style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "13px 26px", background: "white",
              border: "none", borderRadius: "11px",
              fontSize: "0.925rem", fontWeight: "800", color: "#1d4ed8",
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              transition: "transform 0.15s"
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              Get Started Free <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate("/login")} style={{
              padding: "13px 26px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "11px",
              fontSize: "0.925rem", fontWeight: "700", color: "rgba(255,255,255,0.85)",
              cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s"
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "5.5rem 6%", background: "white" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
            Features
          </p>
          <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: "900", color: "#0f172a", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            Everything you need
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#64748b", maxWidth: "460px", margin: "0 auto", lineHeight: 1.7 }}>
            Built for real-world healthcare workflows with a focus on simplicity and security.
          </p>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.25rem", maxWidth: "1080px", margin: "0 auto"
        }}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} style={{
                padding: "1.75rem", borderRadius: "16px",
                border: "1.5px solid #f1f5f9",
                transition: "all 0.2s", cursor: "default",
                background: "white"
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#dbeafe";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(37,99,235,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#f1f5f9";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: "42px", height: "42px", borderRadius: "11px",
                  background: f.bg, display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: "1rem"
                }}>
                  <Icon size={19} color={f.color} />
                </div>
                <h3 style={{ fontWeight: "700", color: "#0f172a", marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "0.84rem", color: "#64748b", lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "5.5rem 6%", background: "#f8fafc" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
            How it works
          </p>
          <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: "900", color: "#0f172a", letterSpacing: "-0.03em" }}>
            Simple 4-step process
          </h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.25rem", maxWidth: "1080px", margin: "0 auto"
        }}>
          {steps.map((s, i) => (
            <div key={s.step} style={{
              background: "white", borderRadius: "16px",
              border: "1.5px solid #f1f5f9",
              padding: "1.75rem", textAlign: "center",
              position: "relative"
            }}>
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute", right: "-0.75rem", top: "2.5rem",
                  width: "1.25rem", height: "1px",
                  background: "#e2e8f0", zIndex: 1
                }} />
              )}
              <div style={{
                width: "46px", height: "46px", borderRadius: "13px",
                background: "linear-gradient(135deg, #1e40af, #2563eb)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.1rem",
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)"
              }}>
                <span style={{ color: "white", fontWeight: "900", fontSize: "0.8rem" }}>{s.step}</span>
              </div>
              <h3 style={{ fontWeight: "700", color: "#0f172a", marginBottom: "0.5rem", fontSize: "0.95rem" }}>{s.title}</h3>
              <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For who */}
      <section style={{ padding: "5.5rem 6%", background: "white" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
            Built for everyone
          </p>
          <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: "900", color: "#0f172a", letterSpacing: "-0.03em" }}>
            One platform, two experiences
          </h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem", maxWidth: "900px", margin: "0 auto"
        }}>
          {[
            {
              role: "For Doctors",
              tagline: "Everything to manage your practice",
              color: "#2563eb", borderColor: "#bfdbfe",
              bg: "linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)",
              points: ["View and manage all patients", "Confirm or cancel appointments", "Write digital prescriptions", "Record vital signs per visit", "Add medical history & conditions", "Live dashboard with stats"]
            },
            {
              role: "For Patients",
              tagline: "Your health, in your hands",
              color: "#059669", borderColor: "#a7f3d0",
              bg: "linear-gradient(145deg, #ecfdf5 0%, #d1fae5 100%)",
              points: ["Book appointments with doctors", "Track appointment status", "Access digital prescriptions", "View full medical history", "Monitor vital signs over time", "Manage personal health profile"]
            }
          ].map((item) => (
            <div key={item.role} style={{
              background: item.bg, borderRadius: "20px",
              border: `1.5px solid ${item.borderColor}`, padding: "2rem"
            }}>
              <h3 style={{ fontWeight: "900", fontSize: "1.2rem", color: "#0f172a", marginBottom: "4px" }}>
                {item.role}
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1.5rem" }}>{item.tagline}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                {item.points.map((point) => (
                  <div key={point} style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <CheckCircle size={15} color={item.color} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: "0.84rem", color: "#374151", fontWeight: "500" }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "5.5rem 6%", textAlign: "center",
        background: "#0f172a", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.2) 0%, transparent 70%)"
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "900", color: "white",
            letterSpacing: "-0.03em", marginBottom: "1rem"
          }}>
            Ready to get started?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2.5rem", fontSize: "0.95rem", maxWidth: "400px", margin: "0 auto 2.5rem" }}>
            Join MediCare and experience modern healthcare management today.
          </p>
          <button onClick={() => navigate("/signup")} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "13px 30px", background: "white",
            border: "none", borderRadius: "11px",
            fontSize: "0.95rem", fontWeight: "800", color: "#1d4ed8",
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            transition: "transform 0.15s"
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Create Free Account <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "#0f172a",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "1.25rem 6%",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "26px", height: "26px", background: "#2563eb",
            borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Stethoscope size={13} color="white" />
          </div>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", fontWeight: "600" }}>MediCare © 2026</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.75rem" }}>
          Built with React · Node.js · Prisma · Supabase
        </p>
      </footer>

    </div>
  );
}