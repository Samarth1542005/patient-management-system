import { useState, useEffect } from "react";
import { FileText, Plus, X, Download } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getDoctorAppointments } from "../../api/appointments";
import { createPrescription, getPatientPrescriptions } from "../../api/prescriptions";
import { getAllPatients } from "../../api/patients";
import { formatDateTime } from "../../lib/utils";
import jsPDF from "jspdf";
import useAuthStore from "../../store/authStore";

const emptyMedicine = { name: "", dosage: "", frequency: "", duration: "", instructions: "" };

const downloadPrescriptionPDF = (presc, doctorName) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // ── Header ──────────────────────────────────────
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("MediCare", 20, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Patient Management System", 20, 27);
  doc.text("Prescription Report", pageWidth - 20, 27, { align: "right" });

  y = 55;

  // ── Prescription Info ────────────────────────────
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(presc.diagnosis, 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${formatDateTime(presc.createdAt)}`, 20, y);
  y += 7;

  // ── Doctor Info ──────────────────────────────────
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 28, 3, 3, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Prescribed by", 22, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235);
  doc.text(doctorName || presc.doctor?.name || "Doctor", 22, y + 18);

  if (presc.patient?.name) {
    doc.setTextColor(100, 116, 139);
    doc.text(`Patient: ${presc.patient.name}`, pageWidth - 20, y + 18, { align: "right" });
  }

  y += 38;

  // ── Notes ────────────────────────────────────────
  if (presc.notes) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Doctor's Notes", 20, y);
    y += 7;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    const noteLines = doc.splitTextToSize(presc.notes, pageWidth - 40);
    doc.text(noteLines, 20, y);
    y += noteLines.length * 6 + 8;
  }

  // ── Divider ──────────────────────────────────────
  doc.setDrawColor(226, 232, 240);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;

  // ── Medicines ────────────────────────────────────
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`Medicines (${presc.medicines?.length || 0})`, 20, y);
  y += 10;

  // Table Header
  doc.setFillColor(37, 99, 235);
  doc.rect(15, y, pageWidth - 30, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Medicine", 22, y + 7);
  doc.text("Dosage", 90, y + 7);
  doc.text("Frequency", 125, y + 7);
  doc.text("Duration", 165, y + 7);
  y += 10;

  // Medicine Rows
  presc.medicines?.forEach((med, index) => {
    if (y > 260) { doc.addPage(); y = 20; }

    const rowBg = index % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
    doc.setFillColor(...rowBg);
    doc.rect(15, y, pageWidth - 30, 12, "F");

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(med.name, 22, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(37, 99, 235);
    doc.text(med.dosage || "-", 90, y + 8);

    doc.setTextColor(100, 116, 139);
    doc.text(med.frequency || "-", 125, y + 8);
    doc.text(med.duration || "-", 165, y + 8);

    if (med.instructions) {
      y += 12;
      doc.setFillColor(...rowBg);
      doc.rect(15, y, pageWidth - 30, 8, "F");
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text(`  Instructions: ${med.instructions}`, 22, y + 5);
    }

    y += 12;
  });

  // ── Footer ───────────────────────────────────────
  y += 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(20, y, pageWidth - 20, y);
  y += 8;

  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(148, 163, 184);
  doc.text("This prescription was generated digitally by MediCare.", 20, y);
  doc.text("Please consult your doctor before making any changes.", 20, y + 5);
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, pageWidth - 20, y, { align: "right" });

  doc.save(`prescription-${presc.diagnosis.replace(/\s+/g, "-").toLowerCase()}.pdf`);
};

export default function DoctorPrescriptions() {
  const { user } = useAuthStore();
  const [prescriptions, setPrescriptions] = useState([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    appointmentId: "",
    diagnosis: "",
    notes: "",
    medicines: [{ ...emptyMedicine }],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apptRes, patientRes] = await Promise.all([
        getDoctorAppointments({ status: "CONFIRMED" }),
        getAllPatients(),
      ]);
      setConfirmedAppointments(apptRes.data.data);
      setPatients(patientRes.data.data.patients);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async (patientId) => {
    if (!patientId) return;
    try {
      const res = await getPatientPrescriptions(patientId);
      setPrescriptions(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { fetchPrescriptions(selectedPatient); }, [selectedPatient]);

  const handleMedicineChange = (index, field, value) => {
    const updated = [...form.medicines];
    updated[index][field] = value;
    setForm({ ...form, medicines: updated });
  };

  const addMedicine = () => {
    setForm({ ...form, medicines: [...form.medicines, { ...emptyMedicine }] });
  };

  const removeMedicine = (index) => {
    setForm({ ...form, medicines: form.medicines.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPrescription(form);
      setShowModal(false);
      setForm({ appointmentId: "", diagnosis: "", notes: "", medicines: [{ ...emptyMedicine }] });
      fetchData();
      if (selectedPatient) fetchPrescriptions(selectedPatient);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageWrapper title="Prescriptions" subtitle="Write and manage prescriptions">

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="form-input"
          style={{ maxWidth: "280px" }}
        >
          <option value="">Select a patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> New Prescription
        </button>
      </div>

      {/* Prescriptions List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {!selectedPatient ? (
          <div className="card empty-state">
            <div className="empty-state-icon"><FileText size={22} color="#94a3b8" /></div>
            <h3>Select a patient</h3>
            <p>Choose a patient above to view their prescriptions</p>
          </div>
        ) : loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "16rem" }}>
            <div style={{
              width: "32px", height: "32px",
              border: "3px solid #2563eb", borderTopColor: "transparent",
              borderRadius: "50%", animation: "spin 0.8s linear infinite",
            }} />
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon"><FileText size={22} color="#94a3b8" /></div>
            <h3>No prescriptions</h3>
            <p>No prescriptions found for this patient</p>
          </div>
        ) : (
          prescriptions.map((presc, i) => (
            <div key={presc.id} className="card" style={{
              padding: "1.5rem",
              animation: `fadeIn 0.35s ease-out ${i * 50}ms both`,
            }}>
              <div style={{
                display: "flex", alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: presc.notes ? "0.75rem" : "1rem",
              }}>
                <div>
                  <h3 style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.95rem" }}>{presc.diagnosis}</h3>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "3px" }}>{formatDateTime(presc.createdAt)}</p>
                </div>
                <button
                  onClick={() => downloadPrescriptionPDF(presc, user?.doctor?.name)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "7px 12px",
                    backgroundColor: "#eff6ff",
                    color: "#2563eb",
                    border: "1px solid #bfdbfe",
                    borderRadius: "8px",
                    fontSize: "0.75rem", fontWeight: "600",
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2563eb";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#eff6ff";
                    e.currentTarget.style.color = "#2563eb";
                  }}
                >
                  <Download size={13} />
                  PDF
                </button>
              </div>

              {presc.notes && (
                <p style={{
                  fontSize: "0.84rem", color: "#64748b", fontStyle: "italic",
                  marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #f1f5f9",
                }}>{presc.notes}</p>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {presc.medicines?.map((med) => (
                  <div key={med.id} style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    background: "#f8fafc", borderRadius: "10px", padding: "10px 14px",
                  }}>
                    <span style={{ fontSize: "0.84rem", fontWeight: "600", color: "#0f172a", minWidth: "130px" }}>{med.name}</span>
                    <span style={{ fontSize: "0.75rem", color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: "6px", fontWeight: "600" }}>{med.dosage}</span>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{med.frequency}</span>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{med.duration}</span>
                    {med.instructions && <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>{med.instructions}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: "640px", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontWeight: "800", color: "#0f172a", fontSize: "1.1rem", marginBottom: "1.5rem" }}>New Prescription</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">Appointment</label>
                <select value={form.appointmentId} onChange={(e) => setForm({ ...form, appointmentId: e.target.value })} required className="form-input">
                  <option value="">Select confirmed appointment</option>
                  {confirmedAppointments.map((appt) => (
                    <option key={appt.id} value={appt.id}>
                      {appt.patient?.name} — {formatDateTime(appt.date)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Diagnosis</label>
                <input type="text" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} placeholder="e.g. Type 2 Diabetes - Controlled" required className="form-input" />
              </div>

              <div>
                <label className="form-label">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes..." rows={2} className="form-input" style={{ resize: "none" }} />
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Medicines</label>
                  <button type="button" onClick={addMedicine} style={{
                    display: "flex", alignItems: "center", gap: "4px",
                    fontSize: "0.75rem", color: "#2563eb", fontWeight: "700",
                    background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                  }}>
                    <Plus size={13} /> Add Medicine
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {form.medicines.map((med, index) => (
                    <div key={index} style={{
                      display: "grid", gridTemplateColumns: "1fr 0.7fr 0.9fr 0.7fr auto",
                      gap: "8px", alignItems: "center",
                    }}>
                      <input placeholder="Name" value={med.name} onChange={(e) => handleMedicineChange(index, "name", e.target.value)} required className="form-input" style={{ fontSize: "0.8rem", padding: "8px 12px" }} />
                      <input placeholder="Dosage" value={med.dosage} onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)} required className="form-input" style={{ fontSize: "0.8rem", padding: "8px 12px" }} />
                      <input placeholder="Frequency" value={med.frequency} onChange={(e) => handleMedicineChange(index, "frequency", e.target.value)} required className="form-input" style={{ fontSize: "0.8rem", padding: "8px 12px" }} />
                      <input placeholder="Duration" value={med.duration} onChange={(e) => handleMedicineChange(index, "duration", e.target.value)} required className="form-input" style={{ fontSize: "0.8rem", padding: "8px 12px" }} />
                      <button type="button" onClick={() => removeMedicine(index)} style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: "32px", height: "32px", borderRadius: "8px",
                        background: "none", border: "none", cursor: "pointer",
                        color: "#94a3b8", transition: "color 0.15s",
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#dc2626"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}