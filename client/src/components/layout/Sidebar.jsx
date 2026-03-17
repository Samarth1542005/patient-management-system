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
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
            <Stethoscope size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">MediCare</h1>
            <p className="text-xs text-slate-500">Management System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3 bg-slate-800 rounded-xl px-3 py-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {name[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{name}</p>
            <p className="text-xs text-slate-400 capitalize">{role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-2">Menu</p>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-primary-500 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon size={17} />
                    {link.label}
                  </div>
                  {isActive && <ChevronRight size={14} className="opacity-70" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}