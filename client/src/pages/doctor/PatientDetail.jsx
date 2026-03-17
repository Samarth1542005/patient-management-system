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
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  const { patient, appointments, prescriptions, medicalHistory, vitalSigns } = data;

  return (
    <PageWrapper title="Patient Detail" subtitle={patient?.name}>

      {/* Patient Info Card */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">
            {patient?.name?.[0]}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-800">{patient?.name}</h2>
            <div className="flex gap-6 mt-1">
              <span className="text-sm text-slate-500">DOB: {formatDate(patient?.dob)}</span>
              <span className="text-sm text-slate-500">Gender: {patient?.gender}</span>
              <span className="text-sm text-slate-500">Blood: {patient?.bloodGroup?.replace("_", " ") || "—"}</span>
              <span className="text-sm text-slate-500">Phone: {patient?.phone || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-6 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div><p className="text-xs text-slate-400">Address</p><p className="text-sm text-slate-700">{patient?.address || "—"}</p></div>
              <div><p className="text-xs text-slate-400">Emergency Contact</p><p className="text-sm text-slate-700">{patient?.emergencyContact || "—"}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Summary</h3>
            <div className="space-y-3">
              <div><p className="text-xs text-slate-400">Total Appointments</p><p className="text-sm font-semibold text-slate-700">{appointments?.length}</p></div>
              <div><p className="text-xs text-slate-400">Total Prescriptions</p><p className="text-sm font-semibold text-slate-700">{prescriptions?.length}</p></div>
              <div><p className="text-xs text-slate-400">Medical Conditions</p><p className="text-sm font-semibold text-slate-700">{medicalHistory?.length}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Appointments */}
      {activeTab === "appointments" && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Reason</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {appointments?.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400 text-sm">No appointments</td></tr>
              ) : appointments?.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-700">{formatDateTime(appt.date)}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{appt.reason}</td>
                  <td className="px-6 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(appt.status)}`}>{appt.status}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-500">{appt.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Prescriptions */}
      {activeTab === "prescriptions" && (
        <div className="space-y-4">
          {prescriptions?.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 px-6 py-12 text-center text-slate-400 text-sm">No prescriptions</div>
          ) : prescriptions?.map((presc) => (
            <div key={presc.id} className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800">{presc.diagnosis}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(presc.createdAt)}</p>
                </div>
              </div>
              {presc.notes && <p className="text-sm text-slate-600 mb-4">{presc.notes}</p>}
              <div className="space-y-2">
                {presc.medicines?.map((med) => (
                  <div key={med.id} className="flex items-center gap-4 bg-slate-50 rounded-lg px-4 py-2.5">
                    <span className="text-sm font-medium text-slate-800 w-32">{med.name}</span>
                    <span className="text-xs text-slate-500">{med.dosage}</span>
                    <span className="text-xs text-slate-500">{med.frequency}</span>
                    <span className="text-xs text-slate-500">{med.duration}</span>
                    {med.instructions && <span className="text-xs text-slate-400 italic">{med.instructions}</span>}
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
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              + Add Condition
            </button>
          </div>
          <div className="space-y-3">
            {medicalHistory?.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-100 px-6 py-12 text-center text-slate-400 text-sm">No medical history</div>
            ) : medicalHistory?.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-100 p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800">{item.condition}</h4>
                  <p className="text-xs text-slate-400 mt-1">Diagnosed: {formatDate(item.diagnosedAt)} {item.resolvedAt ? `• Resolved: ${formatDate(item.resolvedAt)}` : "• Ongoing"}</p>
                  {item.notes && <p className="text-sm text-slate-500 mt-1">{item.notes}</p>}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getSeverityColor(item.severity)}`}>{item.severity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vital Signs */}
      {activeTab === "vitals" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowVitalsModal(true)}
              className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              + Record Vitals
            </button>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">BP</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Heart Rate</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Temp</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Weight</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">SpO2</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vitalSigns?.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">No vitals recorded</td></tr>
                ) : vitalSigns?.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-700">{formatDateTime(v.recordedAt)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{v.bloodPressure || "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{v.heartRate ? `${v.heartRate} bpm` : "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{v.temperature ? `${v.temperature}°C` : "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{v.weight ? `${v.weight} kg` : "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{v.oxygenSat ? `${v.oxygenSat}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vitals Modal */}
      {showVitalsModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-slate-800 mb-5">Record Vital Signs</h3>
            <form onSubmit={handleAddVitals} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Blood Pressure", key: "bloodPressure", placeholder: "120/80" },
                  { label: "Heart Rate (bpm)", key: "heartRate", placeholder: "78" },
                  { label: "Temperature (°C)", key: "temperature", placeholder: "98.6" },
                  { label: "Weight (kg)", key: "weight", placeholder: "65" },
                  { label: "Height (cm)", key: "height", placeholder: "170" },
                  { label: "SpO2 (%)", key: "oxygenSat", placeholder: "98" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={vitalsForm[field.key]}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, [field.key]: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowVitalsModal(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medical History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-slate-800 mb-5">Add Medical Condition</h3>
            <form onSubmit={handleAddHistory} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Condition</label>
                <input
                  type="text"
                  placeholder="e.g. Type 2 Diabetes"
                  value={historyForm.condition}
                  onChange={(e) => setHistoryForm({ ...historyForm, condition: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Severity</label>
                <select
                  value={historyForm.severity}
                  onChange={(e) => setHistoryForm({ ...historyForm, severity: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="MILD">Mild</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="SEVERE">Severe</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Diagnosed At</label>
                <input
                  type="date"
                  value={historyForm.diagnosedAt}
                  onChange={(e) => setHistoryForm({ ...historyForm, diagnosedAt: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
                <textarea
                  placeholder="Additional notes..."
                  value={historyForm.notes}
                  onChange={(e) => setHistoryForm({ ...historyForm, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowHistoryModal(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </PageWrapper>
  );
}