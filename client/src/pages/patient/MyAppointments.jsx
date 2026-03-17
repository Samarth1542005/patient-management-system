import { useState, useEffect } from "react";
import { CalendarDays, Plus, X } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyAppointments, bookAppointment, cancelAppointment } from "../../api/appointments";
import { getAllDoctors } from "../../api/doctors";
import { formatDateTime, getStatusColor } from "../../lib/utils";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const [form, setForm] = useState({ doctorId: "", date: "", reason: "" });
  const [error, setError] = useState("");

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
    try {
      await bookAppointment(form);
      setShowModal(false);
      setForm({ doctorId: "", date: "", reason: "" });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment.");
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
    <PageWrapper title="My Appointments" subtitle="View and manage your appointments">

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={16} />
          Book Appointment
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 px-6 py-16 text-center">
            <CalendarDays size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-400 text-sm">No appointments yet</p>
          </div>
        ) : (
          appointments.map((appt) => (
            <div key={appt.id} className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                    {appt.doctor?.name?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{appt.doctor?.name}</p>
                    <p className="text-sm text-slate-500">{appt.doctor?.specialization}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{appt.reason}</p>
                    <p className="text-xs text-slate-400">{formatDateTime(appt.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(appt.status)}`}>
                    {appt.status}
                  </span>
                  {appt.status === "PENDING" && (
                    <button
                      onClick={() => handleCancel(appt.id)}
                      disabled={cancelling === appt.id}
                      className="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-medium rounded-lg hover:bg-red-100 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              {appt.notes && (
                <p className="text-sm text-slate-500 mt-3 pt-3 border-t border-slate-50">
                  {appt.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Book Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-bold text-slate-800 text-lg mb-5">Book Appointment</h3>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Select Doctor</label>
                <select
                  value={form.doctorId}
                  onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Reason</label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Reason for appointment..."
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}