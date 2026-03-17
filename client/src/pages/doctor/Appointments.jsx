import { useState, useEffect } from "react";
import { CalendarDays, Clock, CheckCircle, XCircle } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getDoctorAppointments, updateAppointmentStatus } from "../../api/appointments";
import { formatDateTime, getStatusColor } from "../../lib/utils";

const filters = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await getDoctorAppointments(statusFilter ? { status: statusFilter } : {});
      setAppointments(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, [statusFilter]);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await updateAppointmentStatus(id, { status });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <PageWrapper title="Appointments" subtitle="Manage and update patient appointments">

      {/* Filter Pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "0.84rem",
              fontWeight: "700",
              border: statusFilter === f.value ? "none" : "1.5px solid #e2e8f0",
              background: statusFilter === f.value ? "#0f172a" : "white",
              color: statusFilter === f.value ? "white" : "#64748b",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s ease",
              boxShadow: statusFilter === f.value ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Appointments */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "16rem" }}>
          <div style={{
            width: "32px", height: "32px",
            border: "3px solid #2563eb", borderTopColor: "transparent",
            borderRadius: "50%", animation: "spin 0.8s linear infinite",
          }} />
        </div>
      ) : appointments.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">
            <CalendarDays size={24} color="#94a3b8" />
          </div>
          <h3>No appointments found</h3>
          <p>Try changing the filter above</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {appointments.map((appt, i) => (
            <div key={appt.id} className="card" style={{
              padding: "1.25rem 1.5rem",
              animation: `fadeIn 0.35s ease-out ${i * 40}ms both`,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div className="avatar avatar-md" style={{ background: "#eff6ff", color: "#2563eb" }}>
                    {appt.patient?.name?.[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.95rem" }}>{appt.patient?.name}</p>
                    <p style={{ fontSize: "0.84rem", color: "#64748b", marginTop: "3px" }}>{appt.reason}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                      <Clock size={12} color="#94a3b8" />
                      <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{formatDateTime(appt.date)}</p>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className={`status-badge ${getStatusColor(appt.status)}`}>
                    {appt.status}
                  </span>

                  {appt.status === "PENDING" && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleStatusUpdate(appt.id, "CONFIRMED")}
                        disabled={updating === appt.id}
                        className="btn btn-primary"
                        style={{ padding: "6px 14px", fontSize: "0.75rem", borderRadius: "9px" }}
                      >
                        <CheckCircle size={13} /> Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(appt.id, "CANCELLED")}
                        disabled={updating === appt.id}
                        className="btn btn-danger"
                        style={{ padding: "6px 14px", fontSize: "0.75rem", borderRadius: "9px" }}
                      >
                        <XCircle size={13} /> Cancel
                      </button>
                    </div>
                  )}

                  {appt.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleStatusUpdate(appt.id, "COMPLETED")}
                      disabled={updating === appt.id}
                      className="btn btn-success"
                      style={{ padding: "6px 14px", fontSize: "0.75rem", borderRadius: "9px" }}
                    >
                      <CheckCircle size={13} /> Mark Complete
                    </button>
                  )}
                </div>
              </div>

              {appt.notes && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
                  <p style={{ fontSize: "0.84rem", color: "#64748b", background: "#f8fafc", borderRadius: "10px", padding: "10px 14px" }}>{appt.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}