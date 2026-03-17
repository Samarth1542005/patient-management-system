import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, FileText, Clock, ArrowRight, TrendingUp } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyAppointments } from "../../api/appointments";
import { getMyPrescriptions } from "../../api/prescriptions";
import { formatDateTime, getStatusColor } from "../../lib/utils";
import useAuthStore from "../../store/authStore";

const cardStyle = {
  background: "white",
  borderRadius: "16px",
  border: "1px solid #f1f5f9",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  padding: "1.5rem",
};

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
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
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
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Icon size={20} color={stat.color} />
                </div>
              </div>
              <p style={{ fontSize: "2rem", fontWeight: "800", color: "#0f172a", marginBottom: "4px" }}>{stat.value}</p>
              <p style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "500" }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Two column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

        {/* Recent Appointments */}
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1.25rem 1.5rem", borderBottom: "1px solid #f8fafc"
          }}>
            <div>
              <p style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.95rem" }}>My Appointments</p>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>Your upcoming visits</p>
            </div>
            <button
              onClick={() => navigate("/patient/appointments")}
              style={{
                display: "flex", alignItems: "center", gap: "4px",
                color: "#2563eb", fontSize: "0.8rem", fontWeight: "700",
                background: "none", border: "none", cursor: "pointer", fontFamily: "inherit"
              }}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          {appointments.length === 0 ? (
            <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
              <CalendarDays size={32} color="#cbd5e1" style={{ margin: "0 auto 0.75rem" }} />
              <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>No appointments yet</p>
            </div>
          ) : (
            <div>
              {appointments.slice(0, 4).map((appt, i) => (
                <div key={appt.id} style={{
                  padding: "1rem 1.5rem",
                  borderBottom: i < Math.min(appointments.length, 4) - 1 ? "1px solid #f8fafc" : "none",
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: "#eff6ff", display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#2563eb",
                      fontWeight: "700", fontSize: "0.875rem", flexShrink: 0
                    }}>
                      {appt.doctor?.name?.[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#0f172a" }}>{appt.doctor?.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>{formatDateTime(appt.date)}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: "0.7rem", fontWeight: "700",
                    padding: "4px 10px", borderRadius: "999px",
                    ...getStatusBadgeStyle(appt.status)
                  }}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1.25rem 1.5rem", borderBottom: "1px solid #f8fafc"
          }}>
            <div>
              <p style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.95rem" }}>My Prescriptions</p>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>Recent medications</p>
            </div>
            <button
              onClick={() => navigate("/patient/prescriptions")}
              style={{
                display: "flex", alignItems: "center", gap: "4px",
                color: "#2563eb", fontSize: "0.8rem", fontWeight: "700",
                background: "none", border: "none", cursor: "pointer", fontFamily: "inherit"
              }}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          {prescriptions.length === 0 ? (
            <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
              <FileText size={32} color="#cbd5e1" style={{ margin: "0 auto 0.75rem" }} />
              <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>No prescriptions yet</p>
            </div>
          ) : (
            <div>
              {prescriptions.slice(0, 4).map((presc, i) => (
                <div key={presc.id} style={{
                  padding: "1rem 1.5rem",
                  borderBottom: i < Math.min(prescriptions.length, 4) - 1 ? "1px solid #f8fafc" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#0f172a" }}>{presc.diagnosis}</p>
                    <p style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{formatDateTime(presc.createdAt)}</p>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#64748b" }}>Dr. {presc.doctor?.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>
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

function getStatusBadgeStyle(status) {
  switch (status) {
    case "PENDING": return { background: "#fffbeb", color: "#d97706" };
    case "CONFIRMED": return { background: "#eff6ff", color: "#2563eb" };
    case "COMPLETED": return { background: "#f0fdf4", color: "#059669" };
    case "CANCELLED": return { background: "#fef2f2", color: "#dc2626" };
    default: return { background: "#f8fafc", color: "#64748b" };
  }
}