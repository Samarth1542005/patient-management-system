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
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { logout } from "../../api/auth";

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
];

export default function Sidebar() {
  const { user, logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();
  const links = user?.role === "DOCTOR" ? doctorLinks : patientLinks;
  const name = user?.doctor?.name || user?.patient?.name || "User";
  const role = user?.role?.toLowerCase();

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error(err); }
    finally { logoutStore(); navigate("/login"); }
  };

  return (
    <aside style={{
      width: "260px",
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{ padding: "1.5rem 1.5rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(37,99,235,0.4)",
          }}>
            <Stethoscope size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: "0.95rem", fontWeight: "800", color: "white", letterSpacing: "-0.01em" }}>MediCare</h1>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", fontWeight: "500", marginTop: "1px" }}>Management System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div style={{ padding: "1rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "12px",
          padding: "10px 12px",
        }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "9px",
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: "700", fontSize: "0.8rem", flexShrink: 0,
          }}>
            {name[0]}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p style={{
              fontSize: "0.8rem", fontWeight: "600", color: "white",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{name}</p>
            <p style={{
              fontSize: "0.65rem", color: "rgba(255,255,255,0.4)",
              textTransform: "capitalize", marginTop: "1px",
            }}>{role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem" }}>
        <p style={{
          fontSize: "0.6rem", fontWeight: "700", color: "rgba(255,255,255,0.25)",
          textTransform: "uppercase", letterSpacing: "0.1em",
          padding: "0 12px", marginBottom: "8px",
        }}>Menu</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: "10px",
                  fontSize: "0.84rem",
                  fontWeight: isActive ? "700" : "500",
                  textDecoration: "none",
                  color: isActive ? "white" : "rgba(255,255,255,0.5)",
                  background: isActive ? "rgba(59, 130, 246, 0.2)" : "transparent",
                  transition: "all 0.15s ease",
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains("active")) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.classList.contains("active")) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  }
                }}
              >
                {({ isActive }) => (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Icon size={17} />
                      {link.label}
                    </div>
                    {isActive && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: "10px",
            padding: "9px 12px",
            borderRadius: "10px", border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.45)",
            fontSize: "0.84rem", fontWeight: "500",
            cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#f87171"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}