import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, FileText, Clock } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyProfile } from "../../api/patients";
import { getMyAppointments } from "../../api/appointments";
import { getMyPrescriptions } from "../../api/prescriptions";
import { formatDateTime, getStatusColor } from "../../lib/utils";
import useAuthStore from "../../store/authStore";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-6 border border-slate-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default function PatientDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, prescRes] = await Promise.all([
          getMyAppointments(),
          getMyPrescriptions(),
        ]);
        setAppointments(apptRes.data.data);
        setPrescriptions(prescRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <PageWrapper title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  const pendingAppointments = appointments.filter(a => a.status === "PENDING").length;
  const confirmedAppointments = appointments.filter(a => a.status === "CONFIRMED").length;

  return (
    <PageWrapper
      title={`Welcome, ${user?.patient?.name || "Patient"} 👋`}
      subtitle="Here's your health overview"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard title="Total Appointments" value={appointments.length} icon={CalendarDays} color="bg-blue-500" />
        <StatCard title="Pending" value={pendingAppointments} icon={Clock} color="bg-yellow-500" />
        <StatCard title="Prescriptions" value={prescriptions.length} icon={FileText} color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-xl border border-slate-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">My Appointments</h3>
            <button
              onClick={() => navigate("/patient/appointments")}
              className="text-sm text-primary-600 hover:underline font-medium"
            >
              View all
            </button>
          </div>
          {appointments.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">
              <CalendarDays size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No appointments yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {appointments.slice(0, 4).map((appt) => (
                <div key={appt.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{appt.doctor?.name}</p>
                    <p className="text-xs text-slate-400">{appt.reason}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(appt.date)}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white rounded-xl border border-slate-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">My Prescriptions</h3>
            <button
              onClick={() => navigate("/patient/prescriptions")}
              className="text-sm text-primary-600 hover:underline font-medium"
            >
              View all
            </button>
          </div>
          {prescriptions.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">
              <FileText size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No prescriptions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {prescriptions.slice(0, 4).map((presc) => (
                <div key={presc.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-800">{presc.diagnosis}</p>
                    <p className="text-xs text-slate-400">{formatDateTime(presc.createdAt)}</p>
                  </div>
                  <p className="text-xs text-slate-400">Dr. {presc.doctor?.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {presc.medicines?.length} medicine(s) prescribed
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}