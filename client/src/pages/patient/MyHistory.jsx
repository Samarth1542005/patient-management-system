import { useState, useEffect } from "react";
import { Heart, Activity, Calendar, FileText } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyProfile } from "../../api/patients";
import { getPatientHistory } from "../../api/patients";
import { formatDate, formatDateTime, getSeverityColor, getStatusColor } from "../../lib/utils";
import useAuthStore from "../../store/authStore";

export default function MyHistory() {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("conditions");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const patientId = user?.patient?.id;
        if (!patientId) return;
        const res = await getPatientHistory(patientId);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const tabs = [
    { key: "conditions", label: "Medical Conditions", icon: Heart },
    { key: "vitals", label: "Vital Signs", icon: Activity },
  ];

  if (loading) {
    return (
      <PageWrapper title="My History">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  const { medicalHistory, vitalSigns } = data || {};

  return (
    <PageWrapper title="My Health History" subtitle="Your medical conditions and vital signs over time">

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

      {/* Medical Conditions */}
      {activeTab === "conditions" && (
        <div className="space-y-3">
          {medicalHistory?.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 px-6 py-16 text-center">
              <Heart size={36} className="mx-auto mb-3 text-slate-300" />
              <p className="text-slate-400 text-sm">No medical conditions recorded</p>
            </div>
          ) : (
            medicalHistory?.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-100 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800">{item.condition}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Diagnosed: {formatDate(item.diagnosedAt)}
                      {item.resolvedAt
                        ? ` • Resolved: ${formatDate(item.resolvedAt)}`
                        : " • Ongoing"}
                    </p>
                    {item.notes && (
                      <p className="text-sm text-slate-500 mt-2">{item.notes}</p>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getSeverityColor(item.severity)}`}>
                    {item.severity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Vital Signs */}
      {activeTab === "vitals" && (
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
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No vital signs recorded
                  </td>
                </tr>
              ) : (
                vitalSigns?.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-700">{formatDateTime(v.recordedAt)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{v.bloodPressure || "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{v.heartRate ? `${v.heartRate} bpm` : "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{v.temperature ? `${v.temperature}°C` : "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{v.weight ? `${v.weight} kg` : "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{v.oxygenSat ? `${v.oxygenSat}%` : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </PageWrapper>
  );
}