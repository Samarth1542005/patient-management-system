import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CalendarDays,
  FileText,
  Clock,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  X,
  Sparkles,
} from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getDoctorStats, verifyNMC, getMyProfile } from "../../api/doctors";
import { getDoctorAppointments } from "../../api/appointments";
import { formatDateTime, getStatusColor } from "../../lib/utils";
import useAuthStore from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";

const StatCard = ({ title, value, icon: Icon, gradient, delay }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="card"
      style={{
        padding: "1.5rem",
        animation: `fadeIn 0.4s ease-out ${delay}ms both`,
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
          background: `radial-gradient(circle, ${gradient}15 0%, transparent 70%)`,
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
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 15px ${gradient}30`,
          }}
        >
          <Icon size={24} color="white" />
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.7rem",
            fontWeight: "700",
            color: "#10b981",
            background: isDark ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5",
            padding: "4px 10px",
            borderRadius: "999px",
          }}
        >
          <TrendingUp size={11} />
          Active
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
        {value}
      </p>
      <p
        style={{
          fontSize: "0.9rem",
          color: "var(--color-text-muted)",
          fontWeight: "500",
        }}
      >
        {title}
      </p>
    </div>
  );
};

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDark = theme === "dark";

  // NMC verification states
  const [isVerified, setIsVerified] = useState(false);
  const [showNMCForm, setShowNMCForm] = useState(false);
  const [nmcNumber, setNmcNumber] = useState("");
  const [nmcLoading, setNmcLoading] = useState(false);
  const [nmcError, setNmcError] = useState("");
  const [nmcSuccess, setNmcSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, apptRes, profileRes] = await Promise.all([
          getDoctorStats(),
          getDoctorAppointments(),
          getMyProfile(),
        ]);
        setStats(statsRes.data.data);
        setAppointments(apptRes.data.data.slice(0, 6));
        setIsVerified(profileRes.data.data.isVerified);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNMCSubmit = async () => {
    if (!nmcNumber.trim()) {
      setNmcError("Please enter your NMC number.");
      return;
    }
    setNmcLoading(true);
    setNmcError("");
    setNmcSuccess("");
    try {
      await verifyNMC(nmcNumber.trim());
      setIsVerified(true);
      setNmcSuccess("Your profile is now verified!");
      setShowNMCForm(false);
    } catch (err) {
      setNmcError(err.response?.data?.message || "Verification failed. Try again.");
    } finally {
      setNmcLoading(false);
    }
  };

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

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const firstName = user?.doctor?.name?.replace(/^Dr\.\s*/i, "").split(" ")[0] || "Doctor";

  return (
    <PageWrapper
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {`Good day, Dr. ${firstName}`}
            <Sparkles size={20} color="var(--color-primary)" />
          </span>
          {isVerified && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                backgroundColor: isDark ? "rgba(16, 185, 129, 0.15)" : "#dcfce7",
                color: "#10b981",
                fontSize: "0.75rem",
                fontWeight: "700",
                padding: "5px 12px",
                borderRadius: "999px",
                border: `1px solid ${isDark ? "rgba(16, 185, 129, 0.2)" : "#bbf7d0"}`,
              }}
            >
              <ShieldCheck size={13} />
              Verified
            </span>
          )}
        </div>
      }
      subtitle={today}
    >
      {/* NMC Verified success flash */}
      {nmcSuccess && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: isDark ? "rgba(16, 185, 129, 0.1)" : "#f0fdf4",
            border: `1px solid ${isDark ? "rgba(16, 185, 129, 0.2)" : "#bbf7d0"}`,
            borderRadius: "14px",
            padding: "16px 20px",
            marginBottom: "1.5rem",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ShieldCheck size={20} color="#10b981" />
            <span style={{ color: "#10b981", fontWeight: "600", fontSize: "0.9rem" }}>
              {nmcSuccess}
            </span>
          </div>
          <button
            onClick={() => setNmcSuccess("")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
          >
            <X size={18} color="#10b981" />
          </button>
        </div>
      )}

      {/* NMC Verification Banner — only show if not verified */}
      {!isVerified && (
        <div
          style={{
            backgroundColor: isDark ? "rgba(245, 158, 11, 0.1)" : "#fffbeb",
            border: `1px solid ${isDark ? "rgba(245, 158, 11, 0.2)" : "#fde68a"}`,
            borderRadius: "16px",
            padding: "18px 22px",
            marginBottom: "1.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 15px rgba(245, 158, 11, 0.25)",
              }}
            >
              <ShieldAlert size={22} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: "700", color: isDark ? "#fbbf24" : "#92400e", fontSize: "0.95rem" }}>
                Your profile is not verified
              </p>
              <p style={{ color: isDark ? "#fcd34d" : "#b45309", fontSize: "0.85rem", marginTop: "3px" }}>
                Enter your NMC registration number to get a verified badge
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNMCForm(!showNMCForm)}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 15px rgba(245, 158, 11, 0.25)",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
            }}
          >
            {showNMCForm ? "Cancel" : "Verify Now"}
          </button>
        </div>
      )}

      {/* NMC Form */}
      {showNMCForm && !isVerified && (
        <div
          className="card"
          style={{
            padding: "1.5rem",
            marginBottom: "1.75rem",
          }}
        >
          <p
            style={{
              fontWeight: "700",
              color: "var(--color-text)",
              fontSize: "1rem",
              marginBottom: "6px",
            }}
          >
            Enter NMC Registration Number
          </p>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Format: STATE-YEAR-XXXXX (e.g. MH-2019-12345)
          </p>

          {nmcError && (
            <div
              style={{
                backgroundColor: isDark ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
                border: `1px solid ${isDark ? "rgba(239, 68, 68, 0.2)" : "#fecaca"}`,
                borderRadius: "12px",
                padding: "12px 16px",
                color: "#ef4444",
                fontSize: "0.875rem",
                marginBottom: "1rem",
              }}
            >
              {nmcError}
            </div>
          )}

          <div style={{ display: "flex", gap: "12px" }}>
            <input
              type="text"
              value={nmcNumber}
              onChange={(e) => setNmcNumber(e.target.value)}
              placeholder="e.g. MH-2019-12345"
              className="form-input"
              style={{ flex: 1 }}
            />
            <button
              onClick={handleNMCSubmit}
              disabled={nmcLoading}
              style={{
                padding: "12px 24px",
                background: nmcLoading
                  ? "var(--color-text-muted)"
                  : "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: nmcLoading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                boxShadow: nmcLoading ? "none" : "0 4px 15px rgba(14, 165, 233, 0.25)",
                fontFamily: "inherit",
              }}
            >
              {nmcLoading ? "Verifying..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          title="Total Patients"
          value={stats?.totalPatients ?? 0}
          icon={Users}
          gradient="linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)"
          delay={0}
        />
        <StatCard
          title="Pending"
          value={stats?.pendingAppointments ?? 0}
          icon={Clock}
          gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          delay={60}
        />
        <StatCard
          title="Confirmed"
          value={stats?.confirmedAppointments ?? 0}
          icon={CalendarDays}
          gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
          delay={120}
        />
        <StatCard
          title="Prescriptions"
          value={stats?.totalPrescriptions ?? 0}
          icon={FileText}
          gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          delay={180}
        />
      </div>

      {/* Recent Appointments */}
      <div
        className="card"
        style={{ overflow: "hidden", animation: "fadeIn 0.5s ease-out 200ms both" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem",
            borderBottom: `1px solid var(--color-border-light)`,
          }}
        >
          <div>
            <h3
              style={{
                fontWeight: "700",
                color: "var(--color-text)",
                fontSize: "1.05rem",
              }}
            >
              Recent Appointments
            </h3>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--color-text-muted)",
                marginTop: "4px",
              }}
            >
              Latest patient appointments
            </p>
          </div>
          <button
            onClick={() => navigate("/doctor/appointments")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--color-primary)",
              fontSize: "0.85rem",
              fontWeight: "600",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              padding: "8px 14px",
              borderRadius: "10px",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-primary-light)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            View all <ArrowRight size={16} />
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <CalendarDays size={24} color="var(--color-text-muted)" />
            </div>
            <h3>No appointments yet</h3>
            <p>Appointments will appear here</p>
          </div>
        ) : (
          <div>
            {appointments.map((appt, i) => (
              <div
                key={appt.id}
                style={{
                  padding: "1rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom:
                    i < appointments.length - 1 ? "1px solid var(--color-border-light)" : "none",
                  transition: "background 0.15s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bg-subtle)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "700",
                      fontSize: "1rem",
                      boxShadow: "0 4px 12px rgba(14, 165, 233, 0.2)",
                    }}
                  >
                    {appt.patient?.name?.[0]}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: "600",
                        color: "var(--color-text)",
                      }}
                    >
                      {appt.patient?.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--color-text-muted)",
                        marginTop: "3px",
                      }}
                    >
                      {appt.reason}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                    {formatDateTime(appt.date)}
                  </p>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                      appt.status
                    )}`}
                  >
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
