import { useState, useEffect } from "react";
import { Heart, Activity } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getPatientHistory } from "../../api/patients";
import { formatDate, formatDateTime } from "../../lib/utils";
import useAuthStore from "../../store/authStore";

function SeverityBadge({ severity }) {
  const styles = {
    MILD: { background: "#ecfdf5", color: "#059669" },
    MODERATE: { background: "#fffbeb", color: "#d97706" },
    SEVERE: { background: "#fef2f2", color: "#dc2626" },
  };
  const s = styles[severity] || { background: "#f8fafc", color: "#64748b" };
  return (
    <span className="status-badge" style={{ background: s.background, color: s.color }}>
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
            width: "32px", height: "32px",
            border: "3px solid #2563eb", borderTopColor: "transparent",
            borderRadius: "50%", animation: "spin 0.8s linear infinite",
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
      <div className="tab-bar" style={{ marginBottom: "1.5rem" }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="animate-fade-in" key={activeTab}>

        {/* Medical Conditions */}
        {activeTab === "conditions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {medicalHistory?.length === 0 ? (
              <div className="card empty-state">
                <div className="empty-state-icon"><Heart size={22} color="#94a3b8" /></div>
                <h3>No medical conditions recorded</h3>
                <p>Your doctor will add conditions here</p>
              </div>
            ) : medicalHistory?.map((item, i) => (
              <div key={item.id} className="card" style={{
                padding: "1.25rem 1.5rem",
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                animation: `fadeIn 0.35s ease-out ${i * 50}ms both`,
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
                    <p style={{ fontSize: "0.84rem", color: "#64748b", marginTop: "8px" }}>{item.notes}</p>
                  )}
                </div>
                <SeverityBadge severity={item.severity} />
              </div>
            ))}
          </div>
        )}

        {/* Vital Signs */}
        {activeTab === "vitals" && (
          <div className="card" style={{ overflow: "hidden" }}>
            <table className="data-table">
              <thead>
                <tr>
                  {["Date", "Blood Pressure", "Heart Rate", "Temperature", "Weight", "SpO2"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vitalSigns?.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <div className="empty-state-icon"><Activity size={22} color="#94a3b8" /></div>
                        <h3>No vital signs recorded</h3>
                        <p>Your doctor will record vitals during visits</p>
                      </div>
                    </td>
                  </tr>
                ) : vitalSigns?.map((v) => (
                  <tr key={v.id}>
                    <td style={{ color: "#64748b", fontSize: "0.8rem" }}>{formatDateTime(v.recordedAt)}</td>
                    <td>
                      <span style={{
                        fontWeight: "600", color: "#0f172a",
                        background: "#f8fafc", padding: "3px 10px",
                        borderRadius: "6px", fontSize: "0.84rem",
                      }}>{v.bloodPressure || "—"}</span>
                    </td>
                    <td style={{ color: "#0f172a" }}>{v.heartRate ? `${v.heartRate} bpm` : "—"}</td>
                    <td style={{ color: "#0f172a" }}>{v.temperature ? `${v.temperature}°C` : "—"}</td>
                    <td style={{ color: "#0f172a" }}>{v.weight ? `${v.weight} kg` : "—"}</td>
                    <td style={{ color: "#0f172a" }}>{v.oxygenSat ? `${v.oxygenSat}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}