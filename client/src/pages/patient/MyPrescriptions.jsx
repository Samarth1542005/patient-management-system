import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyPrescriptions } from "../../api/prescriptions";
import { formatDateTime } from "../../lib/utils";

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await getMyPrescriptions();
        setPrescriptions(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <PageWrapper title="My Prescriptions">
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

  return (
    <PageWrapper title="My Prescriptions" subtitle="All your prescriptions from doctors">
      {prescriptions.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon"><FileText size={22} color="#94a3b8" /></div>
          <h3>No prescriptions yet</h3>
          <p>Your prescriptions will appear here</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {prescriptions.map((presc, i) => (
            <div key={presc.id} className="card" style={{
              overflow: "hidden",
              animation: `fadeIn 0.35s ease-out ${i * 50}ms both`,
            }}>
              {/* Header */}
              <div style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #f1f5f9",
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              }}>
                <div>
                  <p style={{ fontWeight: "700", color: "#0f172a", fontSize: "1rem" }}>{presc.diagnosis}</p>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
                    {presc.doctor?.name}
                    {presc.doctor?.specialization && ` — ${presc.doctor.specialization}`}
                  </p>
                </div>
                <p style={{ fontSize: "0.7rem", color: "#94a3b8", flexShrink: 0, marginLeft: "1rem" }}>
                  {formatDateTime(presc.createdAt)}
                </p>
              </div>

              {/* Notes */}
              {presc.notes && (
                <div style={{
                  padding: "0.875rem 1.5rem",
                  borderBottom: "1px solid #f1f5f9",
                  background: "#fafbfc",
                }}>
                  <p style={{ fontSize: "0.84rem", color: "#64748b", fontStyle: "italic" }}>{presc.notes}</p>
                </div>
              )}

              {/* Medicines */}
              <div style={{ padding: "1rem 1.5rem" }}>
                <p style={{
                  fontSize: "0.65rem", fontWeight: "700",
                  color: "#94a3b8", textTransform: "uppercase",
                  letterSpacing: "0.08em", marginBottom: "0.75rem",
                }}>
                  Medicines ({presc.medicines?.length})
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {presc.medicines?.map((med) => (
                    <div key={med.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "#f8fafc", borderRadius: "10px",
                      padding: "10px 14px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "8px", height: "8px",
                          borderRadius: "50%", background: "#2563eb",
                          flexShrink: 0,
                        }} />
                        <p style={{ fontWeight: "600", color: "#0f172a", fontSize: "0.84rem" }}>{med.name}</p>
                        <span style={{
                          fontSize: "0.7rem", color: "#2563eb",
                          background: "#eff6ff", padding: "2px 8px",
                          borderRadius: "6px", fontWeight: "600",
                        }}>{med.dosage}</span>
                      </div>
                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <p style={{ fontSize: "0.75rem", color: "#64748b" }}>{med.frequency}</p>
                        <p style={{ fontSize: "0.75rem", color: "#64748b" }}>{med.duration}</p>
                        {med.instructions && (
                          <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>{med.instructions}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}