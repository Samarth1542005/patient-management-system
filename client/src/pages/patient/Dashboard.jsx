import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, FileText, Clock, ArrowRight } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyAppointments } from "../../api/appointments";
import { getMyPrescriptions } from "../../api/prescriptions";
import { formatDateTime } from "../../lib/utils";
import useAuthStore from "../../store/authStore";

function StatusBadge({ status }) {
  const styles = {
    PENDING: { background: "#fffbeb", color: "#d97706" },
    CONFIRMED: { background: "#eff6ff", color: "#2563eb" },
    COMPLETED: { background: "#ecfdf5", color: "#059669" },
    CANCELLED: { background: "#fef2f2", color: "#dc2626" },
  };
  const s = styles[status] || { background: "#f8fafc", color: "#64748b" };
  return (
    <span className="status-badge" style={{ background: s.background, color: s.color }}>
      {status}
    </span>
  );
}

export default function PatientDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, prescRes] = await Promise.all([
          getMyAppointments(),
          getMyPrescriptions(),
        ]);
        setAppointments(apptRes.data.data);
        setPrescriptions(prescRes.data.data);
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

  const pending = appointments.filter(a => a.status === "PENDING").length;
  const confirmed = appointments.filter(a => a.status === "CONFIRMED").length;
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const stats = [
    { label: "Total Appointments", value: appointments.length, icon: CalendarDays, bg: "#eff6ff", color: "#2563eb" },
    { label: "Pending", value: pending, icon: Clock, bg: "#fffbeb", color: "#d97706" },
    { label: "Prescriptions", value: prescriptions.length, icon: FileText, bg: "#ecfdf5", color: "#059669" },
  ];

  return (
    <PageWrapper
      title={`Welcome, ${user?.patient?.name?.split(" ")[0] || "Patient"}`}
      subtitle={today}
    >
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "2rem" }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card" style={{
              padding: "1.5rem",
              animation: `fadeIn 0.4s ease-out ${i * 60}ms both`,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={20} color={stat.color} />
                </div>
              </div>
              <p style={{ fontSize: "2rem", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.02em", marginBottom: "2px" }}>{stat.value}</p>
              <p style={{ fontSize: "0.84rem", color: "#64748b", fontWeight: "500" }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Two column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

        {/* Recent Appointments */}
        <div className="card" style={{ overflow: "hidden", animation: "fadeIn 0.5s ease-out 200ms both" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9",
          }}>
            <div>
              <p style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.95rem" }}>My Appointments</p>
              <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "2px" }}>Your upcoming visits</p>
            </div>
            <button
              onClick={() => navigate("/patient/appointments")}
              style={{
                display: "flex", alignItems: "center", gap: "4px",
                color: "#2563eb", fontSize: "0.8rem", fontWeight: "700",
                background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                padding: "6px 12px", borderRadius: "8px", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#eff6ff"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="empty-state" style={{ padding: "3rem 1.5rem" }}>
              <div className="empty-state-icon"><CalendarDays size={22} color="#94a3b8" /></div>
              <h3>No appointments yet</h3>
              <p>Book your first appointment</p>
            </div>
          ) : (
            <div>
              {appointments.slice(0, 4).map((appt, i) => (
                <div key={appt.id} style={{
                  padding: "0.875rem 1.5rem",
                  borderBottom: i < Math.min(appointments.length, 4) - 1 ? "1px solid #f8fafc" : "none",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transition: "background 0.1s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fafbfc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="avatar avatar-sm" style={{ background: "#eff6ff", color: "#2563eb" }}>
                      {appt.doctor?.name?.[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: "0.84rem", fontWeight: "600", color: "#0f172a" }}>{appt.doctor?.name}</p>
                      <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "2px" }}>{formatDateTime(appt.date)}</p>
                    </div>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div className="card" style={{ overflow: "hidden", animation: "fadeIn 0.5s ease-out 260ms both" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9",
          }}>
            <div>
              <p style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.95rem" }}>My Prescriptions</p>
              <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "2px" }}>Recent medications</p>
            </div>
            <button
              onClick={() => navigate("/patient/prescriptions")}
              style={{
                display: "flex", alignItems: "center", gap: "4px",
                color: "#2563eb", fontSize: "0.8rem", fontWeight: "700",
                background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                padding: "6px 12px", borderRadius: "8px", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#eff6ff"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          {prescriptions.length === 0 ? (
            <div className="empty-state" style={{ padding: "3rem 1.5rem" }}>
              <div className="empty-state-icon"><FileText size={22} color="#94a3b8" /></div>
              <h3>No prescriptions yet</h3>
              <p>Your prescriptions will appear here</p>
            </div>
          ) : (
            <div>
              {prescriptions.slice(0, 4).map((presc, i) => (
                <div key={presc.id} style={{
                  padding: "0.875rem 1.5rem",
                  borderBottom: i < Math.min(prescriptions.length, 4) - 1 ? "1px solid #f8fafc" : "none",
                  transition: "background 0.1s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fafbfc"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                    <p style={{ fontSize: "0.84rem", fontWeight: "600", color: "#0f172a" }}>{presc.diagnosis}</p>
                    <p style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{formatDateTime(presc.createdAt)}</p>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#64748b" }}>{presc.doctor?.name}</p>
                  <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "3px" }}>
                    {presc.medicines?.length} medicine(s) prescribed
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}