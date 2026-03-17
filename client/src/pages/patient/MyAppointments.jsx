import { useState, useEffect } from "react";
import { CalendarDays, Plus, Clock, X } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyAppointments, bookAppointment, cancelAppointment } from "../../api/appointments";
import { getAllDoctors } from "../../api/doctors";
import { formatDateTime } from "../../lib/utils";

const cardStyle = {
  background: "white", borderRadius: "16px",
  border: "1px solid #f1f5f9",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

function StatusBadge({ status }) {
  const styles = {
    PENDING: { background: "#fffbeb", color: "#d97706" },
    CONFIRMED: { background: "#eff6ff", color: "#2563eb" },
    COMPLETED: { background: "#f0fdf4", color: "#059669" },
    CANCELLED: { background: "#fef2f2", color: "#dc2626" },
  };
  const s = styles[status] || { background: "#f8fafc", color: "#64748b" };
  return (
    <span style={{
      fontSize: "0.7rem", fontWeight: "700",
      padding: "4px 10px", borderRadius: "999px",
      background: s.background, color: s.color
    }}>
      {status}
    </span>
  );
}

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const [form, setForm] = useState({ doctorId: "", date: "", reason: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apptRes, doctorRes] = await Promise.all([
        getMyAppointments(),
        getAllDoctors(),
      ]);
      setAppointments(apptRes.data.data);
      setDoctors(doctorRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await bookAppointment(form);
      setShowModal(false);
      setForm({ doctorId: "", date: "", reason: "" });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    setCancelling(id);
    try {
      await cancelAppointment(id);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(null);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    border: "1.5px solid #e2e8f0", borderRadius: "10px",
    fontSize: "0.875rem", color: "#0f172a",
    backgroundColor: "white", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit"
  };

  return (
    <PageWrapper
      title="My Appointments"
      subtitle="View and manage your appointments"
      action={
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 18px", background: "#2563eb",
            color: "white", border: "none", borderRadius: "10px",
            fontSize: "0.875rem", fontWeight: "700",
            cursor: "pointer", fontFamily: "inherit"
          }}
        >
          <Plus size={16} /> Book Appointment
        </button>
      }
    >
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "16rem" }}>
          <div style={{
            width: "28px", height: "28px",
            border: "3px solid #2563eb", borderTopColor: "transparent",
            borderRadius: "50%", animation: "spin 0.8s linear infinite"
          }} />
        </div>
      ) : appointments.length === 0 ? (
        <div style={{ ...cardStyle, padding: "4rem", textAlign: "center" }}>
          <CalendarDays size={36} color="#cbd5e1" style={{ margin: "0 auto 0.75rem" }} />
          <p style={{ color: "#475569", fontWeight: "600", marginBottom: "4px" }}>No appointments yet</p>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Book your first appointment above</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {appointments.map((appt) => (
            <div key={appt.id} style={{
              ...cardStyle, padding: "1.25rem 1.5rem",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: "#eff6ff", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "#2563eb",
                  fontWeight: "700", fontSize: "1rem", flexShrink: 0
                }}>
                  {appt.doctor?.name?.[0]}
                </div>
                <div>
                  <p style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.95rem" }}>{appt.doctor?.name}</p>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px" }}>{appt.doctor?.specialization}</p>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "3px" }}>{appt.reason}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "4px" }}>
                    <Clock size={11} color="#94a3b8" />
                    <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{formatDateTime(appt.date)}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <StatusBadge status={appt.status} />
                {appt.status === "PENDING" && (
                  <button
                    onClick={() => handleCancel(appt.id)}
                    disabled={cancelling === appt.id}
                    style={{
                      padding: "6px 14px", background: "#fef2f2",
                      color: "#dc2626", border: "none", borderRadius: "8px",
                      fontSize: "0.8rem", fontWeight: "700",
                      cursor: "pointer", fontFamily: "inherit",
                      opacity: cancelling === appt.id ? 0.5 : 1
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, padding: "1rem"
        }}>
          <div style={{
            background: "white", borderRadius: "20px",
            padding: "2rem", width: "100%", maxWidth: "440px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: "800", color: "#0f172a", fontSize: "1.1rem" }}>Book Appointment</h3>
              <button onClick={() => setShowModal(false)} style={{
                background: "#f1f5f9", border: "none", borderRadius: "8px",
                width: "32px", height: "32px", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer"
              }}>
                <X size={16} color="#64748b" />
              </button>
            </div>

            {error && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                color: "#dc2626", padding: "10px 14px",
                borderRadius: "10px", marginBottom: "1rem", fontSize: "0.875rem"
              }}>{error}</div>
            )}

            <form onSubmit={handleBook} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Select Doctor
                </label>
                <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required style={inputStyle}>
                  <option value="">Choose a doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Date & Time
                </label>
                <input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required style={inputStyle} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Reason
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Reason for appointment..."
                  rows={3} required
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex: 1, padding: "11px",
                  border: "1.5px solid #e2e8f0", borderRadius: "10px",
                  background: "white", color: "#64748b",
                  fontSize: "0.875rem", fontWeight: "700",
                  cursor: "pointer", fontFamily: "inherit"
                }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={{
                  flex: 1, padding: "11px",
                  background: submitting ? "#93c5fd" : "#2563eb",
                  color: "white", border: "none", borderRadius: "10px",
                  fontSize: "0.875rem", fontWeight: "700",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "inherit"
                }}>
                  {submitting ? "Booking..." : "Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}