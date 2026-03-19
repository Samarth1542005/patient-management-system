import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, FileText, Clock, ArrowRight, Sparkles } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyAppointments } from "../../api/appointments";
import { getMyPrescriptions } from "../../api/prescriptions";
import { formatDateTime } from "../../lib/utils";
import useAuthStore from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";

function StatusBadge({ status }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const styles = {
    PENDING: {
      background: isDark ? "rgba(245, 158, 11, 0.15)" : "#fffbeb",
      color: "#f59e0b",
    },
    CONFIRMED: {
      background: isDark ? "rgba(14, 165, 233, 0.15)" : "#e0f2fe",
      color: "#0ea5e9",
    },
    COMPLETED: {
      background: isDark ? "rgba(16, 185, 129, 0.15)" : "#d1fae5",
      color: "#10b981",
    },
    CANCELLED: {
      background: isDark ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
      color: "#ef4444",
    },
  };
  const s = styles[status] || {
    background: isDark ? "rgba(100, 116, 139, 0.15)" : "#f8fafc",
    color: "#64748b",
  };
  return (
    <span
      className="status-badge"
      style={{ background: s.background, color: s.color }}
    >
      {status}
    </span>
  );
}

export default function PatientDashboard() {
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDark = theme === "dark";

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "16rem",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid var(--color-primary)",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
        </div>
      </PageWrapper>
    );
  }

  const pending = appointments.filter((a) => a.status === "PENDING").length;
  const confirmed = appointments.filter((a) => a.status === "CONFIRMED").length;
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats = [
    {
      label: "Total Appointments",
      value: appointments.length,
      icon: CalendarDays,
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      label: "Prescriptions",
      value: prescriptions.length,
      icon: FileText,
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
  ];

  return (
    <PageWrapper
      title={
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {`Welcome, ${user?.patient?.name?.split(" ")[0] || "Patient"}`}
          <Sparkles size={20} color="var(--color-primary)" />
        </span>
      }
      subtitle={today}
    >
      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card"
              style={{
                padding: "1.5rem",
                animation: `fadeIn 0.4s ease-out ${i * 60}ms both`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Gradient glow */}
              <div
                style={{
                  position: "absolute",
                  top: "-50%",
                  right: "-50%",
                  width: "100%",
                  height: "100%",
                  background: `radial-gradient(circle, ${
                    stat.gradient.includes("#0ea5e9")
                      ? "rgba(14, 165, 233, 0.1)"
                      : stat.gradient.includes("#f59e0b")
                      ? "rgba(245, 158, 11, 0.1)"
                      : "rgba(16, 185, 129, 0.1)"
                  } 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: stat.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 15px ${
                      stat.gradient.includes("#0ea5e9")
                        ? "rgba(14, 165, 233, 0.3)"
                        : stat.gradient.includes("#f59e0b")
                        ? "rgba(245, 158, 11, 0.3)"
                        : "rgba(16, 185, 129, 0.3)"
                    }`,
                  }}
                >
                  <Icon size={24} color="white" />
                </div>
              </div>
              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  color: "var(--color-text)",
                  letterSpacing: "-0.03em",
                  marginBottom: "4px",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--color-text-muted)",
                  fontWeight: "500",
                }}
              >
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Two column layout */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}
      >
        {/* Recent Appointments */}
        <div
          className="card"
          style={{
            overflow: "hidden",
            animation: "fadeIn 0.5s ease-out 200ms both",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.5rem",
              borderBottom: "1px solid var(--color-border-light)",
            }}
          >
            <div>
              <p
                style={{
                  fontWeight: "700",
                  color: "var(--color-text)",
                  fontSize: "1.05rem",
                }}
              >
                My Appointments
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--color-text-muted)",
                  marginTop: "4px",
                }}
              >
                Your upcoming visits
              </p>
            </div>
            <button
              onClick={() => navigate("/patient/appointments")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--color-primary)",
                fontSize: "0.85rem",
                fontWeight: "600",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: "8px 14px",
                borderRadius: "10px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-primary-light)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              View all <ArrowRight size={16} />
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="empty-state" style={{ padding: "3rem 1.5rem" }}>
              <div className="empty-state-icon">
                <CalendarDays size={24} color="var(--color-text-muted)" />
              </div>
              <h3>No appointments yet</h3>
              <p>Book your first appointment</p>
            </div>
          ) : (
            <div>
              {appointments.slice(0, 4).map((appt, i) => (
                <div
                  key={appt.id}
                  style={{
                    padding: "1rem 1.5rem",
                    borderBottom:
                      i < Math.min(appointments.length, 4) - 1
                        ? "1px solid var(--color-border-light)"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--color-bg-subtle)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "14px" }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background:
                          "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "700",
                        fontSize: "1rem",
                        boxShadow: "0 4px 12px rgba(14, 165, 233, 0.2)",
                      }}
                    >
                      {appt.doctor?.name?.[0]}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: "var(--color-text)",
                        }}
                      >
                        {appt.doctor?.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--color-text-muted)",
                          marginTop: "3px",
                        }}
                      >
                        {formatDateTime(appt.date)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div
          className="card"
          style={{
            overflow: "hidden",
            animation: "fadeIn 0.5s ease-out 260ms both",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.5rem",
              borderBottom: "1px solid var(--color-border-light)",
            }}
          >
            <div>
              <p
                style={{
                  fontWeight: "700",
                  color: "var(--color-text)",
                  fontSize: "1.05rem",
                }}
              >
                My Prescriptions
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--color-text-muted)",
                  marginTop: "4px",
                }}
              >
                Recent medications
              </p>
            </div>
            <button
              onClick={() => navigate("/patient/prescriptions")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--color-primary)",
                fontSize: "0.85rem",
                fontWeight: "600",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: "8px 14px",
                borderRadius: "10px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-primary-light)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              View all <ArrowRight size={16} />
            </button>
          </div>

          {prescriptions.length === 0 ? (
            <div className="empty-state" style={{ padding: "3rem 1.5rem" }}>
              <div className="empty-state-icon">
                <FileText size={24} color="var(--color-text-muted)" />
              </div>
              <h3>No prescriptions yet</h3>
              <p>Your prescriptions will appear here</p>
            </div>
          ) : (
            <div>
              {prescriptions.slice(0, 4).map((presc, i) => (
                <div
                  key={presc.id}
                  style={{
                    padding: "1rem 1.5rem",
                    borderBottom:
                      i < Math.min(prescriptions.length, 4) - 1
                        ? "1px solid var(--color-border-light)"
                        : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--color-bg-subtle)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "var(--color-text)",
                      }}
                    >
                      {presc.diagnosis}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {formatDateTime(presc.createdAt)}
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {presc.doctor?.name}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-muted)",
                      marginTop: "4px",
                    }}
                  >
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
