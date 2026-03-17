import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, X } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getDoctorAppointments } from "../../api/appointments";
import { createPrescription, getPatientPrescriptions } from "../../api/prescriptions";
import { getAllPatients } from "../../api/patients";
import { formatDateTime } from "../../lib/utils";

const emptyMedicine = { name: "", dosage: "", frequency: "", duration: "", instructions: "" };

export default function DoctorPrescriptions() {
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

      <div className="flex items-center justify-between mb-6">
        {/* Patient Filter */}
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700"
        >
          <option value="">Select a patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={16} />
          New Prescription
        </button>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {!selectedPatient ? (
          <div className="bg-white rounded-xl border border-slate-100 px-6 py-16 text-center">
            <FileText size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-400 text-sm">Select a patient to view their prescriptions</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 px-6 py-16 text-center">
            <FileText size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-400 text-sm">No prescriptions for this patient</p>
          </div>
        ) : (
          prescriptions.map((presc) => (
            <div key={presc.id} className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800">{presc.diagnosis}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(presc.createdAt)}</p>
                </div>
              </div>
              {presc.notes && (
                <p className="text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">{presc.notes}</p>
              )}
              <div className="space-y-2">
                {presc.medicines?.map((med) => (
                  <div key={med.id} className="flex items-center gap-4 bg-slate-50 rounded-lg px-4 py-2.5">
                    <span className="text-sm font-medium text-slate-800 w-36">{med.name}</span>
                    <span className="text-xs text-slate-500 w-16">{med.dosage}</span>
                    <span className="text-xs text-slate-500 w-28">{med.frequency}</span>
                    <span className="text-xs text-slate-500 w-20">{med.duration}</span>
                    {med.instructions && <span className="text-xs text-slate-400 italic">{med.instructions}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Prescription Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-slate-800 text-lg mb-5">New Prescription</h3>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Appointment</label>
                <select
                  value={form.appointmentId}
                  onChange={(e) => setForm({ ...form, appointmentId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select confirmed appointment</option>
                  {confirmedAppointments.map((appt) => (
                    <option key={appt.id} value={appt.id}>
                      {appt.patient?.name} — {formatDateTime(appt.date)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Diagnosis</label>
                <input
                  type="text"
                  value={form.diagnosis}
                  onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                  placeholder="e.g. Type 2 Diabetes - Controlled"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              {/* Medicines */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-600">Medicines</label>
                  <button type="button" onClick={addMedicine} className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1">
                    <Plus size={13} /> Add Medicine
                  </button>
                </div>
                <div className="space-y-2">
                  {form.medicines.map((med, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 items-center">
                      <input placeholder="Name" value={med.name} onChange={(e) => handleMedicineChange(index, "name", e.target.value)} required className="px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      <input placeholder="Dosage" value={med.dosage} onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)} required className="px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      <input placeholder="Frequency" value={med.frequency} onChange={(e) => handleMedicineChange(index, "frequency", e.target.value)} required className="px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      <input placeholder="Duration" value={med.duration} onChange={(e) => handleMedicineChange(index, "duration", e.target.value)} required className="px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      <button type="button" onClick={() => removeMedicine(index)} className="flex items-center justify-center text-red-400 hover:text-red-600">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">Create Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}