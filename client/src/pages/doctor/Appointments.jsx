import { useState, useEffect } from "react";
import { CalendarDays, Clock, CheckCircle, XCircle, CalendarClock, Plus, Trash2 } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getDoctorAppointments, updateAppointmentStatus, suggestSlots } from "../../api/appointments";
import { formatDateTime, getStatusColor } from "../../lib/utils";

const filters = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Rescheduled", value: "RESCHEDULED" },
];

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [slots, setSlots] = useState([""]);
  const [doctorMessage, setDoctorMessage] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

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

  const openModal = (appt) => {
    setSelectedAppt(appt);
    setSlots([""]);
    setDoctorMessage("");
    setSuccessMsg("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAppt(null);
  };

  const handleSlotChange = (i, value) => {
    const updated = [...slots];
    updated[i] = value;
    setSlots(updated);
  };

  const addSlot = () => setSlots([...slots, ""]);

  const removeSlot = (i) => setSlots(slots.filter((_, idx) => idx !== i));

  const handleSuggestSlots = async () => {
    const validSlots = slots.filter((s) => s.trim() !== "");
    if (validSlots.length === 0) return;

    setSuggesting(true);
    try {
      await suggestSlots(selectedAppt.id, {
        suggestedSlots: validSlots,
        doctorMessage: doctorMessage.trim() || undefined,
      });
      setSuccessMsg("Slots suggested and email sent to patient!");
      fetchAppointments();
      setTimeout(() => closeModal(), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSuggesting(false);
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
                        onClick={() => openModal(appt)}
                        className="btn"
                        style={{
                          padding: "6px 14px", fontSize: "0.75rem", borderRadius: "9px",
                          background: "#f0f9ff", color: "#0369a1",
                          border: "1.5px solid #bae6fd", fontFamily: "inherit",
                          cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
                        }}
                      >
                        <CalendarClock size={13} /> Suggest Slots
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

      {/* Suggest Slots Modal */}
      {modalOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: "1rem",
        }}>
          <div style={{
            background: "white", borderRadius: "16px", padding: "2rem",
            width: "100%", maxWidth: "480px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            animation: "fadeIn 0.2s ease-out",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.1rem", fontWeight: "700" }}>Suggest New Slots</h3>
                <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "#64748b" }}>
                  For {selectedAppt?.patient?.name}
                </p>
              </div>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.4rem", color: "#94a3b8" }}>✕</button>
            </div>

            {/* Slot Inputs */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.84rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" }}>
                Available Slots
              </label>
              {slots.map((slot, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input
                    type="text"
                    value={slot}
                    onChange={(e) => handleSlotChange(i, e.target.value)}
                    placeholder="e.g. 2026-04-10 10:00 AM"
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: "10px",
                      border: "1.5px solid #e2e8f0", fontSize: "0.84rem",
                      fontFamily: "inherit", outline: "none",
                    }}
                  />
                  {slots.length > 1 && (
                    <button
                      onClick={() => removeSlot(i)}
                      style={{ background: "#fef2f2", border: "none", borderRadius: "10px", padding: "0 12px", cursor: "pointer", color: "#ef4444" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addSlot}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  background: "none", border: "1.5px dashed #cbd5e1",
                  borderRadius: "10px", padding: "8px 14px",
                  fontSize: "0.84rem", color: "#64748b", cursor: "pointer",
                  fontFamily: "inherit", width: "100%", justifyContent: "center",
                  marginTop: "4px",
                }}
              >
                <Plus size={14} /> Add another slot
              </button>
            </div>

            {/* Doctor Message */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "0.84rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" }}>
                Message to Patient <span style={{ color: "#94a3b8", fontWeight: "400" }}>(optional)</span>
              </label>
              <textarea
                value={doctorMessage}
                onChange={(e) => setDoctorMessage(e.target.value)}
                placeholder="e.g. Please choose a slot that works for you."
                rows={3}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "10px",
                  border: "1.5px solid #e2e8f0", fontSize: "0.84rem",
                  fontFamily: "inherit", outline: "none", resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {successMsg && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "10px 14px", marginBottom: "1rem" }}>
                <p style={{ margin: 0, color: "#15803d", fontSize: "0.84rem", fontWeight: "600" }}>✅ {successMsg}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={closeModal}
                style={{
                  flex: 1, padding: "10px", borderRadius: "10px",
                  border: "1.5px solid #e2e8f0", background: "white",
                  color: "#64748b", fontFamily: "inherit", fontSize: "0.84rem",
                  fontWeight: "600", cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSuggestSlots}
                disabled={suggesting || slots.every((s) => s.trim() === "")}
                style={{
                  flex: 2, padding: "10px", borderRadius: "10px",
                  border: "none", background: "#2563eb",
                  color: "white", fontFamily: "inherit", fontSize: "0.84rem",
                  fontWeight: "600", cursor: "pointer",
                  opacity: suggesting ? 0.7 : 1,
                }}
              >
                {suggesting ? "Sending..." : "Send Slot Suggestions"}
              </button>
            </div>
          </div>
        </div>
      )}

    </PageWrapper>
  );
}