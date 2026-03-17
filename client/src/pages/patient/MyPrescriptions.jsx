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
            width: "28px", height: "28px",
            border: "3px solid #2563eb", borderTopColor: "transparent",
            borderRadius: "50%", animation: "spin 0.8s linear infinite"
          }} />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="My Prescriptions" subtitle="All your prescriptions from doctors">
      {prescriptions.length === 0 ? (
        <div style={{
          background: "white", borderRadius: "16px",
          border: "1px solid #f1f5f9", padding: "4rem",
          textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
        }}>
          <FileText size={36} color="#cbd5e1" style={{ margin: "0 auto 0.75rem" }} />
          <p style={{ color: "#475569", fontWeight: "600", marginBottom: "4px" }}>No prescriptions yet</p>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Your prescriptions will appear here</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {prescriptions.map((presc) => (
            <div key={presc.id} style={{
              background: "white", borderRadius: "16px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              overflow: "hidden"
            }}>
              {/* Header */}
              <div style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #f8fafc",
                display: "flex", alignItems: "flex-start", justifyContent: "space-between"
              }}>
                <div>
                  <p style={{ fontWeight: "700", color: "#0f172a", fontSize: "1rem" }}>{presc.diagnosis}</p>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "3px" }}>
                    Dr. {presc.doctor?.name}
                    {presc.doctor?.specialization && ` — ${presc.doctor.specialization}`}
                  </p>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", flexShrink: 0, marginLeft: "1rem" }}>
                  {formatDateTime(presc.createdAt)}
                </p>
              </div>

              {/* Notes */}
              {presc.notes && (
                <div style={{
                  padding: "0.875rem 1.5rem",
                  borderBottom: "1px solid #f8fafc",
                  background: "#fafafa"
                }}>
                  <p style={{ fontSize: "0.875rem", color: "#64748b", fontStyle: "italic" }}>{presc.notes}</p>
                </div>
              )}

              {/* Medicines */}
              <div style={{ padding: "1rem 1.5rem" }}>
                <p style={{
                  fontSize: "0.7rem", fontWeight: "700",
                  color: "#94a3b8", textTransform: "uppercase",
                  letterSpacing: "0.08em", marginBottom: "0.75rem"
                }}>
                  Medicines ({presc.medicines?.length})
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {presc.medicines?.map((med) => (
                    <div key={med.id} style={{
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between",
                      background: "#f8fafc", borderRadius: "10px",
                      padding: "10px 14px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "8px", height: "8px",
                          borderRadius: "50%", background: "#2563eb",
                          flexShrink: 0
                        }} />
                        <p style={{ fontWeight: "600", color: "#0f172a", fontSize: "0.875rem" }}>{med.name}</p>
                        <span style={{
                          fontSize: "0.75rem", color: "#64748b",
                          background: "#eff6ff", padding: "2px 8px",
                          borderRadius: "6px", fontWeight: "600"
                        }}>{med.dosage}</span>
                      </div>
                      <div style={{ display: "flex", gap: "16px" }}>
                        <p style={{ fontSize: "0.8rem", color: "#64748b" }}>{med.frequency}</p>
                        <p style={{ fontSize: "0.8rem", color: "#64748b" }}>{med.duration}</p>
                        {med.instructions && (
                          <p style={{ fontSize: "0.8rem", color: "#94a3b8", fontStyle: "italic" }}>{med.instructions}</p>
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