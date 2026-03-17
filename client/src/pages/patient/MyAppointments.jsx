import { useState, useEffect } from "react";
import { CalendarDays, Plus, Clock, X } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyAppointments, bookAppointment, cancelAppointment } from "../../api/appointments";
import { getAllDoctors } from "../../api/doctors";
import { formatDateTime } from "../../lib/utils";

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

  return (
    <PageWrapper
      title="My Appointments"
      subtitle="View and manage your appointments"
      action={
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Book Appointment
        </button>
      }
    >
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
          <div className="empty-state-icon"><CalendarDays size={24} color="#94a3b8" /></div>
          <h3>No appointments yet</h3>
          <p>Book your first appointment above</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {appointments.map((appt, i) => (
            <div key={appt.id} className="card" style={{
              padding: "1.25rem 1.5rem",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              animation: `fadeIn 0.35s ease-out ${i * 40}ms both`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div className="avatar avatar-md" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  {appt.doctor?.name?.[0]}
                </div>
                <div>
                  <p style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.95rem" }}>{appt.doctor?.name}</p>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px" }}>{appt.doctor?.specialization}</p>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "3px" }}>{appt.reason}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "5px" }}>
                    <Clock size={11} color="#94a3b8" />
                    <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{formatDateTime(appt.date)}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <StatusBadge status={appt.status} />
                {appt.status === "PENDING" && (
                  <button
                    onClick={() => handleCancel(appt.id)}
                    disabled={cancelling === appt.id}
                    className="btn btn-danger"
                    style={{
                      padding: "6px 14px", fontSize: "0.8rem",
                      opacity: cancelling === appt.id ? 0.5 : 1,
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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: "800", color: "#0f172a", fontSize: "1.1rem" }}>Book Appointment</h3>
              <button onClick={() => setShowModal(false)} style={{
                background: "#f1f5f9", border: "none", borderRadius: "8px",
                width: "32px", height: "32px", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", transition: "background 0.15s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#e2e8f0"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#f1f5f9"}
              >
                <X size={16} color="#64748b" />
              </button>
            </div>

            {error && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                color: "#dc2626", padding: "10px 14px",
                borderRadius: "10px", marginBottom: "1rem", fontSize: "0.84rem",
              }}>{error}</div>
            )}

            <form onSubmit={handleBook} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">Select Doctor</label>
                <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required className="form-input">
                  <option value="">Choose a doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Date & Time</label>
                <input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="form-input" />
              </div>

              <div>
                <label className="form-label">Reason</label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Reason for appointment..."
                  rows={3} required
                  className="form-input"
                  style={{ resize: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{
                  flex: 1,
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
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