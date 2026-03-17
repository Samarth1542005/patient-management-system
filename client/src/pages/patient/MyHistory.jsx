import { useState, useEffect } from "react";
import { Heart, Activity } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getPatientHistory } from "../../api/patients";
import { formatDate, formatDateTime } from "../../lib/utils";
import useAuthStore from "../../store/authStore";

function SeverityBadge({ severity }) {
  const styles = {
    MILD: { background: "#f0fdf4", color: "#059669" },
    MODERATE: { background: "#fffbeb", color: "#d97706" },
    SEVERE: { background: "#fef2f2", color: "#dc2626" },
  };
  const s = styles[severity] || { background: "#f8fafc", color: "#64748b" };
  return (
    <span style={{
      fontSize: "0.7rem", fontWeight: "700",
      padding: "4px 10px", borderRadius: "999px",
      background: s.background, color: s.color
    }}>
      {severity}
    </span>
  );
}

export default function MyHistory() {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("conditions");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const patientId = user?.patient?.id;
        if (!patientId) return;
        const res = await getPatientHistory(patientId);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <PageWrapper title="My Health History">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "16rem" }}>
          <div style={{
            width: "28px", height: "28px",
            border: "3px solid #2563eb", borderTopColor: "transparent",
            borderRadius: "50%", animation: "spin 0.8s linear infinite"
          }} />
        </div>
      </PageWrapper>
    );
  }

  const { medicalHistory, vitalSigns } = data || {};

  const tabs = [
    { key: "conditions", label: "Medical Conditions", icon: Heart },
    { key: "vitals", label: "Vital Signs", icon: Activity },
  ];

  return (
    <PageWrapper title="My Health History" subtitle="Your medical conditions and vital signs over time">

      {/* Tabs */}
      <div style={{
        display: "inline-flex", background: "#f1f5f9",
        borderRadius: "12px", padding: "4px", marginBottom: "1.5rem"
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 18px", borderRadius: "9px", border: "none",
                background: activeTab === tab.key ? "white" : "transparent",
                color: activeTab === tab.key ? "#2563eb" : "#64748b",
                fontWeight: "700", fontSize: "0.875rem",
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: activeTab === tab.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s"
              }}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Medical Conditions */}
      {activeTab === "conditions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {medicalHistory?.length === 0 ? (
            <div style={{
              background: "white", borderRadius: "16px",
              border: "1px solid #f1f5f9", padding: "4rem",
              textAlign: "center"
            }}>
              <Heart size={36} color="#cbd5e1" style={{ margin: "0 auto 0.75rem" }} />
              <p style={{ color: "#475569", fontWeight: "600" }}>No medical conditions recorded</p>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "4px" }}>Your doctor will add conditions here</p>
            </div>
          ) : medicalHistory?.map((item) => (
            <div key={item.id} style={{
              background: "white", borderRadius: "16px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              padding: "1.25rem 1.5rem",
              display: "flex", alignItems: "flex-start", justifyContent: "space-between"
            }}>
              <div>
                <p style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.95rem" }}>{item.condition}</p>
                <div style={{ display: "flex", gap: "16px", marginTop: "6px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                    Diagnosed: {formatDate(item.diagnosedAt)}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: item.resolvedAt ? "#059669" : "#d97706" }}>
                    {item.resolvedAt ? `Resolved: ${formatDate(item.resolvedAt)}` : "Ongoing"}
                  </p>
                </div>
                {item.notes && (
                  <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "8px" }}>{item.notes}</p>
                )}
              </div>
              <SeverityBadge severity={item.severity} />
            </div>
          ))}
        </div>
      )}

      {/* Vital Signs */}
      {activeTab === "vitals" && (
        <div style={{
          background: "white", borderRadius: "16px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          overflow: "hidden"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                {["Date", "Blood Pressure", "Heart Rate", "Temperature", "Weight", "SpO2"].map((h) => (
                  <th key={h} style={{
                    textAlign: "left", padding: "12px 20px",
                    fontSize: "0.7rem", fontWeight: "700",
                    color: "#94a3b8", textTransform: "uppercase",
                    letterSpacing: "0.06em"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vitalSigns?.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "4rem", textAlign: "center" }}>
                    <Activity size={32} color="#cbd5e1" style={{ margin: "0 auto 0.75rem" }} />
                    <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>No vital signs recorded</p>
                  </td>
                </tr>
              ) : vitalSigns?.map((v, i) => (
                <tr key={v.id} style={{
                  borderBottom: i < vitalSigns.length - 1 ? "1px solid #f8fafc" : "none"
                }}>
                  <td style={{ padding: "14px 20px", fontSize: "0.8rem", color: "#64748b" }}>{formatDateTime(v.recordedAt)}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{
                      fontSize: "0.875rem", fontWeight: "600", color: "#0f172a",
                      background: "#f8fafc", padding: "3px 10px", borderRadius: "6px"
                    }}>{v.bloodPressure || "—"}</span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "0.875rem", color: "#0f172a" }}>
                    {v.heartRate ? `${v.heartRate} bpm` : "—"}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "0.875rem", color: "#0f172a" }}>
                    {v.temperature ? `${v.temperature}°C` : "—"}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "0.875rem", color: "#0f172a" }}>
                    {v.weight ? `${v.weight} kg` : "—"}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "0.875rem", color: "#0f172a" }}>
                    {v.oxygenSat ? `${v.oxygenSat}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWrapper>
  );
}