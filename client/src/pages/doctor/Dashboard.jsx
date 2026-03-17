import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CalendarDays, FileText, Clock, TrendingUp, ArrowRight } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getDoctorStats } from "../../api/doctors";
import { getDoctorAppointments } from "../../api/appointments";
import { formatDateTime, getStatusColor } from "../../lib/utils";
import useAuthStore from "../../store/authStore";

const StatCard = ({ title, value, icon: Icon, bg, text, trend }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon size={20} className={text} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <TrendingUp size={11} /> {trend}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
    <p className="text-sm text-slate-500 font-medium">{title}</p>
  </div>
);

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, apptRes] = await Promise.all([
          getDoctorStats(),
          getDoctorAppointments(),
        ]);
        setStats(statsRes.data.data);
        setAppointments(apptRes.data.data.slice(0, 6));
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

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <PageWrapper
      title={`Good day, ${user?.doctor?.name?.split(" ")[0] || "Doctor"}`}
      subtitle={today}
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Patients" value={stats?.totalPatients ?? 0} icon={Users} bg="bg-blue-50" text="text-blue-600" />
        <StatCard title="Pending" value={stats?.pendingAppointments ?? 0} icon={Clock} bg="bg-amber-50" text="text-amber-600" />
        <StatCard title="Confirmed" value={stats?.confirmedAppointments ?? 0} icon={CalendarDays} bg="bg-violet-50" text="text-violet-600" />
        <StatCard title="Prescriptions" value={stats?.totalPrescriptions ?? 0} icon={FileText} bg="bg-emerald-50" text="text-emerald-600" />
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900">Recent Appointments</h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest patient appointments</p>
          </div>
          <button
            onClick={() => navigate("/doctor/appointments")}
            className="flex items-center gap-1.5 text-sm text-primary-600 font-medium hover:text-primary-700"
          >
            View all <ArrowRight size={15} />
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CalendarDays size={22} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No appointments yet</p>
            <p className="text-slate-400 text-sm mt-1">Appointments will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {appointments.map((appt) => (
              <div key={appt.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-700 font-bold text-sm flex-shrink-0">
                    {appt.patient?.name?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{appt.patient?.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{appt.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xs text-slate-400 hidden sm:block">{formatDateTime(appt.date)}</p>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}