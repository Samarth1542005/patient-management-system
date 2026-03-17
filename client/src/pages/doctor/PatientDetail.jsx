import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User, Heart, Activity, FileText, Calendar } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getPatientHistory, addMedicalHistory, addVitalSigns } from "../../api/patients";
import { formatDate, formatDateTime, getStatusColor, getSeverityColor } from "../../lib/utils";

export default function PatientDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Modal states
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({
    bloodPressure: "", heartRate: "", temperature: "", weight: "", height: "", oxygenSat: ""
  });
  const [historyForm, setHistoryForm] = useState({
    condition: "", severity: "MILD", diagnosedAt: "", notes: ""
  });

  const fetchData = async () => {
    try {
      const res = await getPatientHistory(id);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleAddVitals = async (e) => {
    e.preventDefault();
    try {
      await addVitalSigns(id, {
        ...vitalsForm,
        heartRate: Number(vitalsForm.heartRate),
        temperature: Number(vitalsForm.temperature),
        weight: Number(vitalsForm.weight),
        height: Number(vitalsForm.height),
        oxygenSat: Number(vitalsForm.oxygenSat),
      });
      setShowVitalsModal(false);
      setVitalsForm({ bloodPressure: "", heartRate: "", temperature: "", weight: "", height: "", oxygenSat: "" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddHistory = async (e) => {
    e.preventDefault();
    try {
      await addMedicalHistory(id, historyForm);
      setShowHistoryModal(false);
      setHistoryForm({ condition: "", severity: "MILD", diagnosedAt: "", notes: "" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: User },
    { key: "appointments", label: "Appointments", icon: Calendar },
    { key: "prescriptions", label: "Prescriptions", icon: FileText },
    { key: "history", label: "Medical History", icon: Heart },
    { key: "vitals", label: "Vital Signs", icon: Activity },
  ];

  if (loading) {
    return (
      <PageWrapper title="Patient Detail">
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

  const { patient, appointments, prescriptions, medicalHistory, vitalSigns } = data;

  return (
    <PageWrapper title="Patient Detail" subtitle={patient?.name}>

      {/* Patient Info Card */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="avatar avatar-lg" style={{
            background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
            color: "#2563eb", borderRadius: "50%",
          }}>
            {patient?.name?.[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>{patient?.name}</h2>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {[
                { label: "DOB", value: formatDate(patient?.dob) },
                { label: "Gender", value: patient?.gender },
                { label: "Blood", value: patient?.bloodGroup?.replace("_", " ") || "—" },
                { label: "Phone", value: patient?.phone || "—" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "500" }}>{item.label}:</span>
                  <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: "600" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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

      {/* Tab Content */}
      <div className="animate-fade-in" key={activeTab}>

        {/* Overview */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.9rem", marginBottom: "1rem" }}>Contact Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <p style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>Address</p>
                  <p style={{ fontSize: "0.875rem", color: "#334155" }}>{patient?.address || "—"}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>Emergency Contact</p>
                  <p style={{ fontSize: "0.875rem", color: "#334155" }}>{patient?.emergencyContact || "—"}</p>
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.9rem", marginBottom: "1rem" }}>Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { label: "Total Appointments", value: appointments?.length },
                  { label: "Total Prescriptions", value: prescriptions?.length },
                  { label: "Medical Conditions", value: medicalHistory?.length },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontSize: "0.8rem", color: "#64748b" }}>{item.label}</p>
                    <p style={{ fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Appointments */}
        {activeTab === "appointments" && (
          <div className="card" style={{ overflow: "hidden" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th><th>Reason</th><th>Status</th><th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {appointments?.length === 0 ? (
                  <tr><td colSpan={4}><div className="empty-state"><h3>No appointments</h3></div></td></tr>
                ) : appointments?.map((appt) => (
                  <tr key={appt.id}>
                    <td style={{ color: "#334155" }}>{formatDateTime(appt.date)}</td>
                    <td style={{ color: "#334155" }}>{appt.reason}</td>
                    <td><span className={`status-badge ${getStatusColor(appt.status)}`}>{appt.status}</span></td>
                    <td style={{ color: "#64748b" }}>{appt.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Prescriptions */}
        {activeTab === "prescriptions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {prescriptions?.length === 0 ? (
              <div className="card empty-state"><h3>No prescriptions</h3></div>
            ) : prescriptions?.map((presc) => (
              <div key={presc.id} className="card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: presc.notes ? "0.75rem" : "1rem" }}>
                  <div>
                    <h3 style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.95rem" }}>{presc.diagnosis}</h3>
                    <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "3px" }}>{formatDateTime(presc.createdAt)}</p>
                  </div>
                </div>
                {presc.notes && <p style={{ fontSize: "0.84rem", color: "#64748b", marginBottom: "1rem", fontStyle: "italic" }}>{presc.notes}</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {presc.medicines?.map((med) => (
                    <div key={med.id} style={{
                      display: "flex", alignItems: "center", gap: "16px",
                      background: "#f8fafc", borderRadius: "10px",
                      padding: "10px 14px",
                    }}>
                      <span style={{ fontSize: "0.84rem", fontWeight: "600", color: "#0f172a", minWidth: "120px" }}>{med.name}</span>
                      <span style={{ fontSize: "0.75rem", color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: "6px", fontWeight: "600" }}>{med.dosage}</span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{med.frequency}</span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{med.duration}</span>
                      {med.instructions && <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>{med.instructions}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Medical History */}
        {activeTab === "history" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
              <button onClick={() => setShowHistoryModal(true)} className="btn btn-primary" style={{ fontSize: "0.84rem" }}>
                + Add Condition
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {medicalHistory?.length === 0 ? (
                <div className="card empty-state">
                  <div className="empty-state-icon"><Heart size={22} color="#94a3b8" /></div>
                  <h3>No medical history</h3>
                  <p>Add conditions using the button above</p>
                </div>
              ) : medicalHistory?.map((item) => (
                <div key={item.id} className="card" style={{
                  padding: "1.25rem 1.5rem",
                  display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                }}>
                  <div>
                    <h4 style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{item.condition}</h4>
                    <div style={{ display: "flex", gap: "16px", marginTop: "6px" }}>
                      <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Diagnosed: {formatDate(item.diagnosedAt)}</p>
                      <p style={{ fontSize: "0.8rem", color: item.resolvedAt ? "#059669" : "#d97706" }}>
                        {item.resolvedAt ? `Resolved: ${formatDate(item.resolvedAt)}` : "Ongoing"}
                      </p>
                    </div>
                    {item.notes && <p style={{ fontSize: "0.84rem", color: "#64748b", marginTop: "8px" }}>{item.notes}</p>}
                  </div>
                  <span className={`status-badge ${getSeverityColor(item.severity)}`}>{item.severity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vital Signs */}
        {activeTab === "vitals" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
              <button onClick={() => setShowVitalsModal(true)} className="btn btn-primary" style={{ fontSize: "0.84rem" }}>
                + Record Vitals
              </button>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th><th>BP</th><th>Heart Rate</th><th>Temp</th><th>Weight</th><th>SpO2</th>
                  </tr>
                </thead>
                <tbody>
                  {vitalSigns?.length === 0 ? (
                    <tr><td colSpan={6}><div className="empty-state">
                      <div className="empty-state-icon"><Activity size={22} color="#94a3b8" /></div>
                      <h3>No vitals recorded</h3><p>Record vitals using the button above</p>
                    </div></td></tr>
                  ) : vitalSigns?.map((v) => (
                    <tr key={v.id}>
                      <td style={{ color: "#334155" }}>{formatDateTime(v.recordedAt)}</td>
                      <td><span style={{ fontWeight: "600", color: "#0f172a", background: "#f8fafc", padding: "3px 10px", borderRadius: "6px", fontSize: "0.84rem" }}>{v.bloodPressure || "—"}</span></td>
                      <td style={{ color: "#334155" }}>{v.heartRate ? `${v.heartRate} bpm` : "—"}</td>
                      <td style={{ color: "#334155" }}>{v.temperature ? `${v.temperature}°C` : "—"}</td>
                      <td style={{ color: "#334155" }}>{v.weight ? `${v.weight} kg` : "—"}</td>
                      <td style={{ color: "#334155" }}>{v.oxygenSat ? `${v.oxygenSat}%` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Vitals Modal */}
      {showVitalsModal && (
        <div className="modal-overlay" onClick={() => setShowVitalsModal(false)}>
          <div className="modal-content" style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontWeight: "800", color: "#0f172a", fontSize: "1.05rem", marginBottom: "1.5rem" }}>Record Vital Signs</h3>
            <form onSubmit={handleAddVitals} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { label: "Blood Pressure", key: "bloodPressure", placeholder: "120/80" },
                  { label: "Heart Rate (bpm)", key: "heartRate", placeholder: "78" },
                  { label: "Temperature (°C)", key: "temperature", placeholder: "98.6" },
                  { label: "Weight (kg)", key: "weight", placeholder: "65" },
                  { label: "Height (cm)", key: "height", placeholder: "170" },
                  { label: "SpO2 (%)", key: "oxygenSat", placeholder: "98" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="form-label">{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={vitalsForm[field.key]}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, [field.key]: e.target.value })}
                      className="form-input"
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowVitalsModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Vitals</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medical History Modal */}
      {showHistoryModal && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="modal-content" style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontWeight: "800", color: "#0f172a", fontSize: "1.05rem", marginBottom: "1.5rem" }}>Add Medical Condition</h3>
            <form onSubmit={handleAddHistory} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">Condition</label>
                <input type="text" placeholder="e.g. Type 2 Diabetes" value={historyForm.condition} onChange={(e) => setHistoryForm({ ...historyForm, condition: e.target.value })} required className="form-input" />
              </div>
              <div>
                <label className="form-label">Severity</label>
                <select value={historyForm.severity} onChange={(e) => setHistoryForm({ ...historyForm, severity: e.target.value })} className="form-input">
                  <option value="MILD">Mild</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="SEVERE">Severe</option>
                </select>
              </div>
              <div>
                <label className="form-label">Diagnosed At</label>
                <input type="date" value={historyForm.diagnosedAt} onChange={(e) => setHistoryForm({ ...historyForm, diagnosedAt: e.target.value })} required className="form-input" />
              </div>
              <div>
                <label className="form-label">Notes</label>
                <textarea placeholder="Additional notes..." value={historyForm.notes} onChange={(e) => setHistoryForm({ ...historyForm, notes: e.target.value })} rows={3} className="form-input" style={{ resize: "none" }} />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowHistoryModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Condition</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </PageWrapper>
  );
}