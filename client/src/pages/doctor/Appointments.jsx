import { useState, useEffect } from "react";
import { CalendarDays, Clock, CheckCircle, XCircle, ChevronRight } from "lucide-react";
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
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
              statusFilter === f.value
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Appointments */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-20 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalendarDays size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-600 font-semibold">No appointments found</p>
          <p className="text-slate-400 text-sm mt-1">Try changing the filter above</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div key={appt.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-primary-700 font-bold text-base flex-shrink-0">
                    {appt.patient?.name?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{appt.patient?.name}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{appt.reason}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Clock size={12} className="text-slate-400" />
                      <p className="text-xs text-slate-400">{formatDateTime(appt.date)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusColor(appt.status)}`}>
                    {appt.status}
                  </span>

                  {appt.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(appt.id, "CONFIRMED")}
                        disabled={updating === appt.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors"
                      >
                        <CheckCircle size={13} /> Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(appt.id, "CANCELLED")}
                        disabled={updating === appt.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-100 disabled:opacity-50 transition-colors"
                      >
                        <XCircle size={13} /> Cancel
                      </button>
                    </div>
                  )}

                  {appt.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleStatusUpdate(appt.id, "COMPLETED")}
                      disabled={updating === appt.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle size={13} /> Mark Complete
                    </button>
                  )}
                </div>
              </div>

              {appt.notes && (
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <p className="text-sm text-slate-500 bg-slate-50 rounded-xl px-4 py-2.5">{appt.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}