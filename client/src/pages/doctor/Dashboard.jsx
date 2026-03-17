import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CalendarDays, FileText, Clock, TrendingUp, ArrowRight } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getDoctorStats } from "../../api/doctors";
import { getDoctorAppointments } from "../../api/appointments";
import { formatDateTime, getStatusColor } from "../../lib/utils";
import useAuthStore from "../../store/authStore";

const StatCard = ({ title, value, icon: Icon, bg, iconColor, trend, delay }) => (
  <div className="card" style={{
    padding: "1.5rem",
    animation: `fadeIn 0.4s ease-out ${delay}ms both`,
  }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px",
        background: bg, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={20} color={iconColor} />
      </div>
      {trend && (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          fontSize: "0.7rem", fontWeight: "700",
          color: "#059669", background: "#ecfdf5",
          padding: "3px 8px", borderRadius: "999px",
        }}>
          <TrendingUp size={11} /> {trend}
        </span>
      )}
    </div>
    <p style={{ fontSize: "2rem", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.02em", marginBottom: "2px" }}>{value}</p>
    <p style={{ fontSize: "0.84rem", color: "#64748b", fontWeight: "500" }}>{title}</p>
  </div>
);

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, apptRes] = await Promise.all([
          getDoctorStats(),
          getDoctorAppointments(),
        ]);
        setStats(statsRes.data.data);
        setAppointments(apptRes.data.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <PageWrapper title="Dashboard">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "16rem" }}>
          <div style={{
            width: "32px", height: "32px",
            border: "3px solid #2563eb", borderTopColor: "transparent",
            borderRadius: "50%", animation: "spin 0.8s linear infinite",
          }} />
        </div>
      </PageWrapper>
    );
  }

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <PageWrapper
      title={`Good day, ${user?.doctor?.name?.split(" ")[0] || "Doctor"}`}
      subtitle={today}
    >
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "2rem" }}>
        <StatCard title="Total Patients" value={stats?.totalPatients ?? 0} icon={Users} bg="#eff6ff" iconColor="#2563eb" delay={0} />
        <StatCard title="Pending" value={stats?.pendingAppointments ?? 0} icon={Clock} bg="#fffbeb" iconColor="#d97706" delay={60} />
        <StatCard title="Confirmed" value={stats?.confirmedAppointments ?? 0} icon={CalendarDays} bg="#f5f3ff" iconColor="#7c3aed" delay={120} />
        <StatCard title="Prescriptions" value={stats?.totalPrescriptions ?? 0} icon={FileText} bg="#ecfdf5" iconColor="#059669" delay={180} />
      </div>

      {/* Recent Appointments */}
      <div className="card" style={{ overflow: "hidden", animation: "fadeIn 0.5s ease-out 200ms both" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid #f1f5f9",
        }}>
          <div>
            <h3 style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.95rem" }}>Recent Appointments</h3>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>Latest patient appointments</p>
          </div>
          <button
            onClick={() => navigate("/doctor/appointments")}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              color: "#2563eb", fontSize: "0.8rem", fontWeight: "700",
              background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
              padding: "6px 12px", borderRadius: "8px",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#eff6ff"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >
            View all <ArrowRight size={15} />
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <CalendarDays size={22} color="#94a3b8" />
            </div>
            <h3>No appointments yet</h3>
            <p>Appointments will appear here</p>
          </div>
        ) : (
          <div>
            {appointments.map((appt, i) => (
              <div key={appt.id} style={{
                padding: "0.875rem 1.5rem",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: i < appointments.length - 1 ? "1px solid #f8fafc" : "none",
                transition: "background 0.1s ease",
                cursor: "default",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#fafbfc"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div className="avatar avatar-sm" style={{ background: "#eff6ff", color: "#2563eb" }}>
                    {appt.patient?.name?.[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#0f172a" }}>{appt.patient?.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>{appt.reason}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{formatDateTime(appt.date)}</p>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}