import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  History,
  LogOut,
  Stethoscope,
  ChevronRight,
  Activity,
  ScanLine,
  Sparkles,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { logout } from "../../api/auth";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../shared/ThemeToggle";

const doctorLinks = [
  { path: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/doctor/patients", label: "Patients", icon: Users },
  { path: "/doctor/appointments", label: "Appointments", icon: CalendarDays },
  { path: "/doctor/prescriptions", label: "Prescriptions", icon: FileText },
];

const patientLinks = [
  { path: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/patient/appointments", label: "Appointments", icon: CalendarDays },
  { path: "/patient/prescriptions", label: "Prescriptions", icon: FileText },
  { path: "/patient/history", label: "My History", icon: History },
  { path: "/patient/symptom-checker", label: "Symptom Checker", icon: Activity },
  { path: "/patient/report-analyzer", label: "Report Analyzer", icon: ScanLine },
];

export default function Sidebar() {
  const { user, logout: logoutStore } = useAuthStore();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const links = user?.role === "DOCTOR" ? doctorLinks : patientLinks;
  const name = user?.doctor?.name || user?.patient?.name || "User";
  const role = user?.role?.toLowerCase();

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error(err); }
    finally { logoutStore(); navigate("/login"); }
  };

  return (
    <aside
      className="sidebar-container"
      style={{
        width: "280px",
        minHeight: "100vh",
        background: "var(--sidebar-bg)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated gradient orbs */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(ellipse at 30% 20%, rgba(14, 165, 233, 0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-30%",
          right: "-30%",
          width: "150%",
          height: "150%",
          background: "radial-gradient(ellipse at 70% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo Section */}
      <div
        style={{
          padding: "1.5rem 1.25rem 1.25rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
        }}
      >
        <div 
          onClick={() => navigate("/")}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "14px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.85";
            e.currentTarget.style.transform = "translateX(2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(14, 165, 233, 0.4)",
              position: "relative",
            }}
          >
            <Stethoscope size={22} color="white" strokeWidth={2.5} />
            <div
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                width: "12px",
                height: "12px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                borderRadius: "50%",
                border: "2px solid #0f172a",
              }}
            />
          </div>
          <div>
            <h1
              style={{
                fontSize: "1.1rem",
                fontWeight: "800",
                color: "white",
                letterSpacing: "-0.02em",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              MediCare
              <Sparkles size={14} color="#0ea5e9" />
            </h1>
            <p
              style={{
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.4)",
                fontWeight: "500",
                marginTop: "2px",
                letterSpacing: "0.02em",
              }}
            >
              Healthcare Platform
            </p>
          </div>
        </div>
      </div>

      {/* User Card */}
      <div style={{ padding: "1rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "14px",
            padding: "12px 14px",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "700",
              fontSize: "0.95rem",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(14, 165, 233, 0.3)",
            }}
          >
            {name[0]}
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "white",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </p>
            <p
              style={{
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.45)",
                textTransform: "capitalize",
                marginTop: "2px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#10b981",
                  display: "inline-block",
                }}
              />
              {role}
            </p>
          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <div
        style={{
          padding: "1rem 1rem 0.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: "600",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Theme
        </span>
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "0.75rem 1rem", overflowY: "auto" }}>
        <p
          style={{
            fontSize: "0.65rem",
            fontWeight: "700",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            padding: "0 12px",
            marginBottom: "10px",
            marginTop: "4px",
          }}
        >
          Navigation
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 14px",
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? "600" : "500",
                  textDecoration: "none",
                  color: isActive ? "white" : "rgba(255,255,255,0.55)",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)"
                    : "transparent",
                  border: isActive ? "1px solid rgba(14, 165, 233, 0.2)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                  animation: `fadeIn 0.4s ease-out ${index * 50}ms both`,
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains("active")) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.classList.contains("active")) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                {({ isActive }) => (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "10px",
                          background: isActive
                            ? "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)"
                            : "rgba(255,255,255,0.06)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s ease",
                          boxShadow: isActive ? "0 2px 8px rgba(14, 165, 233, 0.3)" : "none",
                        }}
                      >
                        <Icon
                          size={16}
                          color={isActive ? "white" : "rgba(255,255,255,0.5)"}
                        />
                      </div>
                      {link.label}
                    </div>
                    {isActive && (
                      <ChevronRight size={14} style={{ opacity: 0.7 }} />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div
        style={{
          padding: "1rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "11px 14px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.875rem",
            fontWeight: "500",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            e.currentTarget.style.color = "#f87171";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogOut size={16} />
          </div>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
